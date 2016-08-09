+++
date = "2016-07-26T12:21:20+09:00"
draft = false
slug = "GithubPages"
tags = ["Hugo", "github"]
title = "github pagesについて"
description = "リポジトリの内容をそのままwebとして公開できるgithub pagesについて調べてみた。"

+++

## github pagesについて

<a href="https://pages.github.com/"><img title="github pages" src="http://capture.heartrails.com/200x150/cool?https://pages.github.com/" alt="https://pages.github.com/" width="200" height="150" /></a>


リポジトリの内容をそのままwebとして公開できるgithub pagesについて調べてみた。github pagesには次の２つがあるようだ。

- User site
- Project site

<!--more-->

※User siteと似たようなものに、Organization siteというのがある。これは、登録ユーザが組織の場合のサイトであるが、今回の説明では省略する。

### User site

- User siteは、githubに登録しているユーザが１つだけ持つことができるgithub pagesである。
- 仕組みは簡単で、ユーザ名.github.ioという名前のリポジトリにファイルを置くだけである。
- https://ユーザ名.github.io というURLでページが表示される。
- 表示されるのは、**master**ブランチ。

※https://ユーザ名.github.com というURLだったようだが、.ioに変わったようだ。今は.comにアクセスすると.ioにリダイレクトされる。

### Project site

- ユーザ名.github.io以外のリポジトリをgithub pagesとして公開できるようにしたもの。
- リポジトリにgh_pagesというブランチを作りファイルを置く。
- https://ユーザ名.github.io/リポジトリ名 というURLでページが表示される。
- 表示されるのは、**gh_pages**ブランチ。(masterではない)

## 実際の運用

User siteでは、gitgub pagesの元になるファイル群と、実際に公開するファイル群でそれぞれ別のリポジトリを作成するのがいいと思われる。
(試してはいないが、元ファイルをmaster以外、公開ファイルをmasterにすれば、１つのリポジトリでも運用できるかもしれない)
具体的にHugoでこのサイトを公開している私の場合、 [mm-git/hugo](https://github.com/mm-git/hugo)に元ファイルを置いている。そしてHugoが生成したpublicフォルダを[mm-git/mm-git.github.io](https://github.com/mm-git/mm-git.github.io)に置くようにしている。

