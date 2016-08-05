+++
date = "2016-08-05T12:24:34+09:00"
draft = false
slug = "dockerhub"
tags = ["docker", "github"]
title = "docker hubにboxを登録する"
description = "最近名前をよく聞くようになったdocker。Docker hubは、dockerで使うimageをクラウド上に置いておくことができる場所だ。今回、werckerの処理を高速化するためにdockerにimageを登録してみたので、その手順を書いておく。"

+++

## docker hub

<a href="https://hub.docker.com/"><img title="Untitled" src="http://capture.heartrails.com/200x150/cool/1470414919790?https://hub.docker.com/" alt="https://hub.docker.com/" width="200" height="150" /></a>

最近名前をよく聞くようになったdocker。Docker hubは、dockerで使うimageをクラウド上に置いておくことができる場所だ。ざっくり説明すると、

- 自分が作ったimageを世界に公開することもできるし、プライベートなimageも置くことができる。
- 2016-08-05現在、無料のプランだと、プライベートなimageは１つまで。並列処理でビルドできるimageは1つだけ。

といった感じである。

今回、werckerの処理を高速化するためにdockerにimageを登録してみたので、その手順を書いておく。なお、下記はgithubを使う場合で説明している。Bitbucketでも手順はほぼ同じと思われる。

<!--more-->

## docker hubを使うまでの手順

この段階では下記の点を除いてあまりハマらなかったので詳細は書かないが、下記のようにする。

1. [Docker](https://www.docker.com/) または [Docker hub](https://hub.docker.com/)でアカウントを登録する。
  - どちらで登録しても、アカウントは共通。
2. [Docker hub](https://hub.docker.com/)にログインする。
3. Docker hubとgithubのアカウントをリンクする。アカウントのSettingメニューでLinked Accounts & Servicesタブを選択すると、リンクのボタンがある。

### 注意点

おそらく、いくらかの人はこの時点でgithubのアカウント名と同じアカウント名でDocker IDを取得できないと思われる。後でも説明するが、imageの名前を指定する際は、`dockerのID/imageの名前(=Docker hub上のレポジトリ名)`の様になる。`githubのID`ではないし、`githubのレポジトリ名`でもない点に注意。

- `githubのID/githubのレポジトリ名`にしがちだが、そんなimageは無いとエラーになり盛大にハマった。


## docker hubにimageを登録する

手順としては大きく下記である。

1. github上にDockerfileを置いたレポジトリを作成する。
2. Docker hub上でもレポジトリを用意し、上記のレポジトリから自動でimageを作成するように設定する。

### githubにDockerfileを置いたレポジトリを作成

具体的には下記を参照。(HugoのSyntax hightlightでsolarized color schemeを使うためのboxを作ってみた)

> [mm-git/hugo-box](https://github.com/mm-git/hugo-box)
 
##### Dockerfile
```
FROM python:2.7.12

MAINTAINER mm-git 

RUN apt-get update -y
RUN apt-get upgrade -y
RUN pip install pygments pygments-style-solarized
```

- Dockerfileは`D`だけ大文字。
  - ローカル環境で`docker build -t test .`の様にしてテストしたところ、dockerfileだとファイルが無いと怒られた。
- FROMではベースとなる既存のimage名(とバージョン)を指定する。
- Official base imageの一覧はここにある。 [Explore Official Repositories](https://hub.docker.com/explore/)
  - Officialのimageは`DockerのID`は無しで、`imageの名前`(およびバージョン)のみを指定する。
- 右上の検索ボックスで誰かが作った公開されているimageを検索できる。
  - Publicなのimageは`DockerのID/imageの名前`(およびバージョン)を指定する。
  - 検索できるものの、ある程度名前がわかっていないとhitしないかもしれない。

### Docker hub上でもレポジトリを作成

下記参照。

> [mmgit/hugo-box](https://hub.docker.com/r/mmgit/hugo-box/)
>
> <sub style="font-size:0.8em">github ID: mm-git, Docker ID:mmgitの様に、微妙に異なる。全く違う人もたくさんいる。</sub>

1. レポジトリを作成
  - Docker hubに初めてログインしたあと、ダッシュボードにレポジトリを作成するボタンがあるが、githubと連携させるボタンは無い様である(2016-08-05現在)。画面の右上のCreateメニューにはCreate Automated buildがあるので、それを選択する。
2. githubのレポジトリを選択する画面で対象となるレポジトリを選択する。
3. 次の画面ではそのままCreate。

これで、`git push`するたびにimageが更新されるはずである。手動でビルドする場合は、Build SetingタブにTriggerボタンがあるので、押すとビルドされる。

## 作成したPublic imageを使う

上記の例だと、作成してイメージは`mmgit/hugo-box`という名前で指定できる。

- `docker pull mmgit/hugo-box`として使う
- DockerfileのFROMに`mmgit/hugo-box`と書いて更に拡張
- werckerの場合は、wercker.ymlに`box: mmgit/hugo-box`の様に書く。
  - werckerはもっともっと盛大にハマったので後日記事にする予定。
