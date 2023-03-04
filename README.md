# deno_meal_recorder
食事情報を記録するAPIのサンプル実装

## 動かし方

```sh
$ cp .env.example .env

# .envにコピーしてDBの情報を埋めてAPIを起動する
$ deno run --allow-read --allow-net --allow-env main.ts

# 食事情報を記録する
curl -X POST -H "Content-Type: application/json" http://localhost:8080/meals -d '{"name": "パスタ", "protein": 10, "fat": 10, "carbo": 30, "calorie": 250}'

# 記録した食事情報一覧
curl http://localhost:8080/meals
[
  {
    "id": 1,
    "name": "パスタ",
    "protein": 10,
    "fat": 10,
    "cargo": 30,
    "calorie": 250,
    "created_at": "2023-02-21 10:01:11",
  }
  ...
]

# 特定の食事情報を取得する
curl http://localhost:8080/meals/1

# 食事情報の更新
curl -X PATCH -H "Content-Type: application/json" http://localhost:8080/meals/1 -d '{"protein": 20}'

# 食事情報の削除
curl -X DELETE http://localhost:8080/meals/1
```
