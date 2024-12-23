function id(id) {
  // 指定したidのやつをとってくる関数
  return document.getElementById(id);
}
function onoff(element) {
  // elementをdisplay:noneにするかdisplay:blockにする関数
  if (element.style.display == "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}

(function() {
  // EventListenerを追加する関数 (一応見やすくなる? さあ?)
  id("img1").addEventListener("click", function () {
    onoff(id("image1"));
  });
  id("img2").addEventListener("click", function () {
    onoff(id("image2"));
  });
  id("img3").addEventListener("click", function () {
    onoff(id("image3"));
  });
  id("img4").addEventListener("click", function () {
    onoff(id("image4"));
  });
}());