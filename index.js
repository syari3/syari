const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// 静的ファイルの提供
app.use(express.static('public'));

// ルートパスにアクセスされた場合、index.htmlを返す
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// サーバーを起動
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
