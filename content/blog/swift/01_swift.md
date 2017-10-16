+++
date = "2016-09-04T14:32:29+09:00"
description = "スマホアプリを作ってみたい。それは長年(といってもここ数年だが)の夢だった。まずはアプリの作るのに必要な項目には何があるのかをまとめてみた。"
draft = false
slug = "swiftstart"
tags = ["swift", "iOS", "xcode", "Application"]
title = "[swift]スマホアプリを作る"

+++

## スマホアプリを作る

今の様な形のスマホが世に現れて、もう10年が経とうとしている。スマホアプリを作るというと、もはや既にピークはとうに過ぎており今更感があるのだけど、それでもなお毎日のように新しいアプリがリリースされているのは事実なわけで、そういう意味ではまだギリギリ過渡期なのだと思う。本当はもっと前からスマホアプリを作ってみたかった。だからこのギリギリ過渡期のうちに、これが最後のチャンスだと思って何か作って見たいと思う。

世の中には、スマホアプリの作り方の書籍や記事が溢れている。中には、「簡単にできる」、「◯◯日でできる」みたいに謳ったものもあるが、実際に本当に取り組もうとすると、あまりにも膨大な知識が必要であることにビビる。それに、アプリによってはサーバを用意したりなど、準備にも膨大な時間が必要である。漠然とスマホアプリの完成までに必要な知識、準備のステップの合計を100とすると、現段階では5前後では無いだろうかと思う。

しかし、逆に考えると、それだけの新しいことを知ることができる。新しいことを始めることができるというのは、技術者にとってとても幸せなことであるとも思う。それに、この状態からどうのようにしてアプリを作っていくかを少しでも記事にできれば、同じようなことをしている人、またはしようとしている人にとっても何かしらの役に立つんじゃないかと思う。とはいうものの、実際にアプリを作り出すとそちらにばかり時間が取られて、なかなか記事を書いたりする時間がなくなったりするのだけど・・。

とりあえず、アプリを作成するにあたり何をする必要があるのかをざっくりとリストアップしてみた。今回はその項目をひたすら箇条書きしておく。なを、アプリはiPhoneまたはiPad向けのアプリとし、言語はswiftを使うものとする。

<!--more-->

## アプリ作成に必要な調査項目

### swift/iOSに関する知識
- swiftの文法を理解する。
  - 特に、Optional、Generics、Closure、Protocolなど
- Core dataの扱い方
- threadの作り方(Grand central dispach)
- iOS自体の状態遷移について
  - どういった動作や状態でどのコールバック関数が呼ばれるのか
  - 特にアプリの強制終了、電話の着信が合った場合など
- メモリの管理の仕方
  - 特にARCとは何か？
  - weakやunownedといった指定はどういいたものか？
- UIKit、SpriteKit、SceneKitなどそれぞれの描画方法
  - 機会があればMetalも使ってみたい
- シーンの切替方法
- CocoaPodの使い方、CocoaPodの作成方法、仕組みなど

swift、iOSに関することは書籍もたくさんあるし、調べればたいていのことは見つかる。[Safari Books Online](https://www.safaribooksonline.com/)でも大量に情報があるので、調べ物にはほぼ困ることはない。

### xcodeに関する知識
- storyboardの使い方
- Auto layoutの使い方
- デバッグの仕方
- Profileの仕方
- UnitTestの方法

デバッグ、Profileなどは少し情報が少ない感じ。最終的に製品として何かリリースするなら、メモリやリソース周りの状況をきっちり確認、最適化してリリースしたいところではあるが。

### デザインパターン
- Singletonの作り方
- Observerパターンの作り方
- MVCパターンの作り方

世の中の書籍や記事は、初期状態で作成されるUIViewControllerの派生クラスにひたすらコードを追加していく説明が圧倒的に多い。これをswift/iOSの場合はどのようなデザインパターンで実装するのが理想的か？といった情報は少ない気がする。

### その他、全般的なこと
- タッチ入力の検出方法
 - 特にiPhone6/6s以降導入された、3Dタッチとは？
- サーバとの通信方法
- 画像の表示方法
  - jpg、pngだけでなく、gif(動画含む)、svgはどうか？
- メニュー画面や設定画面など、Appleの規約に基づいた画面の作り方
- 広告の表示の仕方
- アプリ内課金の仕方
- デバイス等へのアクセス 
  - GPSデータの取得方法
  - wifi/LTEなどの状況取得
  - BlueTooth機器との接続
  - 指紋認証の方法
  - カメラ、写真アクセス
- SNSとの連携
- バッジ表示
- 通知
- アプリアイコンの作成
- アプリの審査の受け方、リリース方法

このあたりは、作成したいアプリによって調べるべきことは様々である。これらをswift/iOSの場合にどうするかを調べる必要がある。情報量は多く、調べるのは難しくはないと思う。

### サーバ側準備

- アプリデータの準備
- データサーバの準備
- アプリによっては認証サーバの準備
  - サーバは何を使うか？ vps、heroku、AWS、azure、etc...

サーバ側の話は特にswift/iOSに特化した話ではないが、iOSとの通信でなにか特殊なことがあるのかは調べる必要がある。