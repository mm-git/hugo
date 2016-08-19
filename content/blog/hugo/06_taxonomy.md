+++
date = "2016-08-19T15:16:45+09:00"
description = "HugoにTag一覧のページを追加する。更に記事の先頭にタグを表示する。"
draft = false
slug = "hugotaxonomy"
tags = ["Hugo", "html"]
title = "[Hugo] タグを追加する"

+++

## タグ一覧ページと記事の先頭にタグを追加

Hugoの記事は、markdownファイルの先頭に下記の様に書くことで、その記事にタグを付けることができる。

```
tags = ["Hugo", "html", ...]
```

ただしこれらの一覧を表示したり、記事の先頭にタグを表示したりするには、layoutsフォルダ以下のテンプレートを追加、作成しないといけない。最終的には下記の様に対応を行ったが、これもなかなかわかりにくかったので記事にしておく。

- `http://baseurl/tags`でタグ一覧ページを表示する。
- 例えば`Hugo`に関する記事の場合、`http://baseurl/tags/hugo`でその一覧を表示する。
- 各記事の先頭にタグを表示する。

<!--more-->

## タグ一覧ページの作成

1. `config.toml`ファイルにタグ一覧の設定を追加する。
2. `layouts/taxonomy`フォルダに`tag.terms.html`と`tag.html`というファイルを作成する。
3. ファイル変更後、hugo serverを起動させて確認する。`http://baseurl/tags/`で一覧が表示される。


### config.toml

##### config.toml
```yaml
[taxonomies]
tag = "tags"
```

**この設定だが非常に紛らわしいので注意**

- `[taxonomies]`の所には、何かしらの一覧を表示したいものを定義するようになっている。
- 今回の記事ではタグについて書いているが、カテゴリなどを追加することも可能。
- そして何故かよくわからないが、**`単数形 = "複数形"`**の様に定義する。
- すると、`layouts/taxonomy/単数形.terms.html`がタグ全体の一覧、`layouts/taxonomy/単数形.html`が各タグの一覧になる。
  - `単数形.terms.html`や`単数形.html`がない場合は、`layouts/_default`や`themes/テーマ名/layouts/`フォルダにあるものが採用される。
- 一覧のURLは`http://baseurl/複数形/`となる。
- 各記事の先頭に書く一覧リストは、`複数形 = ["xxx", "yyy", ..]`となる。


### layouts/taxonomy/tag.terms.html

##### layouts/taxonomy/tag.terms.html
```html
:
<section id="main">
  <div>
    <h1 id="title">{{ .Title }}</h1>
    <div class="tags_list">
    {{ range $key, $value := .Data.Terms }}
        <div class="tags_item">
            <a href="{{ $key | urlize }}">{{ $key }} <span class="tags_number">{{ len $value }}</span></a>
        </div>
    {{ end }}
    </div>
  </div>
</section>
:
```

- 上記は、tag.terms.htmlの一部。
- このファイルを元に、`public/tags/index.html`が作成される。
- `.Title`には`複数形`の値が入っている。(先頭は大文字になる)
- `.Data.Terms`でタグ一覧が取得できる。


### layouts/taxonomy/tag.html

##### layouts/taxonomy/tag.html
```html
:
<section id="main">
    <div class="tags_list">
    <div class="tags_title"><span>{{ .Title }}</span></div>
    </div>
    <ul id="list">
        {{ range .Data.Pages }}
        <li>
            {{ .Date.Format "2006-01-02" }}
            <a href="{{ .RelPermalink }}">{{ .Title }}</a>
        </li>
        {{ end }}
    </ul>
    <hr>
    <a href="{{ .Site.BaseURL }}/tags">Tags</a>
</section>
:
```

- 上記は、tag.htmlの一部。
- このファイルを元に、`public/tags/タグ名/index.html`が作成される。
- `.Title`にはタグ名の値が入っている。(先頭は大文字になる)
- `.Data.Pages`でそのタグに関する記事一覧が取得できる。


### public フォルダの出力例

```
public
└──tags
   ├── index.html
   ├── tagA
   │   ├── index.html
   │   └── index.xml
   ├── tagB
   │   ├── index.html
   │   └── index.xml
   :
```


## 各記事の先頭にタグを表示する

`blog`の記事について、各記事の先頭にタグを表示したい。`layouts/blog/single.html`を編集する。

### layouts/blog/single.html

##### layouts/blog/single.html
```html
:
{{ with .Params.tags }}
<div class="tags_list">
  {{ range . }} <div class="tags_item"><a href="/tags/{{ lower . }}/">{{ . }}</a></div>{{ end }}
</div>
{{ end }}
:
```

- 上記は、single.htmlの一部。
- 記事のタグは`.Params.tags`で取得できる。
- linkアドレスは**全て小文字**にする必要がある。`{{ lower . }}`の様にする必要がある。
