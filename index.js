const express = require('express');
const path = require('path');
const fs = require('fs')
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
const corsOptions = {
  origin: [
    "https://syari.onrender.com/",
    "https://9788f66b-f961-4be5-86a7-702fa6a3717d-00-3jjyqm01cm8dz.worf.replit.dev/"
  ],
  optionsSuccessStatus: 200, // For legacy browsers support
};
app.use(cors(corsOptions));

// 静的ファイルの提供
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/search/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

function findMatchingObjects(data, parts) {
  return Object.entries(data).filter(([key, value]) => 
    parts.every(part => value.parts.includes(part))
  );
}

// 検索機能
app.get('/search/parts/:parts', (req, res) => {
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

app.get('/data', (req, res) => {
  const filename = path.join(__dirname, 'data.json');

  fs.readFile(filename, "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file", err);
      res.status(500).send('Error reading file');
      return;
    }
    res.json(JSON.parse(jsonString));
  });
});

// サーバーを起動
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
