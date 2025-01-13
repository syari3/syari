const express = require('express');
const path = require('path');
const fs = require('fs')

const app = express();
const port = 3000;

// 静的ファイルの提供
app.use(express.static('public'));

// ルートパスにアクセスされた場合、index.htmlを返す
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function findMatchingObjects(data, parts) {
  return Object.entries(data).filter(([key, value]) => 
    parts.every(part => value.parts.includes(part))
  );
}

// 検索機能
app.get('/search/:parts', (req, res) => {
  const parts = req.params.parts.split('-');
  const filename = path.join(__dirname, 'data.json')

  fs.readFile(filename, "utf8", (err, jsonString) => {
    if (err) {
      console.log("search:ファイル読み込み時エラー", err);
      res.json(0);
      return;
    }
    try {
      const data = JSON.parse(jsonString);
      if(data) {
        const result = findMatchingObjects(data, parts)
        res.json(result);
      }
    } catch (err) {
      console.log("search:JSON解析時エラー", err)
    }
  })
})


// サーバーを起動
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
