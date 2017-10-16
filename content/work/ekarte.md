+++
date = "2017-10-16T11:26:21+09:00"
description = "code houseとしての初めての受注案件です。K社様向けにeKarteシステムを作成しました"
draft = false
image = "images/ekarte.png"
landscape = false
slug = "ekarte"
tags = ["node", "vue", "html5", "css", "php", "PostgreSQL", "ES6"]
title = "K社様向け案件 eKarte"
+++

## eKarte

code houseとしての初めての受注案件です。K社様向けにeKarteシステムを作成しました。

<img src="../../images/ekarte_small.png">


## 成果物

- 個人の病院の患者のカルテを電子化するWEBアプリケーションを作成しました。
- 主な機能

  - 病院の各先生のアカウント管理
  
    <img src="../../images/login.png">
  
  - 患者の情報管理

    <img src="../../images/register.png">

  - 患者のカルテの電子化、印刷機能

    <img src="../../images/search.png">
    
  - 患者の予約管理

    <img src="../../images/calendar.png">


## 使用言語、環境など

### Backend 

現状はVirtualbox/vagrantでクローズな院内の環境で動作させていますawsなどのサーバを用いてクラウドに移行することは難しくはありません。

  - ubuntu 16.04
  - nginx
  - postgresql
  - php

### Frontend

npm/gulpを用いて、ソースファイルをビルドしています。主なフレームワークは下記の通りです。

  - Javascript(ES6)
  - HTML5(ejsを使って変換)
  - CSS(sassから変換)
  - bootstrap 3
  - font awesome
  - webpack 1
  - vue.js
  - jquery

### その他

作成したものは、wreckerを用いて自動テストを行うようにしています。

  - phpunit
  - sinon


## 最後に

code houseでは細々とお仕事募集中です。
Webアプリケーションであれば、BackendからFrontendまで幅広い対応が可能です。
iOSアプリの開発も手がけています。
みなさまよろしくお願いいたします。
