+++
date = "2016-08-26T15:18:08+09:00"
description = "Hugoの記事をwerckerで自動公開するようにしたが更新に時間がかかる。独自のdockerイメージを作って高速化してみる"
draft = false
slug = "hugowercker2"
tags = ["Hugo", "git", "github", "wercker", "docker"]
title = "[Hugo] werckerを使って記事の公開を自動化する２[高速化]"

+++

## Hugo記事公開を高速化する

[前回の記事](https://code-house.jp/2016/08/24/hugowercker/)では、標準でよういされているdockerのboxイメージを利用して、werckerを使って記事を公開していた。しかし、記事の公開までに**５〜７分ぐらいの時間がかかっていた。**これは非常にもどかしい。
今回の記事では、独自のdockerイメージを使うことで高速化を行ってみる。

<!--more-->

## 前回のwercker.yml


### wercker.yml

##### wercker.yml
```yaml
box: python:2.7-slim
build:
  steps:
    - install-packages:
        packages: git
    - pip-install:
        requirements_file: ""
        packages_list: "pygments-style-solarized"
    - script:
        name: initialize git submodules
        code: git submodule update --init
    - arjen/hugo-build:
        theme: hugo-uno
        flags: --buildDrafts=false -v
deploy:
  steps:
    - install-packages:
        packages: git ssh-client
    - leipert/git-push:
        gh_oauth: $GIT_TOKEN
        repo: mm-git/mm-git.github.io
        branch: master
        basedir: public
```

### なぜ遅いか？

- Hugoの記事をビルドするたびに、`git`、`ssh`、`pygments-style-solarized`をインストールしているため。
  - それでも上記は、`apt-get update`が無いだけだいぶマシである。
  - `Python 2.7`までインストールしていたら、もっとかかっていただろう。


## 高速化

### 独自のdocker boxを作成する。

`git`、`ssh`、`pygments-style-solarized`がインストール済みのdocker boxを作成してみる。werckerで利用するには、docker boxがdocker hubに登録されている必要がある。docker boxの作り方は下記の記事を参照。

> [docker hubにboxを登録する](https://code-house.jp/2016/08/05/dockerhub/)


### 独自docker boxを使ったwercker.yml

##### wercker.yml
```yaml
box: mmgit/hugo-box
build:
  steps:
    - script:
        name: initialize git submodules
        code: git submodule update --init
    - arjen/hugo-build:
        theme: hugo-uno
        flags: --buildDrafts=false -v
deploy:
  steps:
    - leipert/git-push:
        gh_oauth: $GIT_TOKEN
        repo: mm-git/mm-git.github.io
        branch: master
        basedir: public
```

- 必要なものがインストールされたboxを使うことで、**体感的には１〜２分で記事が配信されるようになった。**
- wercker.ymlもhugoのビルドとデプロイのみの記述になり、非常にスッキリした。