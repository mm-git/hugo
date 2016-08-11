+++
date = "2016-08-11T11:45:57+09:00"
draft = false
slug = "gulpfavicons"
tags = ["node", "gulp", "favicon"]
title = "[gulp] favicon編"
description = "gulpであらゆるサイズのfaviconを生成する"
+++

## gulpを使ったfavicon生成

gulpの記事第三弾は、簡単なところでfaviconの生成について説明する。gulp自体の設定については下記の記事参照。
                                      
> [gulpの初期設定](https://code-house.jp/post/gulp/gulpsetting/)

<!--more-->

## フォルダの構成

```
project_folder
├── 📁app
├── 📁gulp
│   ├── config.coffee
│   └── 📁tasks
│       ├── favicons.coffee
│            :
├── gulpfile.coffee
├── 📁node_modules
├── package.json
└── 📁src
    └── 📁images
        └── favicon.png       <-元ファイル
```

### src/images/favicon.png

ここに変換元となる`favicon.png`を置いておく。元ファイルは1024 x 1024で作成している。

### app

変換後のファイルは、document rootに置く必要があるので、`app`直下に出力する。


## 変換スクリプト

### インストールするnpmモジュール

スクリプトの実行に必要なnpmモジュールをインストールしておく。

```
npm i gulp-favicons -D`
```

### favicons.coffee

##### gulp/taks/favicons.coffee
```coffee
gulp = require('gulp')
favicons = require('gulp-favicons')
config = require('../config')

gulp.task 'favicons', ->
  gulp.src(config.src + '/images/favicon.png')
  .pipe(favicons({
    appName: "Site name",
    appDescription: "Site description",
    developerName: "developer name",
    developerURL: "http://developerurl/",
    background: "#ffffff",
    path: "/",
    url: "http://siteurl/",
    display: "standalone",
    orientation: "portrait",
    version: 1.0,
    logging: false,
    online: false,
    html: "favicons.html",
    pipeHTML: true,
    replace: true    
  }))
  .pipe(gulp.dest(config.dest))
```

- `favicons`の設定は上記の様に設定すれば十分と思う。
- `html`を設定することで、`<head>`タグに書く要素を出力してくれる。
  - ただし、Open graphなど画像の`meta`要素しか出力してなかったりするので、注意が必要。


### favicons実行

```bash
$ gulp favicons

[hh:mm:ss] Requiring external module coffee-script/register
(node:46893) fs: re-evaluating native module sources is not supported. If you are using the graceful-fs module, please update it to a more recent version.
[hh:mm:ss] Using gulpfile project_folder/gulpfile.coffee
[hh:mm:ss] Starting 'favicons'...
[hh:mm:ss] Finished 'favicons' after ### ms
```

- 手元のmac book airで14秒ほどかかった。結構時間がかかるので、favicon変更時のみ手動で行うなどした方がいいかもしれない。


### 