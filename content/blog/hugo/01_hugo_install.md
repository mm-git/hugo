+++
date = "2016-07-26T11:38:58+09:00"
draft = false
slug = "HugoInsatallation"
tags = ["Hugo"]
title = "Hugoをinstallする"
description = "githubでは、github pagesという仕組みを利用して、自分のサイトを公開する機能がある。今回Hugoを使ってこのサイトを作成してみた。"

+++

## Hugoの導入

<a href="https://gohugo.io/"><img title="Hugo :: A fast and modern static website engine" src="http://capture.heartrails.com/200x150/cool?https://gohugo.io/" alt="https://gohugo.io/" width="200" height="150" /></a>

githubでは、github pagesという仕組みを利用して、自分のサイトを公開する機能がある。簡単にいうと、リポジトリに登録したファイルがそのままサイトとして公開されるようになっている。
リポジトリに登録するファイルを自動生成して公開する仕組みにどんなものがあるのか調べていると、JekyllやHugoといったものが見つかった。Hugoというのが動作としては速いらしいということで、今回Hugoを使ってこのサイトを作成してみた。

<!--more-->

### インストール

私はmacで作業するのでhomebrewでインストールした。

``` bash
brew install hugo
hugo new site hugo
cd hugo
git init
```

### テーマのインストール

テーマは themesフォルダ内に使用するテーマをgit cloneしてもいいのだけれど、下記のようにsubmoduleとして登録するようにしてみた。こうすることで、テーマ自体を自分のリポジトリに含めずに管理することができる。なお、テーマはhugo-unoを選択してみた。

``` bash
cd themes
git submodule add https://github.com/fredrikloch/hugo-uno hugo-uno
cd ..
```

※git initを実行していない、つまり親フォルダに .git フォルダが無いと、git submoduleできないので注意。


### 最低限の設定

現状の設定は [mm-git/hugo/config.toml](https://github.com/mm-git/hugo/blob/master/config.toml "mm-git/hugo/config.toml")を参照。
とりあえずテーマの指定をconfig.tomlに追記

```
theme = "hugo-uno"    << テーマをここで指定しておく
```

### ローカルで表示

下記のようにしてserverを起動した後、localhost:1313にアクセスするとhugo-unoのテーマでページが表示されます。

``` bash
hugo server
```

<img title="hugo-uno" src="https://goo.gl/ynu35b" alt="hugo-uno" />
