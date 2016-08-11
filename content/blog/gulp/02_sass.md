+++
date = "2016-08-06T13:36:14+09:00"
draft = false
slug = "gulpsass"
tags = ["node", "gulp", "sass", "css"]
title = "[gulp] sass編"
description = "sass記法で書かれた`.scss`ファイルを、`.css`に変換し圧縮して`.min.css`ファイルにも変換する。"
+++

## gulp を使った sass→css, css.min変換

<a href="http://sass-lang.com/"><img title="Sass: Syntactically Awesome Style Sheets" src="http://capture.heartrails.com/200x150/cool?http://sass-lang.com/" alt="http://sass-lang.com/" width="200" height="150" /></a>

今回gulpのスクリプトで`.scss`を`.css`及び`.min.css`に変換してみる。gulp自体の設定については下記の記事参照。

> [gulpの初期設定](https://code-house.jp/post/gulp/gulpsetting/)

<!--more-->

## フォルダの構成

以下はあるプロジェクトフォルダである。前回の物に`app`、｀src｀フォルダを追加した。

```
project_folder
├── 📁app           <--追加
│   └── 📁css
├── 📁gulp
│   ├── config.coffee
│   └── 📁tasks
│       ├── sass.coffee
│            :
├── gulpfile.coffee
├── 📁node_modules
├── package.json
└── 📁src           <--追加
    └── 📁scss
```


### src/sass フォルダ

ここに、変換元となる`.scss`ファイルを置いておく。なお、`_`で始まるファイルは、他の`.scss`から`@import`で読み込まれるファイルなので、直接は変換しないものとする。

### app/css フォルダ

ここに変換した`.css`及び`.min.css`を置く。


## 変換スクリプト

### インストールするnpmモジュール

スクリプトの実行に必要なnpmモジュールをインストールしておく。

```
npm i fs gulp-sass gulp-autoprefixer gulp-cssmin gulp-rename gulp-plumber -D`
```

### sass.coffee

##### gulp/taks/sass.coffee
```coffee
fs = require('fs')
gulp = require('gulp')
sass = require('gulp-sass')
autoprefixer = require('gulp-autoprefixer')
cssmin = require('gulp-cssmin')
rename = require('gulp-rename')
plumber = require('gulp-plumber')
config = require('../config')

gulp.task 'sass', ->
  sassFiles = fs.readdirSync(config.src + '/scss')
  baseFiles = sassFiles.filter((file) ->
    return fs.statSync(config.src + '/scss/' + file).isFile() && /.*\.scss$/.test(file) && file.charAt(0) != "_"
  )
  .map((file) ->
    return config.src + '/scss/' + file
  )

  gulp.src(baseFiles)
  .pipe(plumber({
    errorHandler: (err) ->
      console.log(err.messageFormatted);
      @emit('end')
  }))
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(gulp.dest(config.dest + '/css'))
  .pipe(cssmin())
  .pipe(rename({
    extname: '.min.css'
  }))
  .pipe(gulp.dest(config.dest + '/css'))
```

- 最初に`src/scss`フォルダにある、`.scss`ファイルで`_`から始まらないファイルの一覧を作成している。
- `.pipe(plumber({ ... `の部分は、sassの処理でエラーがあっても、処理を継続できるようにしてる。
- `sass()`と`autoprefixer()`(-moz-とか-webkit-とかを自動追加する処理)だけ行って、`.css`を保存。
- 圧縮してから、`.min.css`も保存。
- 上記の例では`.map`ファイルは作成していません。


### sass実行

```bash
$ gulp sass

[hh:mm:ss] Requiring external module coffee-script/register
(node:46893) fs: re-evaluating native module sources is not supported. If you are using the graceful-fs module, please update it to a more recent version.
[hh:mm:ss] Using gulpfile project_folder/gulpfile.coffee
[hh:mm:ss] Starting 'sass'...
[hh:mm:ss] Finished 'sass' after ### ms
```

手元のnodeはv6.3.0ですが、fsに関するメッセージがでています。何か対処が必要かもしれませんが、sassの変換自体はこれで行えます。
