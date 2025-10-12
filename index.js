const express = require('express');
const path = require('path');
const fs = require('fs')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    "https://syari3.github.io",
    /\.replit\.dev$/,
    /\.replit\.app$/
  ],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// 静的ファイルの配信
app.use(express.static('public'));

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

app.get('/kap-data.json', (req, res) => {
  const filename = path.join(__dirname, 'kap-data.json');

  fs.readFile(filename, "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading kap-data.json", err);
      res.status(500).send('Error reading file');
      return;
    }
    res.json(JSON.parse(jsonString));
  });
});

app.get('/kap-materials.json', (req, res) => {
  const filename = path.join(__dirname, 'kap-materials.json');

  fs.readFile(filename, "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading kap-materials.json", err);
      res.status(500).send('Error reading file');
      return;
    }
    res.json(JSON.parse(jsonString));
  });
});

app.get('/search/word/:id', (req, res) => {
  const id = req.params.id;
  const filename = path.join(__dirname, 'data.json');

  fs.readFile(filename, "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file", err);
      res.status(500).json({ error: 'Error reading file' });
      return;
    }

    const data = JSON.parse(jsonString);
    const item = data[id];

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'アイテムが見つかりません。' });
    }
  });
});
//If you deploy otherwhere,you should change '0.0.0.0' to something else
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
