+++
date = "2016-08-21T18:21:25+09:00"
description = "gulpで画像ファイルのサイズを減らしてみる。"
draft = false
slug = "gulpimagemin"
tags = ["node", "gulp", "imagemin"]
title = "[gulp] 画像サイズを減らす"

+++

## gulpを使って画像のサイズを減らす

今回のgulpスクリプトは画像ファイルのサイズ圧縮である。サイトの表示速度アップのために画像の見た目はあまり変わらないままにサイズを減らしてみる。なお今回の記事、**単に`gulp-imagemin`を使っているだけ**である。特に圧縮率を変更したりはしていないので、あまり参考にならないかもしれない。

gulp自体の設定については下記の記事参照。

> [gulpの初期設定](https://code-house.jp/post/gulp/gulpsetting/)

<!--more-->

## フォルダの構成

以下はあるプロジェクトフォルダである。今までの記事と同様に、`src/images`の画像ファイルをサイズ縮小して、`app/images`に出力してみる。

```
project_folder
├── 📁app
│   └── 📁images
├── 📁gulp
│   ├── config.coffee
│   └── 📁tasks
│       ├── imagemin.coffee
│            :
├── gulpfile.coffee
├── 📁node_modules
├── package.json
└── 📁src
    └── 📁images
```


## 画像圧縮スクリプト

### インストールするnpmモジュール

スクリプトの実行に必要なnpmモジュールをインストールしておく。

```
npm i fs gulp-imagemin gulp-plumber -D`
```

### gulp/tasks/imagemin.coffee

##### gulp/tasks.imagemin.coffee
```coffee
fs = require('fs')
gulp = require('gulp')
imagemin = require('gulp-imagemin')
plumber = require('gulp-plumber')
config = require('../config')

gulp.task 'imagemin', ->
  files = fs.readdirSync(config.src + '/images')
  baseFiles = files.filter((file) ->
    return fs.statSync(config.src + '/images/' + file).isFile() && /.*\.png$/.test(file) && file != 'favicon.png'
  )
  .map((file) ->
    return config.src + '/images/' + file
  )

  gulp.src(baseFiles)
  .pipe(plumber({
    errorHandler: (err) ->
      console.log(err.messageFormatted);
      @emit('end')
  }))
  .pipe(imagemin())
  .pipe(gulp.dest(config.dest + '/images'))
```

- 上記の例では、最初に`src/images`にある、pngファイルの一覧を作成している。
- また、imagesに`favicon.png`がある場合は除外している。
  - faviconは別途、[[gulp] favicon編](https://code-house.jp/2016/08/11/gulpfavicons/)で変換している。


### imagemin実行

```bash
$ gulp imagemin

[hh:mm:ss] Requiring external module coffee-script/register
(node:93202) fs: re-evaluating native module sources is not supported. If you are using the graceful-fs module, please update it to a more recent version.
[hh:mm:ss] Using gulpfile project_folder/gulpfile.coffee
[hh:mm:ss] Starting 'imagemin'...
[hh:mm:ss] Finished 'imagemin' after ### ms
[hh:mm:ss] gulp-imagemin: Minified ## images (saved ###.## kB - ##.#%)
```