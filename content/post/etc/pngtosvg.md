+++
date = "2016-08-02T18:32:15+09:00"
draft = false
slug = "pngtosvg"
tags = ["png", "svg", "imagemagick", "potrace"]
title = "透過pngをsvgに変換する"
+++
## 透過PNGをSVG画像に変換する。

<img src="https://goo.gl/I4cpTw" width="200" height="150"><sub style="font-size:0.5em">絵が下手すぎる・・・</sub>

pngをsvgに変換する。世の中そんなツールは出回ってそうなので簡単にできるかと思っていたが、以外にもハマりどころが多かったのでメモ。前提として、下記のことを達成することを目的とする。

- 元になるpng画像はモノトーンの透過画像である。
- png画像は、あるフォルダの複数のサブフォルダの中に複数存在する。
- svg画像は別のフォルダに出力する。この時元のフォルダの構造をそのまま維持する。
- 上記をshell scriptでちゃちゃっと実行する。

## ハマったこと

- findでファイルを探すもファイルが多い場合。
- xargsでshell functionはそのままでは実行できない。
- folder構造を維持するには？
- 透過pngをsvgに変換する方法
- osxで\を入力しようとしたら¥になる？

<!--more-->


### findでファイルを探すもファイルが多い場合。

例えば、shellで`find . -name '*.png'`のように実行すると、カレントフォルダ以下にあるpngファイルが検索できる。これをパイプを使って次のコマンドに渡したりできるのだが、ファイル数が多い場合エラーになってしまう。そこで、fineの結果をxargsというコマンドに渡して、どんなにファイルが多くても１つずつ処理させたりすることができる。(必ずしも１つずつ処理させる必要はないが)

```bash
find . -name '*.png' | xargs -IX -n1 wc -c X
```

- findの結果を1つずつ処理するために、xargsで`-n1`を指定している。こうすることでxagrsに続くコマンドに1つだけ値を渡すことができる。
- `-n1`は次のコマンドにパラメータを幾つずつ渡すかを指定するパラメータ。次のコマンドを同時に幾つ実行するかは別途指定する必要がある。

> [xargs を使ってカジュアルに並列処理 - たごもりすメモ](http://tagomoris.hatenablog.com/entry/20110513/1305267021)

- 上記の例では、xargsからwcコマンドを実行している。`wc -c filename`で、ファイルのサイズとパスが表示される。
- xargsに続くコマンドにパラメータを渡す場合、そのコマンドの第一引数にパラメータを渡す場合は、`xargs -n1 wc`のようにすればいい。しかし、そうではない場合、xargsの`-I`オプションを使用する。
- `-I`に続けて任意の文字を指定する(上の例ではX)。そしてwcコマンドのパラメータを受け取る位置にもその任意の文字を書く。


### folder構造を維持するには？

フォルダの構造を維持して、svgファイルを出力したい。そこで、あるフォルダのファイルを最初に処理した際に、出力先にも同じフォルダを作成するshell functionを作ってみる。

##### pngtosvg.sh
```bash
# $1に元ファイルのパス、$2に出力先のフォルダ名が指定されているとする
function pngtosvg() {
  src=$(dirname $1)
  exp="s/^[^\/]*/$2/"
  dist=`echo $src | sed -e $exp`

  if [ ! -d $dist ]; then
    echo $dist
    mkdir -p $dist
  fi
}
```

このfunctionのハマりポイント。

- 変数に値を代入する場合、=の前後にスペースを開けてはいけない。
  - スペースを開けると、変数名をコマンド名と解釈してしまいエラーになる。
- sedの正規表現では、最短一致の`?`が使用できない。上記の例では、元フォルダの一番親のフォルダ名を$2で指定されたフォルダ名に変換している。
  - `?`が使えるなら、`s/^.*?/\/$2/`の様に指定できるはずである。
- mkdirでフォルダを作成する場合、途中のフォルダが存在しない場合、通常であればエラーになる。`-p`オプションを付ければ、途中のフォルダも全て作成してくれる。


### xargsでshell functionはそのままでは実行できない。

上記のshell functionをxagrsから実行しようとしたところ、そのまま実行できなくてハマった。調べてみると、下記のような記事が見つかった。

[xargsにbashのfunctionを渡す方法 - Weballergy](http://d.hatena.ne.jp/wristed/20120603/1338691396)

記事に書いてある通りに、shell functionをexportして、xargsからはbashのスクリプトとして実行する。

##### pngtosvg.sh
```bash
# $1に元ファイルのパス、$2に出力先のフォルダ名が指定されているとする
function pngtosvg() {
  src=$(dirname $1)
  exp="s/^[^\/]*/$2/"
  dist=`echo $src | sed -e $exp`

  if [ ! -d $dist ]; then
    echo $dist
    mkdir -p $dist
  fi
}
export -f pngtosvg

# ここの$1はpngtosvg.shに渡された第一パラメータ(元フォルダ)である。$2は出力先のフォルダである。
find $1 -name '*.png' | xargs -IX -n1 bash -c "pngtosvg X $2"
```

- `sh pngtosvg.sh hoge fuga`の様に実行する。hogeのフォルダ構造がそのままfugaフォルダにも適応される。
  - ただし、pngファイルの存在するフォルダのみが適応される。
- 見つかったpngファイルが全てxargsに渡される。
- xargsからはbash経由でconvにXと$2が渡される。Xは見つかったpngファイルである。


### 透過pngをsvgに変換する方法

画像をsvgに変換するツールはpotraceを利用する。OSXの場合`brew install potrace`で簡単にインストールができた。

> [Peter Selinger: Potrace](http://potrace.sourceforge.net/)

しかし、このpotrace。いろいろと制限があり結構ハマった。

- 変換元のファイルとして直接pngを指定することはできない。
  - 変換元としてはいくつかあるようだが、bmpを使ってみることにする。
- pngをbmpにするツールはたくさんある。しかし、透過のpngを透過でないbmpに変換しないと、結果のsvgファイルが正しく作成されない。

透過pngを透過でないbmpに変換するにあたっては、下記が参考になった。

> [(Qiita)コマンド一発で透過 png を綺麗に非透過 png にする](http://qiita.com/iwiwi/items/fdec3466c4dea5818b3a)

上記の記事で使われている`convert`というコマンドは、imagemagickをインストールすると使えようになる。imagemagickもOSXの場合`brew install imagemagick`でインストールが可能である。上記の記事ではpngをpngに変換しているが、この記事ではbmpに変換するので、下記のように最後のファイル名を.bmpに変更する。

```bash
convert xxx.png  \( +clone -alpha opaque -fill white -colorize 100% \) +swap -geometry +0+0 -compose Over -composite -alpha off xxx.bmp
potrace --svg xxx.bmp
```

### osxで\を入力しようとしたら¥になる？

上記のコマンドで、`\`を入力しようとしたところ、OSXの環境によっては`¥`しか入力できなくてハマった。
対処の方法は下記のようなものがある。

- option + `\` で`\`が入力できる。
- システム環境設定 > キーボード > 入力ソースで、**¥キーで入力する文字**を`\`に変更する。

<img src="https://goo.gl/95mIgZ" width="60%" height="60%">

## shell script最終版

以上をふまえて、最終的なshell scriptは下記のようになる。

##### pngtosvg.sh
```bash
# $1に元ファイルのパス、$2に出力先のフォルダ名が指定されているとする
function pngtosvg() {
  base=$(basename $1)
  src=$(dirname $1)
  exp="s/^[^\/]*/$2/"
  dist=`echo $src | sed -e $exp`
  distfile=`echo $dist/$base | sed -e 's/.png/.bmp/'`

  if [ ! -d $dist ]; then
    echo $dist
    mkdir -p $dist
  fi

  convert $1  \( +clone -alpha opaque -fill white -colorize 100% \) +swap -geometry +0+0 -compose Over -composite -alpha off $distfile
  potrace --svg $distfile
  rm $distfile
}
export -f pngtosvg

# ここの$1はpngtosvg.shに渡された第一パラメータ(元フォルダ)である。$2は出力先のフォルダである。
find $1 -name '*.png' | xargs -IX -n1 bash -c "pngtosvg X $2"
```
