+++
date = "2016-08-09T13:38:22+09:00"
draft = false
slug = "hugoContent"
tags = ["Hugo", "markdown"]
title = "Hugoの記事について"
description = "Hugoでの記事の追加の仕方とそのPermalinkの決定方法について"

+++

## Hugoでの記事について

今後のことも考えて、Hugoでの記事の追加の仕方について考えてみる。

- 記事の追加の仕方とフォルダ構成
- 記事のPermalink
- 記事の書き方メモ

<!--more-->

### 記事の追加の仕方とフォルダ構成

このサイトの記事は主に次の3つを追加していこうと思っている。

- blog : 技術的な内容で主にハマりがちなことを書いていく。今後同じことでハマる人がいなくなれば幸い。
- work : 個人、仕事問わず、過去のアプリ、ライブラリ、作品などを公表できるものに限り載せていく。
- etc : 上記以外に突発的に何か載せたい場合に、個別ページとして掲載したい内容があれば。

Hugoでは、これらの記事を追加する場合に下記のコマンドを打つ。(以下はblogの場合)

```
hugo new blog/subfolder/記事ファイル名.md
```

こうすると、`content/blog/subfolder/記事ファイル名.md`という場所にファイルが作成される。
具体的には下記の様なファイル構成となる。

```
content
├── blog
│   ├── xxx
│   │   ├── 01_aaa.md
│   │   ├── 02_bbb.md
│   │   └── 03_ccc.md
│   ├── yyy
│   │   ├── 01_nnn.md
│   │   └── 02_mmm.md
│   :
│ 
├── work
│   ├── aboutmywork.md
│   :
│ 
└── etc
    ├── specialpage.md
    :
```

- blog以下は更にカテゴリごとのsubfolderを作成し、ファイルには連番を付ける。(記事の順番がわかるように)
  - Hugoの初期設定では`post`が記事のデフォルトフォルダとして設定されている。
  - Hugoの初期設定ではファイル名がそのまま記事タイトル、Permalink名になるが、これはファイル内で別途指定可能。
- workフォルダ以下は直接記事を置き、特に必要でない限り連番は付けない。
- etcフォルダもworkフォルダと同様。


### 記事のPermalink

上記の記事を公開するURL(Permalink)は下記のようにする。

 section | node    | URL 
---------|---------|-----
 blog    | list    | Page1 : `https://code-house.jp/blog/`<br>Page2 : `https://code-house.jp/blog/page/2`<br>..
         | article | `https://code-house.jp/blog/yyyy/mm/dd/slug`
 work    | list    | `https://code-house.jp/work/`
         | article | `https://code-house.jp/work/yyyy/slug`
 etc     | article | `https://code-house.jp/etc/slug`
 all     | archive | `https://code-house.jp/archive`


- blogのリストは最新記事から順に1ページに最大5件まで概要を表示する。
- blogのリストのみページ処理を行う。
- workは全てを１ページに載せる。(増えてきたら再考する)
- etcは特にリストは設けない
- archiveで全ての記事の一覧を表示

※上記をどのようにして実現するかは、別途記事に書くつもりです。

### 記事の書き方メモ

Hugoの記事は、通常のmarkdownファイルと違って、ファイルの先頭に下記のような記事ごとのパラメータを書くことができる。(Front matterと呼ばれている)

```
+++
date = "2016-08-09T13:38:22+09:00"
draft = false
tags = ["Hugo", "markdown"]
title = "Hugoの記事について"
slug = "hugoContent"
description = "Hugoでの記事の追加の仕方とそのPermalinkの決定方法について"
image = ""
+++
```

- slugは記事のURLの一部にもなる、記事の識別子。全ての記事でユニークにする必要がある。
  - しかしhugo自体はユニーク性をチェックしていないようなので、重複した場合はいづれかの記事が上書きされると思われる。
- descriptionは記事の一覧や、Open Graphに表示するための短い説明文を書く。
- imageに画像へのリンクを設定すると、Open Graphにその画像が設定される。

※description、imageはHugo標準の機能ではなく、独自に拡張しています。別途記事に書きます。
