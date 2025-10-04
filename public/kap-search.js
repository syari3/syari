function switchSearchType() {
  const kapuAlphaRadio = document.getElementById("kapu-alpha-radio");
  const readingRadio = document.getElementById("reading-radio");
  const japaneseRadio = document.getElementById("japanese-radio");
  
  if (kapuAlphaRadio && kapuAlphaRadio.checked) {
    document.getElementById("kapu-alpha").style.display = "grid"; 
    document.getElementById("reading").style.display = "none"; 
    document.getElementById("japanese").style.display = "none"; 
  } else if (readingRadio && readingRadio.checked) {
    document.getElementById("kapu-alpha").style.display = "none";
    document.getElementById("reading").style.display = "grid"; 
    document.getElementById("japanese").style.display = "none"; 
  } else if (japaneseRadio && japaneseRadio.checked) {
    document.getElementById("kapu-alpha").style.display = "none";
    document.getElementById("reading").style.display = "none";
    document.getElementById("japanese").style.display = "grid";
  }
}

function searchKap() {
  const kapuAlphaRadio = document.getElementById("kapu-alpha-radio");
  const readingRadio = document.getElementById("reading-radio");
  const japaneseRadio = document.getElementById("japanese-radio");
  
  if (kapuAlphaRadio && kapuAlphaRadio.checked) {
    searchKapAlphabet();
  } else if (readingRadio && readingRadio.checked) {
    searchKapReading();
  } else if (japaneseRadio && japaneseRadio.checked) {
    searchKapJapanese();
  }
}

async function searchKapAlphabet() {
  const inputValue = document.getElementById("kapu-alpha-input").value.trim().toLowerCase();
  
  if (!inputValue) {
    dialog("カプ語のアルファベットを入力してください。");
    return;
  }
  
  const filename = '/kap-data.json';

  try {
    const response = await fetch(filename);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonData = await response.json();
    const results = Object.entries(jsonData).filter(([key, value]) => 
      key && key.toLowerCase().includes(inputValue)
    );
    results.sort((a, b) => a[0].length - b[0].length);

    if(results.length > 0) {
      dialog(`${results.length}個のデータが見つかりました。`)
    } else {
      dialog("該当するデータは見つかりませんでした。")
    }

    document.getElementById('result-container').innerHTML = '';
    const resultMessage = document.createElement('div');
    if (results.length > 0) {
      resultMessage.textContent= `${results.length}個のデータが見つかりました。`
    } else {
      resultMessage.textContent= `該当するデータは見つかりませんでした。`
    }
    document.getElementById('result-container').appendChild(resultMessage);

    results.forEach(([key, item], index) => {
      const container = document.createElement('div');
      container.className = 'item-container container';
      
      const keyElement = document.createElement('h3');
      keyElement.textContent = key;
      container.appendChild(keyElement);
      
      const readingElement = document.createElement('p');
      readingElement.textContent = `読み方: ${item?.reading || '（なし）'}`;
      container.appendChild(readingElement);
      
      const meaningElement = document.createElement('p');
      meaningElement.textContent = `意味: ${item?.meaning || '（なし）'}`;
      container.appendChild(meaningElement);
      
      if (item?.etymology) {
        const etymologyElement = document.createElement('p');
        etymologyElement.textContent = `語源: ${item.etymology}`;
        container.appendChild(etymologyElement);
      }
      
      if (item?.examples && item.examples.length > 0) {
        const examplesTitle = document.createElement('p');
        examplesTitle.textContent = '例文:';
        examplesTitle.style.fontWeight = 'bold';
        container.appendChild(examplesTitle);
        
        item.examples.forEach(example => {
          const exampleDiv = document.createElement('div');
          exampleDiv.style.marginLeft = '20px';
          exampleDiv.innerHTML = `<p>カプ語: ${example?.kapu || ''}<br>日本語: ${example?.japanese || ''}</p>`;
          container.appendChild(exampleDiv);
        });
      }
      
      if (item?.notes) {
        const notesElement = document.createElement('p');
        notesElement.textContent = `備考: ${item.notes}`;
        container.appendChild(notesElement);
      }
      
      document.getElementById('result-container').appendChild(container);
    });
  } catch (error) {
    console.error("Error fetching or parsing kap-data.json", error);
    dialog("データの取得中にエラーが発生しました。");
  }
}

async function searchKapReading() {
  const inputValue = document.getElementById("reading-input").value.trim();
  
  if (!inputValue) {
    dialog("読みを入力してください。");
    return;
  }
  
  const filename = '/kap-data.json';

  try {
    const response = await fetch(filename);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonData = await response.json();
    const results = Object.entries(jsonData).filter(([key, value]) => 
      value?.reading && value.reading.includes(inputValue)
    );
    results.sort((a, b) => (a[1]?.reading?.length || 0) - (b[1]?.reading?.length || 0));

    if(results.length > 0) {
      dialog(`${results.length}個のデータが見つかりました。`)
    } else {
      dialog("該当するデータは見つかりませんでした。")
    }

    document.getElementById('result-container').innerHTML = '';
    const resultMessage = document.createElement('div');
    if (results.length > 0) {
      resultMessage.textContent= `${results.length}個のデータが見つかりました。`
    } else {
      resultMessage.textContent= `該当するデータは見つかりませんでした。`
    }
    document.getElementById('result-container').appendChild(resultMessage);

    results.forEach(([key, item], index) => {
      const container = document.createElement('div');
      container.className = 'item-container container';
      
      const keyElement = document.createElement('h3');
      keyElement.textContent = key;
      container.appendChild(keyElement);
      
      const readingElement = document.createElement('p');
      readingElement.textContent = `読み方: ${item?.reading || '（なし）'}`;
      container.appendChild(readingElement);
      
      const meaningElement = document.createElement('p');
      meaningElement.textContent = `意味: ${item?.meaning || '（なし）'}`;
      container.appendChild(meaningElement);
      
      if (item?.etymology) {
        const etymologyElement = document.createElement('p');
        etymologyElement.textContent = `語源: ${item.etymology}`;
        container.appendChild(etymologyElement);
      }
      
      if (item?.examples && item.examples.length > 0) {
        const examplesTitle = document.createElement('p');
        examplesTitle.textContent = '例文:';
        examplesTitle.style.fontWeight = 'bold';
        container.appendChild(examplesTitle);
        
        item.examples.forEach(example => {
          const exampleDiv = document.createElement('div');
          exampleDiv.style.marginLeft = '20px';
          exampleDiv.innerHTML = `<p>カプ語: ${example?.kapu || ''}<br>日本語: ${example?.japanese || ''}</p>`;
          container.appendChild(exampleDiv);
        });
      }
      
      if (item?.notes) {
        const notesElement = document.createElement('p');
        notesElement.textContent = `備考: ${item.notes}`;
        container.appendChild(notesElement);
      }
      
      document.getElementById('result-container').appendChild(container);
    });
  } catch (error) {
    console.error("Error fetching or parsing kap-data.json", error);
    dialog("データの取得中にエラーが発生しました。");
  }
}

async function searchKapJapanese() {
  const inputValue = document.getElementById("japanese-input").value.trim();
  
  if (!inputValue) {
    dialog("日本語を入力してください。");
    return;
  }
  
  const filename = '/kap-data.json';

  try {
    const response = await fetch(filename);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonData = await response.json();
    const results = Object.entries(jsonData).filter(([key, value]) => 
      value?.meaning && value.meaning.includes(inputValue)
    );
    results.sort((a, b) => (a[1]?.meaning?.length || 0) - (b[1]?.meaning?.length || 0));

    if(results.length > 0) {
      dialog(`${results.length}個のデータが見つかりました。`)
    } else {
      dialog("該当するデータは見つかりませんでした。")
    }

    document.getElementById('result-container').innerHTML = '';
    const resultMessage = document.createElement('div');
    if (results.length > 0) {
      resultMessage.textContent= `${results.length}個のデータが見つかりました。`
    } else {
      resultMessage.textContent= `該当するデータは見つかりませんでした。`
    }
    document.getElementById('result-container').appendChild(resultMessage);

    results.forEach(([key, item], index) => {
      const container = document.createElement('div');
      container.className = 'item-container container';
      
      const keyElement = document.createElement('h3');
      keyElement.textContent = key;
      container.appendChild(keyElement);
      
      const readingElement = document.createElement('p');
      readingElement.textContent = `読み方: ${item?.reading || '（なし）'}`;
      container.appendChild(readingElement);
      
      const meaningElement = document.createElement('p');
      meaningElement.textContent = `意味: ${item?.meaning || '（なし）'}`;
      container.appendChild(meaningElement);
      
      if (item?.etymology) {
        const etymologyElement = document.createElement('p');
        etymologyElement.textContent = `語源: ${item.etymology}`;
        container.appendChild(etymologyElement);
      }
      
      if (item?.examples && item.examples.length > 0) {
        const examplesTitle = document.createElement('p');
        examplesTitle.textContent = '例文:';
        examplesTitle.style.fontWeight = 'bold';
        container.appendChild(examplesTitle);
        
        item.examples.forEach(example => {
          const exampleDiv = document.createElement('div');
          exampleDiv.style.marginLeft = '20px';
          exampleDiv.innerHTML = `<p>カプ語: ${example?.kapu || ''}<br>日本語: ${example?.japanese || ''}</p>`;
          container.appendChild(exampleDiv);
        });
      }
      
      if (item?.notes) {
        const notesElement = document.createElement('p');
        notesElement.textContent = `備考: ${item.notes}`;
        container.appendChild(notesElement);
      }
      
      document.getElementById('result-container').appendChild(container);
    });
  } catch (error) {
    console.error("Error fetching or parsing kap-data.json", error);
    dialog("データの取得中にエラーが発生しました。");
  }
}
