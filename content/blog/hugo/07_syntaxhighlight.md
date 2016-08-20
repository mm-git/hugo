+++
date = "2016-08-20T19:30:57+09:00"
description = "HugoでSyntax Highlightを使ってみる。また、配色をSolarizedにしてみる。"
draft = false
image = ""
landscape = true
slug = "hugosyntaxhighlight"
tags = ["Hugo", "Pygments", "Solarized"]
title = "[Hugo] Syntax highlight"

+++

## Hugoでソースコードを綺麗に表示する

このサイトは特にたくさんのソースコードを記事に載せているが、ソースコードを綺麗に色付きで表示するには、HugoのSyntax hightlight機能を有効にする必要がある。しかし、**Syntax Highlight機能をONにするだけで簡単に実現できなかった**ので記事にしておこうと思う。
さらに、Syntax Highlightの配色として**Solarized**を使いたかったのだが、これがそのままでは未対応だった。少し工夫が必要だったのでそれも書いておく。

公式の情報は下記の通り。Hugo V0.15以降で対応しているようだ。

> [Hugo – Syntax Highlighting](http://hugodocs.netlify.com/extras/highlighting/)

参考になった記事

> [hugo で Fence Code Blocks (```)を有効化する - Qiita](http://qiita.com/hfm/items/3df99e0f94162d454f7a)


<!--more-->

## Syntax Highlight機能をONにする

1. `config.toml`にSyntax Highlightの設定を３つ追加する。
2. ローカルで試すために、Pygmentsをインストールする。
3. Pygments-style-solarizedをインストールする。
4. solarizedlight用のcssファイルを用意する。 
5. 記事にFenced Code Blockでソースコードを書く。

### config.toml

##### config.toml
```yaml
:
pygmentscodefences = true
pygmentsstyle = "solarizedlight"
PygmentsOptions = "linenos=table,nobackground=true"
:
```

- `config.toml`の先頭部分のどこかに上記３行を追加する。
- Syntax Highlightを有効にする場合、公式ページでは`pygmentsuseclasses = true`と書いてあるが、**`pygmentscodefences = true`が正しい**ようだ。
- `pygmentsstyle`でSyntax Highlightの配色を指定する。しかし、**`solarizedlight`は未サポート**なので、下記に示す対応が必要。
- `PygmentsOptions`は必要なければ設定は不要。このサイトでは、行番号の表示と、背景色を無効にしている。
  - `linenos=table`とすると、`<table>`タグを使って、行番号とコードが表示される。
  - `nobackground=true`
  - その他のパラメータはPygmentsのドキュメント参照

> [Available formatters — Pygments](http://pygments.org/docs/formatters/)
>
> ※class LatexFormatterのパラメータが該当すると思われる。


### Pygmentsをインストールする。

Hugoは記事のmarkdownファイル内にFenced Code Blockを見つけた場合、Pygmentsという外部ツールを使ってコードをSyntax Hightlight付きのHTMLに変換する。そのため、ローカル環境で記事を変換したり表示を確認したるする場合、Pygmentsをインストールしておく必要がある。
PygmentsのインストールにはPython 2.7が必要(手元の環境はPython V2.7.12, pip V8.1.2)。下記のようにしてインストールする。

```bash
pip install Pygments
```

- `Hugo`コマンドを実行する前に入れておかないと大量のエラーが出る。


### pygments-style-solarizedをインストールする

Pygmentsはインストールした直後の状態でsolarizedをサポートしていない。初期状態でサポートしている配色は下記のコマンドで確認できる。

```bash
$ python -c 'from pygments.styles import get_all_styles; print list(get_all_styles())'
['manni', 'igor', 'lovelace', 'xcode', 'vim', 'autumn', 'vs', 'rrt', 'native', 'perldoc', 'borland', 'tango', 'emacs', 'friendly', 'monokai', 'paraiso-dark', 'colorful', 'murphy', 'bw', 'pastie', 'algol_nu', 'paraiso-light', 'trac', 'default', 'algol', 'fruity']
```

そこで、`pygments-style-solarized`をインストールする。

```bash
pip install pygments-style-solarized
```

この後、再度配色を確認すると`solarizeddark`, `solarizedlight`が追加されているのがわかる。

```bash
$ python -c 'from pygments.styles import get_all_styles; print list(get_all_styles())'
['manni', 'igor', 'lovelace', 'xcode', 'vim', 'autumn', 'vs', 'rrt', 'native', 'perldoc', 'borland', 'tango', 'emacs', 'friendly', 'monokai', 'paraiso-dark', 'colorful', 'murphy', 'bw', 'pastie', 'algol_nu', 'paraiso-light', 'trac', 'default', 'algol', 'fruity', 'solarizeddark', 'solarizedlight']
```


### solarizedlight用のcssファイルを用意する

各配色のcssファイルは下記のコマンドで確認することができる。これを、`solarizedlight.css`などのファイルにリダイレクトで出力する。

```css
$ pygmentize -S solarizedlight -f html
.hll { background-color: #ffffcc }
.c { color: #93a1a1; font-style: italic } /* Comment */
.err { color: #dc322f } /* Error */
.g { color: #657b83 } /* Generic */
:
:
```

上記のようにして作ったcssファイルを、header部分のlayoutファイルで読み込むようにする。

##### layouts/partials/head.html
```html
:
    <link rel="stylesheet" type="text/css" href="{{ .Site.BaseURL }}/css/solarizedlight.css" />
:
```


### 記事にFenced Code Blockでソースコードを書く

Syntax Highlightを行いたいソースコードの上下を、\`\`\`で囲む。最初の\`\`\`に続けて、ファイルのフォーマット(bash, html, javascript, coffeeなど)を書くと、Syntax hilightの機能が働く。(ファイルのフォーマット無しだと、単に書いた内容がそのまま出力されるだけ)

