+++
date = "2016-09-06T15:02:41+09:00"
description = "CoreDataはiOSでアプリのデータを保存するための仕組み。swiftの記事２つ目にしていきなり扱うようなネタではなさそうだが、しかし少しだけ調べたことについて書いてみようと思う。"
draft = false
slug = "swiftcoredata"
tags = ["swift", "iOS", "xcode", "Application", "CoreData"]
title = "[swift] CoreDataをさぐりさぐり触ってみた"

+++

## CoreData？？

CoreDataは、簡単にいうとiOSでアプリを作った場合にそのデータを保存しておくための仕組みだ。例えばRPGゲームならキャラクターの能力やレベル等のデータを保存したり、メモ帳アプリならメモの内容を保存したりといった用途にCoreDataは使われる。なのでiOSでアプリを作成する場合、このCoreDataというのは避けては通れない道なのである。

とは言うものの、iOSでのアプリ作成に必要な要素は他にもたくさんある。それらを置いといてswiftに関する記事２つ目にしていきなりCoreDataについて書くのはどうかとも思う。実際少しCoreDataのコードを書いて見たものの、まだ全然自分の中でベストプラクティスと思える状態にはなっていない。なので、この記事は現段階でCoreDataについて試行錯誤してみたという内容の記事である。

<!--more-->

## xcodeのデフォルトのコード

xcodeで新規にプロジェクトを作成する場合、'Single Page Application'など幾つかのテンプレートでは最初から下記の様にCoreDataにチェックを入れてプロジェクトを作成することで、CoreDataに対応したコードを生成してくれる。

<img src="http://goo.gl/E14aIi" width="50%">

CoreDataに関するコードは、AppDelegateというclass内に追加された状態でプロジェクトは生成される。ところがである。このCoreDataに関するコードがAppDelegateに追加された状態というのは別に悪くは無いのだが、かといってベストでもないというのがいろいろ調べてわかってきた。**xcode自らが生成するコードが非推奨ってどないやねん？？**

こういった情報は下記の記事や書籍などで見受けられた。

> [やはりお前らのCoreDataの使い方も間違っている - Qiita](http://qiita.com/yimajo/items/9935bb1896fc5d2ea8e5)

> [Adding Core Data to an existing project in Swift 2 | codebeaulieu](http://www.codebeaulieu.com/10/adding-core-data-using-swift-2)

> [Core Data in Swift - O'Reilly Media](http://shop.oreilly.com/product/9781680501704.do)

要するに、下記の様にしたほうがいいのでは？ということらしい。

- プロジェクト作成時に、`Use Core Data`のチェックは付けない。
- Core Dataに関するコードはAppDelegateクラスには直接書かない。別途クラスを用意する。

私自身もCoreData自体は直接AppDelegateとは関係のないものなので、別のクラスで定義した方がすっきりすると思っていた。そう思いながらたどり着いたのが上記のようなサイトであった。

## CoreDataの初期化クラスを書いてみた

実は、appleのDeveloperサイトにもCoreDataを独立したクラスで書く方法が書いてある。

> [Core Data Programming Guide: Initializing the Core Data Stack](https://developer.apple.com/library/watchos/documentation/Cocoa/Conceptual/CoreData/InitializingtheCoreDataStack.html)

残念ながらxcodeが生成するコードはまだ上記のようにはなっていないようだ。なので、自分で上記をコピペするなどしてコードを書く必要がある。

##### DataController.swift
```swift
import UIKit
import CoreData

class DataController: NSObject {
    var managedObjectContext: NSManagedObjectContext

    class var sharedInstance: DataController {
        struct Singleton {
            static let instance: DataController = DataController()
        }
        return Singleton.instance
    }

    override init() {
        // This resource is the same name as your xcdatamodeld contained in your project.
        guard let modelURL = NSBundle.mainBundle().URLForResource("ModelName", withExtension:"momd") else {
            fatalError("Error loading model from bundle")
        }
        // The managed object model for the application. It is a fatal error for the application not to be able to find and load its model.
        guard let mom = NSManagedObjectModel(contentsOfURL: modelURL) else {
            fatalError("Error initializing mom from: \(modelURL)")
        }
        let psc = NSPersistentStoreCoordinator(managedObjectModel: mom)
        managedObjectContext = NSManagedObjectContext(concurrencyType: .MainQueueConcurrencyType)
        managedObjectContext.persistentStoreCoordinator = psc
        let urls = NSFileManager.defaultManager().URLsForDirectory(.DocumentDirectory, inDomains: .UserDomainMask)
        let docURL = urls[urls.endIndex-1]
        /* The directory the application uses to store the Core Data store file.
         This code uses a file named "DataModel.sqlite" in the application's documents directory.
         */
        let storeURL = docURL.URLByAppendingPathComponent("Model.sqlite")
        do {
            try psc.addPersistentStoreWithType(NSSQLiteStoreType, configuration: nil, URL: storeURL, options: nil)
        } catch {
            fatalError("Error migrating store: \(error)")
        }
    }
}
```

このコードは、appleのコードから少し変更をしている。しかし、下記の変更についてはまだまださぐりさぐりの状態である。

### Singletonパターンにしてみた

appleのコードのままだと、DataController()を呼ぶたびにcontextを初期化してしまう。上記のようにすると、`let context = DataController.sharedInstance.managedObjectContext`の様にしてcontextにアクセスできる。そして、最初にこれを実行した時のみ`init()`が実行される。

しかし実際にはiOSにおけるSingletonはまずい場合もあるようである。最終的には何か他の方法を模索する必要がありそう。(タイミングによっては、明示的にcontextを最初期化する状況があるのかもしれない)

> [swift - iOS - Core Data Stack as singleton with main NSManagedObjectContext - Stack Overflow](http://stackoverflow.com/questions/30638999/ios-core-data-stack-as-singleton-with-main-nsmanagedobjectcontext)

### sqliteの読み込みを別スレッドにしていない

appleのコードでは26行目以降のsqliteファイルを実際に読み込む処理をdispatch_async()を使って別スレッドとしていた。これは、sqliteファイルの読み込みには時間がかかる場合があるためで、起動時のメインスレッドの動作を阻害しないようにそのようになっている。

一旦上記の様にしたのは、起動時に前回の状態を読み込む処理を書いているためである。そしてその処理は下記のようになっている。(多くのサイトで紹介されているようなよくあるコードである)

```swift
func fetchData() {
    let context = DataController.sharedInstance.managedObjectContext
    let request = NSFetchRequest(entityName: "EntityName")
    request.returnsObjectsAsFaults = false
    
    do {
        let allData = try tileContext.executeFetchRequest(request) as! [EntityData]
        :
        // any operation
    } catch {
        print("Could not fetch \(error)")
    }
}
```

あるアプリで、上記コードのDataControllerが最初に実行されるとする。するとDataControllerのinit()が初めて実行される。もしsqliteを読み込む処理が別スレッドであった場合、７行目のexecuteFetchRequest()を実行したタイミングでsqliteファイルの読み込みはおそらく完了していない。なので、allDataは空の配列となってしまう。つまり、sqliteの読み込みを別スレッドにすると、**前回の状態を読み込むことができない**のである。

しかしこれは実に安直な対応である。おそらくsqliteの読み込みには時間がかかるので、別スレッドで実行するというappleが推奨している対応にする必要があると思う。なので、最終的には下記のような面倒な対応が必要と思われる。

- 起動時に画面に初期化中がわかるメッセージ等を出しておく。
- 起動時のメインスレッドで一度DataControllerを初期化処理を呼ぶ。
- sqliteの読み込み処理が別スレッドで実行される。完了したらメインスレッドに通知する。
- sqliteの読み込み完了を受けてから、上記の`fetchData()`を実行する。
- `fetchData()`が完了したら、初期化中のメッセージ等を消して、アプリの正規のシーンへ移行する。


## DataControllerクラスの制約

上記のDataControllerには更に面倒な制約がある。contextを扱うのはメインスレッドに限られるという点である。これは下記の様に初期化しているためである。

```
managedObjectContext = NSManagedObjectContext(concurrencyType: .MainQueueConcurrencyType)
```

つまりsqliteへの保存など、おそらく時間がかかるであろう処理も全てメインスレッドで行わなければならないのである。なので例えばデータの保存の処理は下記の様にしてみた。saveData()を呼ぶ直前まではバックグラウンドのスレッドで何かしらデータの処理をしている。しかし、contextはメインスレッドで扱う必要があるので、dispatch_async()のブロックでメインスレッドとして実行している。

```swift
func saveData() {
    dispatch_async(dispatch_get_main_queue(), {
        let context: NSManagedObjectContext = DataController.sharedInstance.managedObjectContext
        let entity: NSEntityDescription! = NSEntityDescription.entityForName("entityName", inManagedObjectContext: context)
        let newData = EntityData(entity: entity, insertIntoManagedObjectContext: context)
        newData.xx = "xxx"
        do{
            try context.save()
        }
        catch{
            fatalError("Failed to save context: \(error)")
        }
    })
}
```

これを別スレッドで行うようににすることは可能である(`concurrencyType: .PrivateQueueConcurrencyType`を指定すればいい)。しかしその場合、データの保存完了とメインスレッドの間で何かしらの同期が必要な場合もあり、それはそれで本当に面倒である。

このあたりのベストな解決方法は、もっと本格的にアプリを作成する時に検証したいと思う。
