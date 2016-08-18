+++
date = "2016-08-18T08:01:36+09:00"
description = "Node.js、coffeescript、Backbone.jsを使って、サクッとgoogle mapsを初期化してみる"
draft = false
slug = "mapinitialize"
tags = ["node", "google", "map", "coffeescript", "Backbone", "Promise"]
title = "[GoogleMaps] Node.jsを使ったgoogle mapの初期化"

+++

## Node.js、coffeescript、Backbone.jsでgoogle map？？

今回の記事ではNode.js、coffeescript、Backbone.jsを使って、サクッとgoogle mapを初期化してみようと思う。最近の流行りとして、node.jsはわかるものの、coffeescriptとBackbone.jsはどうなのよ？と言われそうである。今から何かを始めるのであれば、JavascriptはES2015、ES2016あたりで記載すべきだと思うし、フレームワークはReactとかを使いたいところである。しかし、現在作成しているwebアプリが上記のタイトルの構成なのでそれで説明をしたいと思う。coffeescriptはともかく、Backbone.jsはそれなりに使いやすいし、まだ現役ではあると思う。

この記事用にgithubのレポジトリを作成してみたので参考に。

[mm-git/googleMapsSample](https://github.com/mm-git/googleMapsSample)

今回の記事では画面全体に地図を表示するまでを説明するが、**この方法が楽なポイントは下記の通りである。**

- htmlファイルで、google mapsのapiやjqueryなどの読込が**不要**。(ビルド済みのjsファイルだけ読み込めばOK!!)
- google mapsの初期化を待ってから何かの処理する場合のスクリプトが**簡潔に書ける**。

<!--more-->

## nodeの初期化

google mapの表示のためにフロントエンドで使用しているモジュールをインストールする。今回のmapの表示だけなら、backboneやbootstrapは全く必要ないかもしれない。しかし、今後地図上にマーカーや線を書いたりするのに、データを持つmodelとマーカ、線を描画するviewを分けたい。また、今後画面には地図以外の要素も描画したい。そのため今回、backboneやbootstrapもインストールしておく。

```bash
npm i backbone jquery bootstrap google-maps -D
```

以下は、coffeescriptのビルドやテスト用のサーバを起動するためのgulp関連のモジュールである。直接今回の記事とは関係ないがインストールする。

```bash
npm i browser-sync coffee-loader coffee-script gulp gulp-plumber gulp-rename gulp-uglify gulp-webpack require-dir webpack -D
```

gulp関連の詳細は [Gulp関連の記事](http://code-house.jp/tags/gulp/) を参照。

## スクリプトの説明

### ファイル構成

今回の説明に関するファイルの構成は以下のようになっている。

```
googleMapsSample
├──public
│   ├── css
│   │   ├── bootstrap-theme.min.css
│   │   ├── bootstrap.min.css
│   │   └── main.css
│   ├── index.html
│   └── js
│       └── main.min.js
└── src
    ├── main.coffee
    └── map
        └── view
            ├── MapView.coffee
            └── overlayView.coffee
```

- `index.html`は`main.min.js`と`css`ファイルを読み込むだけの単純なファイル。
- `main.min.js`は`main.coffee`をビルドして作成される。

### public/index.html

##### public/index.html
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Map Sample</title>
    <meta name="description" content="Google map sample application">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/bootstrap-theme.min.css">
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <div id="map"></div>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="js/main.min.js"></script>
</body>
</html>
```

- `js/main.min.js`と`css`ファイルを読み込んでいるだけの単純なhtmlファイルとなっている。
- `<div id="map"></div>`に地図が表示される。
- `coffee`ファイル内で、`jquery`、`bootstrap`、`backbone`、`google-maps`を読み込んでいるので、index.htmlではこれらを読み込むための**`<script>`タグを書く必要がない**。

### src/map/view/mapView.coffee

##### src/map/view/mapView.coffee
```coffee
GoogleMapsLoader = require('google-maps')
Backbone = require('backbone')

class MapView extends Backbone.View
  el: "#map"

  initialize: (options) ->
    @google = null
    @map = null

  loadMap: ->
    new Promise((resolve, reject) =>
      GoogleMapsLoader.KEY = 'your key';
      GoogleMapsLoader.LANGUAGE = 'ja';
      GoogleMapsLoader.LIBRARIES = ['geometry', 'places']

      GoogleMapsLoader.load((google) =>
        mapOpt =
          center                 : new google.maps.LatLng(35.1660, 136.0135)
          zoom                   : 12
          scrollwheel            : true
          disableDoubleClickZoom : true
          keyboardShortcuts      : true
          mapTypeId              : google.maps.MapTypeId.ROADMAP
          mapTypeControl         : true
          mapTypeControlOptions :
            position             : google.maps.ControlPosition.TOP_LEFT
          streetViewControl      : false
          scaleControl           : true
          scaleControlOptions :
            position             : google.maps.ControlPosition.BOTTOM_RIGHT
          zoomControl            : true
          zoomControlOptions :
            position             : google.maps.ControlPosition.TOP_LEFT

        @map = new google.maps.Map(@$el[0], mapOpt)
        @google = google

        OverlayView = require('./overlayView.coffee')
        @overlayView = new OverlayView(@map)

        resolve(@)
      )
    )

module.exports = MapView
```

- `google-maps`モジュールは、`KEY`、`LANGUAGE`、`LIBRARIES`などを設定した後、`load()`を呼ぶだけで**簡単に**google apiのライブラリが読み込まれる。
- googleライブラリ読み込み後は、よく見られるgoogle mapsの初期化と同じ。
- `loadMap()`関数は、全体をPromise()で囲んでいる。google mapの初期化が終わるとresolve()を呼ぶようにしている。


### src/map/view/overlayView.coffee

##### src/map/view/overlayView.coffee
```coffee
class OverlayView extends google.maps.OverlayView
  constructor: (map) ->
    if !OverlayView.instance
      @setMap(map)
      OverlayView.instance = @

    return OverlayView.instance

  draw: ->
    #do nothing

  remove: ->
    #do nothing

  fromContainerPixelToLatLng: (point) ->
    return @getProjection().fromContainerPixelToLatLng(point)

  fromDivPixelToLatLng: (point) ->
    return @getProjection().fromDivPixelToLatLng(point)

  fromLatLngToContainerPixel: (point) ->
    return @getProjection().fromLatLngToContainerPixel(point)

  fromLatLngToDivPixel: (point) ->
    return @getProjection().fromLatLngToDivPixel(point)

module.exports = OverlayView
```

- google maps API V3で `fromContainerPixelToLatLng()` などの関数を使うために、`google.maps.OverlayView`の派生クラス`OverlayView`を作っておく。
- また、上記の`OverlayView`クラスはSingletonパターンを用いたクラスとなっている。
- `src/map/view/mapView.coffee`でgoogle apiのloadが終わった時、一度`new OverlayView(@map)`を行っている。こうしておくと、以降newを行った場合に素早く同じインスタンスを返すことができる。


### src/main.coffee

##### src/main.coffee
```coffee
MapView = require('./map/view/MapView')

mapView = new MapView()
mapView.loadMap()
.then(
  ->
    alert("google map initialized !")
)
```

- `main.coffee`は`MapView`を初期化して、`loadMap()`を呼ぶだけの簡単な処理となっている。
- `loadMap()`はPromiseオブジェクトを返すので、`.then()`で地図初期化完了後に行う処理を**簡潔に記載**することができる。


## ビルド & 実行

- このプロジェクトは`gulp coffee`を実行すると、`public/js/main.js`、`public/js/main.min.js`をビルドするようになっている。
  - 詳細は[[gulp] coffee script編](https://code-house.jp/2016/08/17/gulpcoffee/)参照。
- `gulp start`でlocalで確認できるようになっている。
  - localで確認する際は、google API Keyを空にして実行する必要があるかも。
  
## DEMO

[Map Sample](https://code-house.jp/googleMapsSample/)