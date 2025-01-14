var partsTable = {
  image1 : "s",
  image2 : "ms",
  image3 : "hs",
  image4 : "ts",
  image5 : "ns",
  image6 : "ss",
  image7 : "m",
  image8 : "w",
  image9 : "u",
  image10: "o",
  image11: "z",
  image12: "l",
}

function nowParts() {
  var nowParts = [];
  for (var i = 1; i <= 12; i++) {
    if (id("image" + i).style.display == "block") {
      nowParts.push(partsTable["image" + i]);
    }
  }
  return nowParts;
}

function getCorrectPart(part, parts) {
  switch (part) {
    case "o": 
      if (parts.includes("ss")) {
        return "o2";
      } else if (parts.includes("ts")) {
        return "o3";
      } else {
        return "o1";
      }
    case "z":
      if (parts.includes("ss")) {
        return "z2";
      } else if (parts.includes("ts")) {
        return "z3";
      } else {
        return "z1";
      }
    case "l":
      if (parts.includes("s")) {
        return "l2";
      } else {
        return "l";
      }
    default:
      return part;
  }
}

async function search() {
  var parts = nowParts().join("-");
  if(parts == []) {
    dialog("少なくとも一つのパーツを入力してください。")
    return;
  }
  var url = "https://9788f66b-f961-4be5-86a7-702fa6a3717d-00-3jjyqm01cm8dz.worf.replit.dev/search/" + parts;
  console.log(typeof(parts))
  console.log(url)
  try {
    const response = await fetch(url);

    const data = await response.json();
    console.log(data);
    if(data.length > 0) {
      dialog(`${data.length}個のデータが見つかりました。`)
    } else {
      dialog("該当するデータは見つかりませんでした。")
    }
    
    // Clear existing content
    document.getElementById('result-container').innerHTML = '';

    var result = document.createElement('div');
    result.textContent = `${data.length}個のデータが見つかりました。`

    id("result-container").appendChild(result)
    var i = 0;

    // Create HTML elements for each item in the data
    data.forEach(item => {
      i++;
      const container = document.createElement('div');
      container.className = 'item-container container';

      const yomiElement = document.createElement('span');
      yomiElement.textContent = `読み方: ${item[1].yomi}`;

      const imiElement = document.createElement('span');
      imiElement.textContent = `意味: ${item[1].imi}`;

      const imageContainer = document.createElement('div');
      imageContainer.className = 'image-container'
      item[1].parts.forEach(part => {
        const image = document.createElement('img');
        image.id = part + i
        var partName = getCorrectPart(part, item[1].parts)
        image.setAttribute("src","bigimg/" + partName + "@8x.png")
        image.className = 'result-image'
        imageContainer.appendChild(image);
      });

      container.appendChild(imageContainer);
      container.appendChild(yomiElement);
      container.appendChild(imiElement);

      document.getElementById('result-container').appendChild(container);
    })
  } catch (err) {
    console.error("Error parsing JSON string:", err);

  }
}