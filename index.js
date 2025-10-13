const express = require('express');
const path = require('path');
const fs = require('fs')
const cors = require('cors')
const app = express();
const port = 5000;

app.use(cors());
const corsOptions = {
  origin: [
    "https://syari-api.onrender.com/",
    "https://syari.onrender.com/",
    "https://9788f66b-f961-4be5-86a7-702fa6a3717d-00-3jjyqm01cm8dz.worf.replit.dev/"
  ],
  optionsSuccessStatus: 200, // For legacy browsers support
};
app.use(cors(corsOptions));

// 静的ファイルの提供
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/syari', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'syari.html'));
});

app.get('/kap', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'kap.html'));
});

app.get('/kap/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'kap/search.html'));
});

app.get('/kap/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'kap/docs.html'));
});

app.get('/syari/search/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'syari/search.html'));
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
      res.status(500).send('Error reading file');
      return;
    }

    const data = JSON.parse(jsonString);
    const item = data[id];

    // fullプロパティがokか確認
    if (item) {
      res.send(`
        <h1>${item.yomi}</h1>
        <p>意味: ${item.imi}</p>
        <p>詳細情報: ${item.kaisetu || '情報はありません。'}</p>
        <a href="/search/">戻る</a>
      `);
    } else {
      res.status(404).send('アイテムが見つかりません。');
    }
  });
});
//If you deploy otherwhere,you should change '0.0.0.0' to something else
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
