+++
date = "2016-08-12T14:30:12+09:00"
description = "Hugoのテンプレートテーマのデザインを調整する。そのための準備について説明する。"
draft = false
slug = "hugopreparedesign"
tags = ["Hugo", "html", "sass", "css"]
title = "[Hugo] テーマのデサイン変更　準備編"

+++

## ベーステーマのデザイン調整

このサイトは`hugo-uno`というベーステーマを元に変更を行っている。デサインを変更するための準備について説明する。

> [fredrikloch/hugo-uno: A responsive hugo theme with awesome font's, charts and lightbox galleries](https://github.com/fredrikloch/hugo-uno)

<!--more-->

## hugoのフォルダ構成
 
今回の説明に関連のありそうな部分のみを抜粋すると、hugoのフォルダ構成は下記のようになっている。
 
```
project_folder
├── 📁archetypes
├── config.toml
├── 📁content
├── 📁layouts
├── 📁public
├── 📁static
└── 📁themes
    └── 📁hugo-uno
        ├── 📁archetypes
        ├── 📁images
        ├── 📁layouts
        ├── 📁static
        │   ├── 📁css
        │   ├── 📁fonts
        │   ├── 📁images
        │   ├── 📁js
        │   └── 📁scss
        └── theme.toml
```

- `archetypes`、`layouts`、`static`のフォルダは、プロジェクトフォルダの直下のファイルが優先的に使用される。
- プロジェクトフォルダの直下にないものは、themesフォルダのファイルが使用される。

### config.toml

まず、hugo自体の設定ファイルを編集する。このサイトでは下記のようになっている。

##### config.toml
```bash
baseurl = "http://siteurl"
languageCode = "ja_jp"
title = "サイトタイトル"
author = "作成者"
copyright = "Powered by Hugo. Copyright © 2016 製作者名"
theme = "hugo-uno"
canonifyurls = true
hasCJKLanguage = true
pygmentscodefences = true
pygmentsstyle = "solarizedlight"
PygmentsOptions = "linenos=table,nobackground=true"

[Params]
description = "サイトの説明"
github = "gituhubアカウント名"
facebook = "フェイスブックアカウント名"
linkedin = "Linkedinアカウント名"
logo = "/images/ロゴファイル名"

[taxonomies]
tag = "tags"
archive = "archives"

[permalinks]
blog = "/:year/:month/:day/:slug/"
work = "/work/:year/:slug"
```

- 先頭のパラメータはHugo自体のパラメータ。`.Site.パラメータ名`で取得できる。
  - 特にSyntaxhighlite関連のパラメータ(pygments~)は、なかなかネットでも情報がないので苦労しました。また記事にするかもしれません。
- `[Params]`のパラメータは、テーマで使うパラメータ。`.Site.Params.パラメータ名`で取得できる。
- `[taxonomies]`は特殊な一覧ページを作成したい場合に使用する。このサイトではタグ一覧と、記事のアーカイブ一覧を作成している。
- `[permalinks]`記事のタイプごとのPermalinkのフォーマットを指定する。

※上記には独自に拡張したパラメータも含んでいます。

### archetypes

- 記事を新規作成した時の、記事ファイルの先頭部分(フロントマター)を設定するためのフォルダ
- default.mdというファイルのみが置かれている。
- ベーステーマの内容から変更したい場合、`project_folder/archetypes/default.md`にファイルを置く。
- 記事のタイプ(blog/work)ごとに初期値を変えたい場合は、`blog.md`や`work.md`を作成する。

##### project_folder/archetypes/default.md
```bash
+++
date = "now()"
draft = true
slug = ""
tags = ["", ""]
title = ""
description = ""
image = ""
landscape = true
+++
```

- `slug`でPermalinkに使用される文字列が指定できるようになる。指定しなければPermalinkはタイトルと同じになる。
- `description`はこのサイトでは、一覧の説明文、Open Graphに設定されるように対応している。
- `image`はOpen Graphに設定されるように対応している。なければサイトのデフォルトの画像がOpen Graphになる。
- `image`の向きを指定する。

※description、imageはHugo標準の機能ではなく、独自に拡張しています。別途記事に書きます。


### layouts

- `theme/hugo-uno/layouts`に含まれるファイルの内、変更するものだけをプロジェクトフォルダの直下の`layouts`にコピーして編集する。
- 特に出力する日付のフォーマットを変更したい場合、ほぼ全てのファイルが変更が必要。
  - `{{ .Date.Format "Mon, Jan 2, 2006" }}`を`{{ .Date.Format "2006-01-02" }}`に変更する。
  - `config.toml`で日付フォーマットを指定できればいいのに・・。

### static

- staticフォルダの中身は、最終的にpublicフォルダにそのままコピーされる。
  - プロジェクトフォルダの直下の`static`のファイルが優先的に`public`コピーされ、そこにないファイルだけが`theme/hugo-uno/static`からコピーされる。
- よって、`theme/hugo-uno/static/css`、`theme/hugo-uno/static/js`、`theme/hugo-uno/static/scss`のファイルは、全てプロジェクトフォルダの直下の`static`に全てコピーしてから編集するのが事故が起こらなくていいと思う。


### static/scss

- `.scss`ファイルを変更した場合、ビルドが必要である。
- `hugo-uno`のページにも書いてあるが、ビルドには、`sass`と`bourbon`が必要。

```bash
gem install sass
gem install bourbon
bourbon install --path static/scss
```

- `.scss`のビルド方法は、[[gulp] sass編](https://code-house.jp/2016/08/06/gulpsass/)を参照。