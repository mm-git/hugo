+++
date = "2016-08-10T10:30:21+09:00"
description = "nodeで使える折れ線グラフ描画モジュール"
draft = false
image = "https://goo.gl/V5p3Ag"
landscape = false
slug = "backbonegraph"
tags = ["node", "backbone", "html5", "canvas"]
title = "NODE.JS BACKBONE-GRAPH"

+++

<img src="https://goo.gl/V5p3Ag">

自作webアプリの再利用できそうな部分を初めてnode.jsのモジュールにしてみました。

[mm-git/backbone-graph](https://github.com/mm-git/backbone-graph)

<!--more-->

### 特徴

<img src="https://goo.gl/XKI0qG">

- フレームワークはbackbone.js
  - `Backbone.Model`でグラフのデータを持たせ、`Backbone.View`でHTML5 canvasによる折れ線グラフを描画している。
- 生のデータがノイズを含んでいる場合、移動平均により平坦化。
- グラフの極小点、極大点、総増加量、減少量、傾き(平均、最大)計算。
- グラフの拡大、縮小(x軸のみ)
- グラフ部分選択とその総増加量、減少量、傾き(平均、最大)計算。


### 用途

- <span style="font-size:3em; line-height:2em">&#x1F6B4;</span> 自転車、徒歩などで移動するルートの高低差のグラフ表示、獲得標高、最大傾斜度計算。



### 今後の予定など

- マウスカーソルを合わせた部分のデータ内容をポップアップで表示するようにする。
- x軸、y軸ともにマイナスのエリアに対応する。
- backbone native viewを用いて、jQuery依存を無くしたい。

