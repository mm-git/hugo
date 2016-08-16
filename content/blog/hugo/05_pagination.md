+++
date = "2016-08-16T13:36:08+09:00"
description = "Hugoにblog一覧のページを追加する。５記事毎にページを切り替えるようにしてみる。"
draft = false
slug = "hugopagination"
tags = ["hugo", "html"]
title = "[Hugo] ページネーションを追加する"

+++

## ブログ一覧ページの追加

このサイトは`hugo-uno`というベーステーマを元に作成している。しかし、このテーマはトップページに最新の記事を１０個だけ表示するようになっていた。また、`index.html#blog`というハッシュを付けた場合に一覧を表示するようになっている(カバーページと一覧ページを同一のhtmlで切り替えて表示するようになている)。

これを下記のように変更したいのだが、これがなかなかわかりにくくて、特に下記の★の２つはだいぶ調べるのに時間がかかった。最終的には対応できたのでこれを記事にしておきたいと思う。

- rootのindex.htmlはカバーページ専用とする。
  - この変更についてはこの記事では説明しない。変更点は[mm-git/hugo](https://github.com/mm-git/hugo)参照。`layouts/index.html`, `static/js/main.js`あたりを変更している。
- **`blog`、`work`といったセクションごとに、記事の一覧を作成する。★**
- **`blog`は５記事毎にページを切り替えるようにする。★**
- `work`は同一ページに全一覧を載せる。

<!--more-->


## blog一覧ページの作成

**まず最初のハマりポイント**。あるセクションごの一覧ページを作成する場合、下記のようにする。(わかれば簡単なのだが・・)

1. `layouts/section`フォルダに`セクション名.html`というファイルを作成する。
2. `layouts/セクション名`フォルダに、`summary.html`というファイルを作成する。
3. ファイル変更後、hugo serverを起動させて確認する。`http://baseurl/セクション名/`で一覧が表示される。

※`blog`セクションの場合、`layouts/blog/summary.html`、`layouts/section/blog.html`を作成


### layouts/section/blog.html

##### layouts/section/blog.html
```html
:
<section id="main">
    {{ $paginator := .Paginate (where .Data.Pages "Type" "blog") 5 }}
    
    <div class="article_list">
        {{ range $paginator.Pages }}
            {{ .Render "summary" }}
        {{ end }}
        :
    </div>
</section>
:
```

- 上記は、blog.htmlの一部。記事一覧とページ機能の部分のみ抜粋。
- このファイルを元にして、`public/blog/index.html`が作成される。
  - `public/blog/index.html`は一覧の1ページ目のhtmlファイルとなっている。
- **２つめのハマりポイント**。あるセクションごとに、かつ５ページごとにページ一覧作成するには、3行目の`.Paginate`関数のようにする。
  - `.Paginate`関数の結果を`$paginator`に代入しておくのがポイント。
  - `html`のどこかに`.Paginate`があれば、`public/blog/page/`にページごとの`index.html`が作成される。
      - `public/blog/page/1/index.html`、`public/blog/page/2/index.html`..のように`index.html`が作成される。
      - `public/blog/page/1/index.html`については、`public/blog/index.html`へリダイレクトされるようになっている。
- 6〜7行目で、各記事のサマリーを作成している。
  - `$paginator`には`.Paginate`関数で絞られた最大５記事のデータが配列で入っている。
  - `$paginator.Pages`でループさせることで、各記事のサマリを作成している。
  - `.Render "summary"`により、`layouts/blog/summary.html`の内容をここに出力する。


### layouts/blog/summary.html

##### layouts/blog/summary.html
```html
<article class="summary_post summary_link" onClick="document.location.href = '{{ .Permalink }}'">
<header>
<h2 class="summary-title">{{ .Title }} {{ if .Draft }}:: DRAFT{{end}} </h2>
<div class="post-meta">{{ .Date.Format "2006-01-02" }} - Read in {{ .ReadingTime }} Min </div>
</header>
<div class="summary">
    {{ .Description }}
</div>
<footer>
</footer>
</article>
```

- 記事の内容にアクセスするには、`.Permalink`、`.Title`などの変数を用いる。
  - [Hugo - Template Variables](https://gohugo.io/templates/variables/)の`Page Variables`に一覧がある。


### public フォルダの出力例

```
public
└──blog
   ├── index.html
   ├── index.xml
   └── page
       ├── 1
       │   └── index.html
       └── 2
           └── index.html
```


## work一覧ページの作成

`blog`のページ一覧と同様に下記ファイルを作成する。

- `layouts/section/work.html`
- `layouts/work/summary.html`

### layouts/section/work.html

##### layouts/section/work.html
```html
:
<section id="main">
    <div class="article_list">
        {{ range .Data.Pages }}
            {{ if eq .Type "work" }}
                {{ .Render "summary"}}
            {{ end }}
        {{ end }}
    </div>
</section>
:
```

- 上記は、work.htmlの一部。記事一覧とページ機能の部分のみ抜粋。
- このファイルを元にして、`public/work/index.html`が作成される。
- 4〜6行目で、各記事のサマリーを作成している。
  - `.Data.Pages `で全ての記事をループさせ、そのうちタイプが`work`のものだけ、各記事のサマリを作成している。
  - `.Render "summary"`により、`layouts/work/summary.html`の内容をここに出力する。


### layouts/work/summary.html

##### layouts/work/summary.html
```html
<article class="summary_post summary_link sumary_work" onClick="document.location.href = '{{ .Permalink }}'">
<header>
</header>
<footer>
</footer>
<div class="post_image_frame">
    {{ if .Params.landscape }}
    <img src="{{ .Params.image }}" class="post_image post_image_landscape">
    {{ else }}
    <img src="{{ .Params.image }}" class="post_image">
    {{ end }}
</div>
</article>
```

- `blog`一覧では、記事のタイトル、説明文を表示していたが、`work`では画像のみを表示している。
- 本サイトではwork記事の.mdファイルフロントマターに、`image`と`landscape`を設定するようにしている。
- 記事のフロントマターは、`.Params.image`のようにすることでアクセスできる。
- 上記のようにすることで、記事のフロントマターで設定した画像が記事一覧に表示される。

### public フォルダの出力例

```
public
└──work
   ├── index.html
   └── index.xml
```

