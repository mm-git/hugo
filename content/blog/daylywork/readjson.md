+++
tags = ["altitude","javascript","json"]
slug = "readaltitudejson"
draft = false
date = "2017-06-19T10:07:21+09:00"
description = "標高エリアjsonデータを読み込むクラスを作成してみる。"
title = "[WORK]標高エリアjsonデータを読み込む"

+++

## 標高エリアjsonデータを読み込む

先日の記事で作成した、不思議な文字列のjsonデータを読み込むクラスを作成してみる。読み込みの手順は下記の通りになる。

1. require()でjsonを読み込む。
2. 読み込んだ文字列を4文字ごとに区切る。
3. ４文字に区切ったうち、末尾の'='を削る。
4. 残りの文字列をbase64と似たアルゴリズムでデコードする。すると、24bitのデータが抽出される。
5. 上位7bitが緯度、次の8ビット経度、残り9bitが3x3グリッドのデータ有無を表す。
6. 緯度経度を16進数変換して4文字の文字列にする。これをkeyとする。グリッドの値はそのままvalueとする。
7. 結果として下記の様なObjectになる。

##### area Object
```json
area = {
  "NE": {
    "000a": 511, // 北緯0度、東経10度の3x3グリッドには全てのグリッドにデータがあることを示す。
    "0100": 511,
    :
  },
  "NW": {
    "0a0a": 511,
    "0a0b": 511,
    :
  },
  "SE": {
    "0a01": 511,
    "0a02": 511
    :
  },
  "SW": {
    "0a29": 8,  // 南緯10度、西経41度の3x3グリッドには、y=1, x=0のグリッドにのみデータがあることを示す。
    "0d26": 384
  }
};
```

上記処理のコード部分を抜粋して下記に置いておきます。

##### AltitudeService.js(一部抜粋)
```ES6
class AltitudeService {
  _prepareArea() {
    let areaJson = require('./altfilter.json');
    let area = {
      "NE": {},
      "NW": {},
      "SE": {},
      "SW": {}
    };

    Object.keys(areaJson).map((areaName) => {
      let coordinateList = areaJson[areaName].match(/.{1,4}/g);
      coordinateList.forEach((coordinateBase64) => {
        let coordinateKeyValue = this._decodeBase64(coordinateBase64);
        area[areaName][coordinateKeyValue.key] = coordinateKeyValue.value;
      })
    });

    return area;
  }

  _decodeBase64(base64) {
    base64 = base64.replace("=", "");

    let shift = 0;
    let decodeValue = 0;
    while(base64 !== ""){
      let c = base64.substr(0, 1);
      let code = c.charCodeAt(0) - 0x3f;
      decodeValue += code<<shift;
      shift += 6;
      base64 = base64.substr(1);
    }

    let lat = (decodeValue >> 17) & 0x7f;
    let lng = (decodeValue >> 9) & 0xff;
    let grid = decodeValue & 0x1ff;

    return {
      key: this._lngLatToHex(lng, lat),
      value: grid
    };
  }
}
```