+++
date = "2016-08-17T15:19:47+09:00"
draft = false
slug = "gulpcoffee"
tags = ["node", "gulp", "coffeescript"]
title = "[gulp] coffee script編"
description = "coffeescriptのファイルをwebpackを使ってjsファイルに変換する。"

+++

## gulp を使った coffee→js, min.js変換

gulpのスクリプト編の続きです。`.coffee`を`.js`及び`.min.js`に変換してみる。変換にはwebpackを使います。gulp自体の設定については下記の記事参照。


> [gulpの初期設定](https://code-house.jp/post/gulp/gulpsetting/)

<!--more-->

## フォルダ構成

以下はあるプロジェクトフォルダである。`

```
project_folder
├── 📁app
│   └── 📁js
├── 📁gulp
│   ├── config.coffee
│   └── 📁tasks
│       ├── coffee.coffee
│            :
├── gulpfile.coffee
├── 📁node_modules
├── package.json
└── 📁src
    └── 📁coffee
```

### src/coffee フォルダ

ここに、変換元となる`.coffee`ファイルを置いておく。

### app/js フォルダ

ここに変換した`.js`及び`.min.js`を置く。


## 変換スクリプト

### インストールするnpmモジュール

スクリプトの実行に必要なnpmモジュールをインストールしておく。

```
npm i fs gulp-webpack webpack gulp-uglify gulp-rename gulp-plumber coffee-loader -D`
```

### coffee.coffee

##### gulp/tasks/coffee.coffee
```coffee
gulp = require('gulp')
gulp_webpack = require('gulp-webpack')
webpack = require('webpack')
uglify = require('gulp-uglify')
rename = require('gulp-rename')
plumber = require('gulp-plumber')
config = require('../config')

webpackConfig =
  entry:
    main: config.src + '/coffee/main.coffee'
  output:
    filename: '[name].js'
  module:
    loaders: [
      {test: /\.coffee$/, loader: "coffee-loader"}
    ]
  resolve:
    extensions: ['', '.js', '.coffee']
  resolveLoader:
    moduleDirectories: ['../../node_modules']
  plugins:[
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery",
      jquery: "jquery"
      __: "underscore"
      Backbone: "backbone"
    })
  ]
  stats:
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true

gulp.task 'coffee', ->
  gulp.src(config.src)
  .pipe(plumber({
    errorHandler: (err) ->
      console.log(err.messageFormatted);
      @emit('end')
  }))
  .pipe(gulp_webpack(webpackConfig))
  .pipe(gulp.dest(config.dest + '/js'))
  .pipe(uglify())
  .pipe(rename({
    extname: '.min.js'
  }))
  .pipe(gulp.dest(config.dest + '/js'))
```

- `webpackConfig.entry:`に変換したいcoffeescriptを記載していく。(coffeescript内でrequireされるファイルは記載しない。あくまでルートとなるファイルのみ書く)
- `webpackConfig.plugins`に書かれたモジュールは、coffeescript内でrequireを書く必要がない。(requireされたものとして扱われる)
- `.pipe(gulp_webpack(webpackConfig))`の部分で`.coffee`を`.js`に変換している。

### coffee実行

```bash
[hh:mm:ss] Requiring external module coffee-script/register
(node:46893) fs: re-evaluating native module sources is not supported. If you are using the graceful-fs module, please update it to a more recent version.
[hh:mm:ss] Using gulpfile project_folder/gulpfile.coffee
[hh:mm:ss] Starting 'coffee'...
[hh:mm:ss] Version: webpack 1.13.1
  Asset    Size  Chunks             Chunk Names
main.js  485 kB       0  [emitted]  main
   [0] ./src/coffee/main.coffee 234 bytes {0} [built]
:
:
[hh:mm:ss] Finished 'coffee' after #.## s
```