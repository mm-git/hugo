+++
date = "2016-08-02T20:38:05+09:00"
draft = false
slug = "gulpsetting"
tags = ["node", "gulp"]
title = "gulpの初期設定"

+++

## gulpの初期設定

<a href="http://gulpjs.com/"><img title="gulp.js - the streaming build system" src="http://capture.heartrails.com/200x150/cool?http://gulpjs.com/" alt="http://gulpjs.com/" width="200" height="150" /></a>

少し前まではgruntを使って、webサイトのファイルなどを動的に生成していた。しかしgulpの方が設定やgulpスクリプトがすっきり書けるということでgulpに以降した。
nodeアプリやモジュールの作成でgulpを使う場合の初期設定について書いてみる。なお下記を前提とする。

- 設定、スクリプトはcoffeescriptで書く。
- `node init`などnode.jsの初期化は完了しているものとする。

<!--more-->

## フォルダの構成

以下はあるプロジェクトフォルダのgulpに関するフォルダとファイルを抜粋したものである。

```
project_folder
├── 📁gulp
│   ├── config.coffee
│   └── 📁tasks
│       ├── sass.coffee
│            :
├── gulpfile.coffee
├── 📁node_modules
└── package.json
```

### gulpフォルダ

gulpフォルダには、gulpスクリプト全体に共通する設定を書いたconfig.coffeeと、tasksフォルダを用意する。
そして、tasksフォルダにgulpスクリプトを置く。(上記の例だと、scssファイルをcssに変換する処理を書いたsass.coffeeがtasksフォルダに置かれている)

### gulpfile.coffee

gulpfile.coffeeに書かれた内容は下記だけである。これで、gulp/tasksフォルダ以下にある全てのスクリプトを自動で認識して実行できるようになる。
例えば、上記のsass.coffeeには"sass"という名前のgulpスクリプトが登録されている。`gulp sass`とすると実行できる。

##### gulpfile.coffee
```coffee
requireDir = require('require-dir')
requireDir('./gulp/tasks', { recurse: true })
```

### config.coffee

gulp/config.coffeeには、gulpスクリプト全体に共通する設定を記入する。json形式で好きなように設定を書く。
gulpスクリプトでは、あるフォルダの内容を処理して公開フォルダへとコピーするといった処理が多いと思う。
下記の例では、srcとdestで元ファイルのフォルダと公開フォルダを指定するような設定を書いている。

##### gulp/config.coffee
```coffee
module.exports = {
  src: './src'
  dest: './app'
  :
  :
}
```

こうすることで、例えば下記の様にconfig.coffeeを読み込んで、`config.src`の様に参照ができるようになる。

##### gulp/tasks/sass.coffee
```coffee
fs = require('fs')
gulp = require('gulp')
config = require('../config')    # config.coffeeを読み込む

gulp.task 'sass', ->
  files = fs.readdirSync(config.src + '/scss')  ## config.srcの様にして参照できる
  :
  :
```

### package.json

gulpを最初に設定した時のpackage.jsonの中身は下記のようになっている。

```
npm i coffee-script gulp require-dir -D`
```

を実行すれば、package.jsonには自動的に下記が追加される。

##### package.json
```json
{
  :
  "devDependencies": {
    "coffee-script": "^1.10.0",
    "gulp": "^3.9.1",
    "require-dir": "^0.3.0"
  }
}

```
