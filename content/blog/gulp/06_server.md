+++
date = "2016-08-25T08:21:43+09:00"
description = "gulpでローカル環境にテスト用のサーバを動かしてみる"
draft = false
slug = "gulpserver"
tags = ["node", "gulp", "browsersync", "php"]
title = "[gulp] ローカルサーバー編"

+++

## gulpを使ってローカルサーバーを起動してみる

今回はgulpを使って、ローカル環境でサイトの表示を確認してみる。具体的には下記のようなテスト環境が実行できるようにしてみる。

- プロジェクトの`app`フォルダを公開フォルダとしてサーバを起動する。
- サイトにはphpファイルが含まれている。phpも動くサーバを起動する。
- `src`フォルダのcoffeeファイルやscssファイルを更新したら、ブラウザを自動でReloadさせる。

上記を実現するのに、この記事では**`browser-sync`、`gulp-connect-php`**を利用する。なお、gulp自体の設定については下記の記事参照。

> [gulpの初期設定](https://code-house.jp/post/gulp/gulpsetting/)

<!--more-->

## フォルダの構成

```
project_folder
├── 📁app     ★ここを公開する
├── 📁gulp
│   ├── config.coffee
│   └── 📁tasks
│       ├── server.coffee
│            :
├── gulpfile.coffee
├── 📁node_modules
├── package.json
└── 📁src
```

## サーバスクリプト

### インストールするnpmモジュール

スクリプトの実行に必要なnpmモジュールをインストールしておく。

```
npm i fs gulp-connect-php browser-sync -D`
```

### gulp/tasks/server.coffee

##### gulp/tasks/server.coffee
```coffee
gulp = require('gulp')
browserSync = require('browser-sync').create()
php = require('gulp-connect-php')
config = require('../config')

gulp.task 'php', ->
  php.server({
    base: 'app'
    port: 8000
  })

gulp.task 'connect', ->
  browserSync.init({
    baseDir: 'app'
    proxy: 'localhost:8000'
  })

gulp.task 'reload', ->
  browserSync.reload()

gulp.task 'server', ['php', 'connect'], ->
  gulp.watch(config.src + '/**/*.coffee', ['coffee'])
  gulp.watch(config.src + '/**/*.scss', ['sass'])

  gulp.watch(config.dest + "/**/*", ['reload'])
```

- まずポート番号8000で起動するphpタスクを作成している。
- 続いて、`baseDir`(公開フォルダ)を`app`としたbrowserSyncのタスクを作成する。タスク名は`connect`。ブラウザからの要求がphpファイルであった場合、`proxy`の設定により、内部的にポート8000で通信を行う。browserSync自体は初期設定でポート3000で起動する。
- `reload`タスクはブラウザをリロードさせるためのタスク。`browserSync.reload()`を実行するだけで、簡単にリロードさせることができる。
- 最後に`server`タスクを作成する。このタスクが実際にgulpコマンドで実行するタスクとなる(他のタスクは直接実行することはない)。`gulp server`を実行すると、`php`と`connect`タスクが実行される。
- `server`タスクの中身にはファイルの変更を監視するスクリプトを書くことができる。coffeeファイルの変更があれば`coffee`を、scssファイルの変更があれば`sass`を実行するようになっている。
- `coffee`や`sass`が実行されると、`app`フォルダの中身が変わる。`app`フォルダの中身が変わると`reload`を実行するようになっている。


### server実行

```bash
$ gulp server
[hh:mn:ss] Requiring external module coffee-script/register
(node:2591) fs: re-evaluating native module sources is not supported. If you are using the graceful-fs module, please update it to a more recent version.
[hh:mn:ss] Using gulpfile project_folder/gulpfile.coffee
[hh:mn:ss] Starting 'php'...
[hh:mn:ss] Finished 'php' after ## ms
[hh:mn:ss] Starting 'connect'...
[hh:mn:ss] Finished 'connect' after ## ms
[hh:mn:ss] Starting 'server'...
[hh:mn:ss] Finished 'server' after ### ms
PHP 5.6.24 Development Server started at Thu Aug 25 hh:mm:ss yyyy
Listening on http://127.0.0.1:8000
Document root is project_folder/app
Press Ctrl-C to quit.
[BS] Proxying: http://localhost:8000
[BS] Access URLs:
 -------------------------------------
       Local: http://localhost:3000
    External: http://###.###.###.###:3000
 -------------------------------------
          UI: http://localhost:3001
 UI External: http://###.###.###.###:3001
 -------------------------------------
 ```
 
 - 上記を実行すると、デフォルトのブラウザで`http://localhost:3000`が開く。
   - ちなみに、`http://localhost:3001`にアクセスすると、browserSyncの管理画面が開く。
 - `src`フォルダが更新されると、ブラウザは自動でリロードされる。
 - 終了する場合は`Ctrl+C`を押す。
 