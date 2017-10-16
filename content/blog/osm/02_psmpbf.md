+++
date = "2016-10-18T10:24:12+09:00"
description = "osm.pbfファイルの中身はどうなっているのか？調べてみた。そして33Gものファイルをいかにして高速に読み込むのか？？？"
draft = false
slug = "osmpbf1"
tags = ["OpenStreetMap", "Map"]
title = "[OSM] .osm.pbfファイルを読み込んでみる１"

+++

## .osm.pbfとは？

[前回の記事(Open Street Map)](https://code-house.jp/2016/09/16/osmsummary/)で、Open Street Mapにハマっていたわけですが、blogも更新が滞る中、より一層とハマっていました。今回の記事では、Open Street Mapのデータが全て詰まったファイルであるosm.pbfファイルについて書きたいと思う。

さて、このファイル。全世界のファイルとなると**33Gを越えるサイズ**で、そのまま扱うには実に厄介なサイズなのである。中身はzlibで圧縮されているようで単純に読み込んでメモリに展開すると、おそらく60Gを越えるのではないかと思う。なので現実的には少しずつ読み込んで何らかの処理をする(例えば、世界の電車の駅だけを抽出するとか)のであるが、33Gもデータがあると扱い方によってはものすごく時間のかかる処理になるのである。なので**メモリを程々に使って**(程々といっても数ギガのオーダー。64bitOSでないと扱えない)、そこそこ**高速にデータを処理**させる必要がある。結構データを扱うのに苦労しハマったので、その顛末について記事にしておく。

<!--more-->

## .osm.pbfを扱うことのできるツールについて

.osm.pbfを扱うことのできるツールには下記のようなものがあった。しかしmacOS環境、windows環境共に想定する動作をしてくれないか、極めて時間がかかり使い物にならないという結果になった。おそらく、osm関連のツールはUbuntuあたりで扱うのが普通なのかもしれない。しかしUbuntu環境については今回は試していない。(Ubuntuなら苦労していなかったかもしれない・・)

### osmosis

> [Osmosis - OpenStreetMap Wiki](http://wiki.openstreetmap.org/wiki/Osmosis)

巨大な.osm.pbfファイルから、任意の範囲を抽出したり、任意のタグを抽出したりできるツール。似たようなものにosmconverterというものがあるようだが、maxOSだとbuildが必須で挫折した。(なんかmacOSでbuildして成功した経験があまりない。Ubuntuだと問題無さそうだが..)
ただし自分の環境ではうまくいかなかった。

- macOS
  - インストールは`brew install osmosis`で簡単。
  - osmosisの実行自体はかなり時間がかかるが終了する。しかし新たにできた.osm.pbfファイルが次に説明するosm2pgsqlで読み込めなかった。
- Windows
  - zipファイルを展開してどこか好きなところに置くタイプのインストーラ無しツール。
  - ある処理をさせてみたがが完了する気配がない。そもそもこのツール処理がどれだけ進んでいるかよくわからない。一日以上かかりそうなので、諦めた。

### osm2pgsql

> [Osm2pgsql - OpenStreetMap Wiki](http://wiki.openstreetmap.org/wiki/Osm2pgsql)

.osm.pbfをPostgreSQLのデータベースに変換するツール。

- macOS
  - インストールは`brew install osm2pgsql`で簡単。
  - 配布サイトからダウンロードした.osm.pbfからの変換は問題なかった。
  - 上記のosmosisで作成した.osm.pbfは読み込めなかった。
  - **日本ぐらいのサイズなら、半日ほどで変換できた。**(mac mini Mid2011)
  - 全世界のファイルを変換させようとしたが、びっくりするぐらいHDD容量を使ったので途中で諦めた。(150Gぐらいで諦めた)

- windows
  - Cygwin環境のzipファイルがあるので、展開して好きなところに置く。(OSMに関して、Windowsは環境整えるのが大変)
  - 実行させてみたが、何故か途中でOSがクラッシュした。ツールは32bitアプリなのに対してデータが大きすぎるせいかもしれない。(ツールのせいではないかもしれないが..)

## .osm.pbfを直接読み込んでみる

上記のようにツールをいろいろ調べてみて、結果としてはデータ配布サイトからダウンロードした日本のデータをmacOSで扱うところだけが、唯一想定内の結果であった。(これだけで3日ほどハマった。ツラい・・)
なので、全世界のデータをもっと自由に扱いたい場合、もう自分でプログラムを組んで直接データを読み込むしかないようである。というわけで、.osm.pbfのファイルのフォーマットについて調べてみた・・。

> [PBF Format - OpenStreetMap Wiki](http://wiki.openstreetmap.org/wiki/PBF_Format)

・・・。なるほど、よくわからんなぁ。というわけで、もっとざっくりと説明すると、フィアル内は下記のような構造となっているようだ。

<img src="https://goo.gl/KEMGEs" width="75%">

- まずファイルの中身はgroupという大きな塊に分かれている。
  - groupによりサイズは異なる。
  - 最初のgroupの先頭位置はおそらくファイルの最初の方(ヘッダ部分)に書かれている。
  - 各groupのサイズは各groupのヘッダに書かれている。
  - よって、途中のgroupの先頭位置を見つけるには、最初のgroupの先頭位置に順にサイズを足していって見つける。(のだと思われる)
  - 各groupはzipで圧縮されている。zlibのuncompress()で展開する必要がある。
  - zipを展開した後は、[Google Protocol Buffers](https://developers.google.com/protocol-buffers/)というフォーマットでデータが格納されているようだ。
  
- 続いて各groupの中には、主にdense、way、relationの３つのいづれかのデータが格納されている。
  - 全世界のデータを見ると、各group内には30個前後のデータが格納されている。
  - 一方日本のデータのみを見ると、各group１個のデータが格納されている。
  - 各dense、way、relationの中には最大で8000個のデータが格納されている。
  
- denseにはあらゆる座標のデータが格納されている。
  - 例えば、バス停などの場合は、座標のユニークなnode_id(osm_idと呼ばれ、osmファイルの中のあらゆる情報を一義的に示すユニークなid)、バス停の名前、座標(経度緯度)などのデータが格納されている。
  - 次に説明するwayで使われる経路上の各点もdenseに格納されている。
 
- wayにはあらゆる、線のデータが格納されている。
  - 最も大きなデータは道路のデータと思われる。道路の線のデータが格納されている。
  - これら線のデータは、denseに格納されたnode_idの配列データという形で格納されている。
  - つまりway自体には座標が直接格納されてなくて、denseへの参照となっている。**これがosmデータを扱う上で非常に厄介**である。
  - その他、川、線路、県境、国境などデータは多岐にわたる。

- relationはwayなどのある固まりをまとめたデータである。
  - 例えば国道１号線など、way内にはいくつかのデータに分かれて格納されている。これらをまとめて国道１号線として扱えるように、wayに格納されたway_idの配列という形でrelationにデータが格納されている。
  
というわけで、上記をふまえて実際に.osm.pbfを読み込んでみるのだが、実際のコードについては次回に続く・・。




