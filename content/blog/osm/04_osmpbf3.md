+++
date = "2016-11-04T15:33:19+09:00"
description = "osm.pbfを読み込む話の第三弾。座標の取得に一苦労する話"
draft = false
slug = "osmpbf3"
tags = ["OpenStreetMap", "Map"]
title = "[OSM] osm.pbfを読み込む３ node座標編"

+++

## ロッカーの前で

<img src="https://goo.gl/2Ou1dg" width="40%">

おっさんはロッカーのキーを握りしめ、駅のロッカーの前に立っていました。ロッカーの中にはお宝があります。しかし、その駅のロッカーはものすごい数があり、しかもロッカーの番号はところどころ欠番がありました。<br>
お宝がほしかったおっさんは、最初から順にロッカーの番号を探していきました。<br>
ところが、なんということでしょう。おっさんが持ったキーのロッカーは、何千個もあったロッカーのうち、**最後から３番目のロッカーだったのです。**

結局、おっさんは１つの宝を探し出すのに、その駅で何時間も過ごす羽目になったのでした・・。

<sub style="font-size:0.8em">※この話はフィクションです</sub>

<!--more-->

## osm.pbfのdenseデータの話

今回も冒頭に変な話を書きました。おっさんはもう少し効率良くロッカーを探すことができなかったのでしょうか？<br>
というわけで、今回のテーマはデータの検索とソートの話です。PCで扱うデータも扱い方を間違うと、おっさんのように無駄な時間がかかってしまいます。

osm.pbfファイルののdenseデータ。これは地図上のあらゆる座標データが集まったデータです。座標を識別するための番号、座標(経度、緯度)、その座標のその他の情報(名前など)から成り立っています。<br>
この座標を識別するための番号(以降node_idと呼ぶ)も、先程の話と同じようにところどころ飛び飛びの番号になっています。<br>
世界中のデータを扱おうとすると、このnode_idの検索を何千万回、何億回と行う必要があります。

### 最初に作ったプログラム

ところで、あるnode_idの座標情報が欲しい場合に、それを探すプログラムを作成してみました。こんな感じです。

1. どのnode_idがどのdenseグループに格納されているかを予め調べておく。
2. そのnode_idが格納されている、denseグループを読み込む。
3. denseの内容を配列に展開する。
4. denseの配列からnode_idを探す。検索には pythonのindex()を使う。

概ね一回の検索に0.2〜0.5秒ぐらいの時間がかかります。これだと何億回という回数になってくると、**処理によっては数千日かかる計算になります。**

### 2のdense読み込み対策

2のdenseの読み込みですが、glibの展開とProtocol Bufferの展開の時間が馬鹿になりません。<br>
なので、展開済みの必要なデータだけを予め別ファイルに保存しておいて、都度読み込むということをやってみました。確かにこれで随分早くなりました。4000日が400日ぐらいには短縮されました。(約10倍早くなりましたが、SSDを80G近く使ってしまいました)<br>

### 3の対策

Imposmのソースを見てみました。node_idと座標の展開の他に、その座標の名前などのデータの展開に少し時間がかかっているようでした。
今回、node_idと座標のみが必要だったのでそれだけを処理するコードを別途作りました。ほんの少し早くなりました。

### 4の対策(本記事のメイン)

densuに格納されているnode_idですが、欠番はあるものの、昇順であることは間違いないようです。なので、pythonのindex()関数でよしなに高速に検索してくれるだろうと思っていましたが、世の中そんなに甘くはありませんでした。
よってこれを単純にバイナリサーチにするだけで激的に早くなりました。これで、40倍ぐらいは早くなりました。それでも、まだ私が行いたい処理を終えるには10日ぐらいの日数が必要でした。

> バイナリサーチ
>
> おっさんは、考えました。最初から順にロッカーを探すのはアホだと。
> よくみると、ロッカーは欠番はあるものの、番号の並び順が戻る事はないことに気が付きました。
> そこで、おっさんはまず全体の真ん中にあるロッカーを目指します。そしてロッカーと持っているキーの番号を比べます。
> キーの番号の方が、その真ん中のロッカーより大きいです。そしたら、次はその真ん中のロッカーと最後のロッカーの更に真ん中に行きます。
> そして再びロッカーと持っているキーの番号を比べます。今度はキーの番号の方が小さいとします。
> おっさんは、全体の真ん中のロッカーと、真ん中の真ん中のロッカーのさらに真ん中に行きます。
> 真ん中の真ん中の真ん中の・・と移動を続けていくと、最終的に目的のロッカーにたどりつきます。
> こうすることで、キーの番号とロッカーの番号を比較して判断する回数が圧倒的に減ります。これがバイナリサーチです。

<img src="https://goo.gl/LMCNwy" width="40%">

### バイナリサーチの先へ

10日というのは、いろんなことを試行錯誤するには長過ぎる時間です。せめて、あと10倍の高速化が必要でした。<br>
様々な対策をして、それでも時間がかかっていたのは、denseグループの読み込みとバイナリサーチでした。

2の対策。必要な時に都度データを読み込むという対策。これは、PCのメモリには限界があるので、必要なデータだけをキャッシュしておくという対策も兼ねていました。ところが、たまたまですが、このキャッシュサイズを誤って設定してしまいました。結果PCのメモリサイズを遥かに越えるデータを読み込む形になったのですが、不思議な事に問題なくプログラムは動き続けました。<br>
PCのメモリは足りなくなると、使用頻度の低そうな部分を一時的にファイルに書き出して、その部分を他でも使えるような動作をします。いわゆる、ページングという機能です。windowsもmacOSのこのあたりの根本的なところは一緒のようです。windowsの場合ページングのサイズは予め設定があり、それ以上のメモリ確保はできなさそうだし、ページングが頻発するとCPUパワーにかかわらず結構重くなるイメージがありました。ところがmacOS。足りなくなったらその分ページングサイズを増やし続けるようで、しかもページング処理がそれほど重くない。<br>
結局、プログラムで必要なデータを都度読み込んでキャッシングしてという処理を書いていましたが、これを丸ごとOSのページング処理に任せたほうが圧倒的に速いということがわかりました。これだけで、既に10倍以上早くなりました。各densuも一回読み込んだらメモリに置きっぱなしなので、展開済みの中間ファイルも不要になりました。

続いて、バイナリサーチ。これはもう検索をしている限り、どうやっても時間がかかります。なので検索をやめるしかありません。検索せずに任意のnode_idの情報をすぐに見つけるには？

> 絶対アドレス
>
> おっさんはバイナリサーチですら面倒臭いと思いました。だって、真ん中の真ん中に行くたびに、
> 何度か目的のロッカーの前を素通りした上、結構な距離を歩いたのです。
> そこでおっさんは画期的な方法を考え出しました。
> よく見ると、ロッカーの幅はどれも寸分たがわず同じでした。
> そこで、駅員に頼み込んで許可をもらい、ロッカーを並べ直しました。
> 欠番のあるところは、その分間を空けてロッカーを並べ直したのです。
> すると、ロッカーの幅はどれも同じなので、目的の番号のロッカーまでの距離がすぐに分かるようになりました。
> おっさんはその距離を歩くことで、即座に目的のロッカーの前にたどり着くことができるようになったのです。

このようにして、node_idが欠番のところはそれだけ分データの間隔を空けて配置してみることにしました。ただこうすることで30G以上のメモリが必要でした。しかし、上記に書いたように足りないメモリはmacOSがうまいことページング処理を行ってくれます。なので、OSの動作に任せるようにプログラムを書いてみたところ、更に10倍弱の高速化をすることができました。

## 最後に

osm.pbfに含まれる、全道路の座標を取得する。というプログラムを書きました。4000日はかかると思われた計算は、最終的に1時間40分まで短縮することができました。上記に書いた以外にも、マルチプロセス化などあらゆる手段を使って高速化した結果です。(道路の座標を取得した後、更にそれを保存する処理を追加したところ、結局計算には1日弱かかるようになっていまいましたが・・)

今回のことで思ったことは、まだ早くなるはずと信じてプログラムを組めば、時間のかかる処理もまだまだ早くなる可能性があるということです。
CPUのクロック周波数って、そこだけを見るともう何年もほとんど変わってない。でもたぶん想像以上にCPUは進化しているし(例えばキャッシュが効率的に使われたりだとか、64bitの演算が早くなってたりするんでは？)、SSDやメモリなんかも多分すごく早くなっているので、それをソフトの力で引き出してやることが重要だと思う。

なお、今回作ったコードは後日githubにでも置く予定です。

**2016/11/04 追記**
githubにcodeを置きました。あまり綺麗なコードではありませんが・・。

> [mm-git/osmpbf-extract-ways](https://github.com/mm-git/osmpbf-extract-ways)


