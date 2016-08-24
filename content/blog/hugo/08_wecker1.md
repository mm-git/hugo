+++
date = "2016-08-24T12:51:32+09:00"
description = "Hugoの記事をgituhubにpushすると、自動で記事が公開されるようにしてみる。自動化にはwerckerを使う。"
draft = false
slug = "hugowercker"
tags = ["Hugo", "git", "github", "wercker", "docker"]
title = "[Hugo] werckerを使って記事の公開を自動化する１"

+++

## Hugoの記事を公開する

下記の記事にも書いた通り、hugoの記事は下記の手順で公開している。

1. Hugoの元になるプロジェクトは[mm-git/hugo](https://github.com/mm-git/hugo)にpushする。(以下元プロジェクトと呼ぶ)
2. pushを検出して自動で`Hugo`コマンドを実行し、`public`フォルダを作成する。
3. `public`フォルダを公開プロジェクト[mm-git/mm-git.github.io](https://github.com/mm-git/mm-git.github.io)にpushする。
4. 記事が自動的に公開される。

> [[Hugo] github pagesについて](https://vode-house.jp/2016/07/26/githubpages/)

今回の記事は、**hugoコマンドの実行をどうやって自動化するか**について書いている。自動化には[Wercker](http://wercker.com/)を利用してみる。
なお、この[Wercker](http://wercker.com/)だが、最近仕様が変わったようで、公式の情報やネットで見つかる情報が古かったりしてハマった。下記の記事が参考になった。

> [Hugo, github pages, werckerで自動デプロイ 2016/05/12版 · blog.nabetama.com](https://blog.nabetama.com/post/2016-05-12-30/)

<!--more-->


## werckerの使い方

1. werckerにアカウント作成。
  - githubアカウントでログイン可能。今回の記事では特に説明しません。
2. 元プロジェクトに`wercker.yml`を追加。
3. githubで記事push用のPersonal access tokenを作成。
4. werckerでapplicationを登録。
5. werckerでdeployのworkflowを追加。
6. 元プロジェクトをpush。


### wercker.yml

##### wercker.yml
```yaml
box: python:2.7-slim
build:
  steps:
    - install-packages:
        packages: git
    - pip-install:
        requirements_file: ""
        packages_list: "pygments-style-solarized"
    - script:
        name: initialize git submodules
        code: git submodule update --init
    - arjen/hugo-build:
        theme: hugo-uno
        flags: --buildDrafts=false -v
deploy:
  steps:
    - install-packages:
        packages: git ssh-client
    - leipert/git-push:
        gh_oauth: $GIT_TOKEN
        repo: mm-git/mm-git.github.io
        branch: master
        basedir: public
```

#### Box
- boxには[https://hub.docker.com](https://hub.docker.com/)にあるboxを指定する。
  - `pip install`を使いたいので、boxは`python:2.7-slim`にしてみた。
  - 少し前まで、wercker directoryにあるboxを使えたようだが現在は使えないみたい。
  - Stack Overflowにも同じ質問があったので、回答してみた。

> [Wercker error 404 during setup environment - Stack Overflow](http://stackoverflow.com/questions/37010592/wercker-error-404-during-setup-environment/38775408#38775408)

#### build
- gitやsshなど基本的なものはインストールが必要。`- install-packages`の部分に記載する。
- `- pip-install`の部分に、Pythonのインストールパッケージを記載する。このboxは`Pygments`はインストール済みみたいなので、`pygments-style-solarized`のみインストールしている。
  - Pygmentsについては、[[Hugo] Syntax highlight](http://10.0.1.9:1313/2016/08/20/hugosyntaxhighlight/)参照。
- `hugo`のビルドの前に行いたい処理は、`- script`に書く。上記では、Hugoのテーマをsubmoduleにしているので、その更新処理を行っている。
- `hugo`のビルドはwerckerに登録されているstepを利用する。[arjen/hugo-build](https://app.wercker.com/applications/54a7744c6b3ba8733de4dcde/tab/details/)というのがそのステップ名。

#### deploy
- buildで作成したpublicフォルダのpushについては、deployのセクションに書く
- githubへのpushもwerckerに登録されているstepを利用する。[leipert/git-push](https://app.wercker.com/applications/53f202b50705e3656b000033/tab/details/) がそのステップ。
- githubへpushするためのtokenは`$GIT_TOKEN`の様に変数にしておく。(これで`wercker.yml`が公開レポジトリにpushされても問題ない)


### Personal access tokenを作成

werckerからgithubのレポジトリにpushできるように、github上でpush専用のaccess tokenを作成する。

1. githubの**アカウントのSettings**を選択。(レポジトリのSettingではない)
2. Personal access tokensを選択。
3. `Generate new token`ボタンを押す。
  - githubのパスワード確認があるかもしれない。
4. 次の画面で、tokenの名前を入力する(名前は何でも良い)。`public_repo`にチェックを付けて、下の`Generate token`ボタンを押す。
  <br><img src="https://goo.gl/1a5m50" alt="Personal access tokens" style="border:1px solid #000;">
5. 次の画面でtokenが表示される。**tokenが表示されるのはこの時１回きりなので、忘れずにコピーしておく。**

### werckerでapplicationを登録

1. 画面上部の`+ Create ▼`ボタンをクリックし、`application`を選択する。
2. `① Choose a repository`で元プロジェクトのレポジトリを選択する。
  - githubでアカウントでログインしていれば、githubに接続済みのはず。
3. `② Configure access`では`wercker will checkout the code without using an SSH key`を選択したままでOK。
4. `③ Awesome! You are all done!`では、Buildの様子などを他人に見られたくなければそのままでFinishを押す。

### werckerでdeployのworkflowを追加

1. werckerで登録したapplicationを選択する。
  - 画面上部の`Applications(w)を押すと、作成済みのApplication一覧が表示される。その中から先ほど作成したものを選択する。
2. `workflow`タブを選択する。
3. 画面中程の`Add new pipeline`を押す。
4. 下記のように入力する。特に`YML Pipeline name`は、wercker.ymlのpipeline名と合わせておく必要がある。`Hook type`はDefaultのままでOK。
  <br><img src="https://goo.gl/RZJQD4" alt="Wercker pipeline" style="border:1px solid #000;">
5. 次の画面で`Environment variable`を入力する。キーは`GIT_TOKEN`(wercker.ymlに書いた変数名)。値は、githubで登録しておいたPersonal access tokenを入力する。誰にも見られないように**`Protected`のチェックを忘れない**ようにする。最後にAddボタンを押す。
  <br><img src="https://goo.gl/Z2ZCXE" alt="Wercker token" style="border:1px solid #000;">
6. `workflow`の画面に戻る。`build`の横の`+`ボタンを押して、先ほど作成した`deploy`を追加する。branchは`master`にする。下記の様になればOK。
  <br><img src="https://goo.gl/K1eyt1" alt="Wercker token" style="border:1px solid #000;">

※この画面は何度かデザインが変更されているので、上記の説明は当てはまらないところがあるかもしれない。


### 元プロジェクトをpush

上記の設定で問題がなければ、元プロジェクトのpushをトリガにwerckerでのHugoのビルドと記事のデプロイが行われる。


## 終わりに

今回の`wercker.yml`だと、元プロジェクトのpushから記事が配信されるまでに結構な時間がかかる(数分〜十数分)。現状はこれをもう少し短縮できているので、別途記事に書きたいと思う。
また、wercker.ymlが正しいかどうかをローカル環境で確認する方法についても書く予定である。

