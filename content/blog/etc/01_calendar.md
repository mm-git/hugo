+++
date = "2017-03-09T15:03:05+09:00"
draft = false
slug = "calendar01"
tags = ["calendar"]
title = "カレンダーの処理はなぜあんなにややこしいのか？　前編"
description = "日付、時間に関する処理には多くのハマりどころがある。月の日数は一定じゃないし、うるう年があったり。時間も日本には無いが世界にはサマータイムがあったりなど。今回はなぜそんなにカレンダーの処理がややこしいのか書いてみる。"

+++

本業の仕事に没頭しており、ブログの更新を全くしていませんでした。久々に更新しますが、今回の話は少し愚痴っぽいかもしれない。

## カレンダー

カレンダー、つまり日付や日時の処理をプログラムで書いたことのある人はたくさんいると思う。そして、その面倒臭さに皆苦労していると思う。どのプログラム言語を使ったとしても、今や日時を扱うライブラリやAPIは充実しているので、実際にはそれほど困らないのかもしれない。
今回の記事では、カレンダーに関するアプリ、処理を行う場合の面倒くさい点と、なぜそうなっているのかをまとめてみた。

1. なぜ月の日数は一定でないのか？
2. なぜうるう年があるのか？
3. 春分の日、秋分の日はなぜ毎年微妙に違う日なのか？
4. うるう秒って何？
5. 時差の処理
6. サマータイムの処理

<!--more-->

### なぜ月の日数は一定でないのか？

なぜ月の日数は一定で無いのか？　特に２月。２月だけ他の月よりも極端に日数が少ない上、うるう年になると29日に増えたりする。
疑問に思って調べてみたところ一ヶ月の日数は30.6日である。という数字がヒットした。更に歴史を遡ると、１年の最初の月は元々は3月であったという話も出てきた。これらをふまえて、３月から30.6を順に足していき、四捨五入した日数をその月の日数として計算すると、たしかに毎月の日数に一致する。

- 3月は30.6日を四捨五入して、31日。
- 4月は、30.6×2=61.2から31を引いた30.2を四捨五入して30日。
- これを続けていくと、７月、８月は確かに31日が続く。
- ２月は一年は365日または365日なので、残りの28日または29日となる。

ところが、この30.6という数字が一体どこから出てきたのかという情報は調べても出てこなかった。なので、30.6という数字を使って計算すると、たまたま現在の暦に一致するだけ？という、なんともモヤモヤとした気分になってしまった。

- 単純に月の周期が30.6日なのかと思ったが、これは29.5日らしい。
- なので、昔々は一ヶ月を29日か30日にしたりしていたらしいが、１年の周期とはズレまくっていたらしい。
- そして、１年の周期と合わせるために、当時の権力者が現在の暦を作った。
- 当時の権力者がこの30.6という数字を意識していたのかは調べてもよくわからなかった。

***結局、当時の権力者が決めたカレンダーが、たまたま30.6で計算すると合致するだけなんだろうか？？***

具体的にプログラムでこれらを計算する場合、例えばある月の日数を知りたい場合、どの言語でもその方法は用意されていると思うので、それほど難しいことはないはず。

##### javascriptの場合
```javascript
// 2017年2月の日数を知りたい場合
// Date()の第二引数は0〜11の範囲。
// 日数を知りたい月+1、dayを0とすることで、日数が得られる。
let daysOfMonth = new Date(2017, 2, 0).getDate();
```


### なぜうるう年があるのか？

なぜ一年の日数は一定でないのか？　四年に一度、一年が366日になるうるう年がやってくる。これについてはわりとスッキリと何故なのかを調べることができた。

- 1年というのは、地球が太陽の周りをきっちり一周する長さである。
- 地球が太陽の周りを１周する間に、地球自身は約３６５回自転する。
- 正確には、365.24219..というのを、昔の偉い人が計測したらしい。
- つまり、1年で地球は概ね３６５と１／４回転する。
- なので、４年でほぼ１回転余分に回るので、４年に一度だけ１日伸ばして辻褄を合わせる。

というのが基本的なうるう年の考え方である。更に更に、

- ４００年単位で考えると９７日をうるう年とすると、303/400 + 97/400 = 365.2425となり上記の数値に近づく。
- なので、４年に一度はうるう年だが、100年に一度はうるう年としない。しかし400年に一度はうるう年とする。

***うまいこと考えたな、昔の偉い人！！***

ちなみに、400年の日数は146027日でこれがたまたま7で割り切れるようである。なので曜日も含めるとカレンダーはちょうど400年で1周する。

***ほんとにうまいこと考えたな***

なお、このあたりの詳しい話はwikiとか調べるといっぱい書いてあります。

### 春分の日、秋分の日はなぜ毎年微妙に違う日なのか？

そもそも、祝日は毎年同じ日、あるいは同じ第ｘ曜日で固定であると思っていた時期が私にもありました・・。祝日が固定で決まっていたら、カレンダーの祝日処理もそう難しいものではありません。
しかし、春分の日、秋分の日に限り、毎年異なる日となっています。これらの日は、昼と夜の長さが同じ日という決まりがあり、地球が毎年１／４周ほど余分に回転するので、どうしてもずれるようである。
そして、これらの日は毎年２月１日に次の年がいつになるかが発表される。

プログラムで祝日の処理をしようとした場合、

- その年の祝日がいつなのか？ネット上のどこかから取得し更新する必要がある。
- 例えば、毎年２月１日を過ぎたら祝日のicalデータを何処かから取得する。
- icalを解析して、祝日と日付を取得する。

といったような処理が必要になってくる。***しかしOFFLINEで動作する前提のアプリの場合どうしたものか？***といった問題が発生する。

というわけで後半に続く。

