var oChangeTable = {
  elem: "image10",
  image4: "o3",
  image5: "o1",
  image6: "o2",
  default: "o1",
};
var zChangeTable = {
  elem: "image11",
  image4: "z3",
  image5: "z1",
  image6: "z2",
  default: "z1",
};
var lChangeTable = {
  elem: "image12",
  image1: "l2",
  default: "l",
};

function id(id) {
  // 指定したidのやつをとってくる関数
  return document.getElementById(id);
}
function onoff(
  element,
  colorElement,
  doCheck = false,
  checkElements,
  checkColorElements,
  colorBlock = "#CCCCDD",
  colorNone = "#EEEEFF",
) {
  // elementをdisplay:noneにするかdisplay:blockにする関数
  if (doCheck == true) {
    // 選択式
    for (let i = 0; i < checkElements.length; i++) {
      if (checkElements[i].style.display == "block") {
        checkElements[i].style.display = "none";
        checkColorElements[i].style.backgroundColor = colorNone;
      }
    }
  }

  if (element.style.display == "block") {
    element.style.display = "none";
    colorElement.style.backgroundColor = colorNone;
  } else {
    element.style.display = "block";
    colorElement.style.backgroundColor = colorBlock;
  }

  ifChange();
}
function isBlock(element) {
  return element.style.display == "block";
}
function changeImage(changeTable) {
  var imgs = Object.keys(changeTable);
  var changeImg = id(changeTable[imgs[0]]);

  for (var i = 1; i < imgs.length - 1; i++) {
    if (isBlock(id(imgs[i]))) {
      changeImg.src = `bigimg/${changeTable[imgs[i]]}@8x.png`;
      return `bigimg/${changeTable[imgs[i]]}@8x.png`;
    }
  }

  changeImg.src = `bigimg/${changeTable[imgs[imgs.length - 1]]}@8x.png`;
}
function ifChange() {
  changeImage(oChangeTable);
  changeImage(zChangeTable);
  changeImage(lChangeTable);
}
function dialog(message) {
  // ダイアログを表示させる関数
  id("dialog-cover").style.display = "flex";
  id("message").textContent = message;
}

// EventListenerを追加する関数
(function () {
  id("dialog-btn").addEventListener("click", function () {
    id("dialog-cover").style.display = "none";
  });
  id("btn1").addEventListener("click", function () {
    onoff(
      id("image1"),
      id("btn1"),
      true,
      [id("image2"), id("image3")],
      [id("btn2"), id("btn3")],
    );
  });
  id("btn2").addEventListener("click", function () {
    onoff(
      id("image2"),
      id("btn2"),
      true,
      [id("image1"), id("image3")],
      [id("btn1"), id("btn3")],
    );
  });
  id("btn3").addEventListener("click", function () {
    onoff(
      id("image3"),
      id("btn3"),
      true,
      [id("image1"), id("image2")],
      [id("btn1"), id("btn2")],
    );
  });
  id("btn4").addEventListener("click", function () {
    onoff(
      id("image4"),
      id("btn4"),
      true,
      [id("image5"), id("image6")],
      [id("btn5"), id("btn6")],
    );
  });
  id("btn5").addEventListener("click", function () {
    onoff(
      id("image5"),
      id("btn5"),
      true,
      [id("image4"), id("image6")],
      [id("btn4"), id("btn6")],
    );
  });
  id("btn6").addEventListener("click", function () {
    onoff(
      id("image6"),
      id("btn6"),
      true,
      [id("image4"), id("image5")],
      [id("btn4"), id("btn5")],
    );
  });
  id("btn7").addEventListener("click", function () {
    onoff(id("image7"), id("btn7"));
  });
  id("btn8").addEventListener("click", function () {
    onoff(id("image8"), id("btn8"));
  });
  id("btn9").addEventListener("click", function () {
    onoff(id("image9"), id("btn9"));
  });
  id("btn10").addEventListener("click", function () {
    onoff(id("image10"), id("btn10"));
  });
  id("btn11").addEventListener("click", function () {
    onoff(id("image11"), id("btn11"));
  });
  id("btn12").addEventListener("click", function () {
    onoff(id("image12"), id("btn12"));
  });
})();

function adjustElementSize() {
  const element = document.querySelector(".box");
  element.style.width = `min(256px, 90vw);`;
  element.style.height = `min(256px, 90vw);`;
  if (document.body.clientWidth < 256) {
    dialog(
      "画面幅が小さいので、\n正しく表示できないかも。\n 256pxはあるといいかな。",
    );
  }
}
window.addEventListener("resize", adjustElementSize);
adjustElementSize();
