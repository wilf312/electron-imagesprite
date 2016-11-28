
var holder = document.getElementById('holder');

/** hoverエリアにドラッグされた場合 */
holder.ondragover = function () { return false; };

/** hoverエリアから外れた or ドラッグが終了した */
holder.ondragleave = holder.ondragend = function () { return false; };

/** hoverエリアにドロップされた */
holder.ondrop = function (e) {
    e.preventDefault(); // イベントの伝搬を止めて、アプリケーションのHTMLとファイルが差し替わらないようにする

    // ------ 取得したファイルのリストを生成 と jpg, png 以外のファイルを除外
    var fileList = Array.prototype.map.call(e.dataTransfer.files, function (file) {
      return {
        path: file.path,
        type: file.type,
        size: file.size,
        name: file.name,
      };
    })
    .filter(function(element, index, array) {
      return (element.type === 'image/jpeg' ||
              element.type === 'image/png');
    });

    if (fileList.length === 0) {
      return;
    }

    // 画面上にリスト反映
    app.list = fileList;

    // ------ 画像生成
    const Spritesmith = require('spritesmith');
    const fs = require('fs');

    // // Create a new spritesmith and process our images
    var sprites = Array.prototype.map.call(fileList, function (file) {
      return file.path;
    });

    var firstData = fileList[0]
    var output = firstData.path.replace(firstData.name, '');
    var outputPathPNG = output+ 'sprite.png';
    var outputPathCSS = output+ 'sprite.css';
    console.log('outputPathPNG -> ', outputPathPNG);

    // ------ 画像とCSSの生成
    Spritesmith.run({
      src: sprites,
      algorithm: 'alt-diagonal' // NOTE: ここはコンフィグに持たせてもいいかも
    }, function handleResult (err, result) {
      if (err) {
        throw err;
      }

      // 画像生成
      fs.writeFileSync(outputPathPNG, result.image);



      // CSS生成処理
      console.log('result.coordinates -> ', result.coordinates);
      console.log('result.properties -> ', result.properties);

      // 配列の生成（オブジェクトで返ってきてるので）v
      var coordinates = result.coordinates;
      var properties = result.properties;
      var imageList = [];
      var simple = {};

      var path = require('path');
      console.log(path);

      for (prop in coordinates) {
        simple = {};
        if ({}.hasOwnProperty.call(coordinates, prop)) {
          console.log(coordinates[prop]);
          simple = coordinates[prop];
          simple['path'] = prop;
          simple['name'] = path.basename(prop).replace(path.extname(prop), '');
          imageList.push(simple);
        }
      }

      console.log(imageList);
      var loopCSS = '';
      var imageData = null;


      for (var cnt=0; cnt<imageList.length; cnt++) {
        imageData = imageList[cnt];
// .${name} ${#if isBtnHover}, .${nameHoverClass}:hover ${/if} {
// .${name} ${#if isBtnHover}, .${nameHoverClass}:hover ${/if} {

        loopCSS = loopCSS + `
/* ------ ${imageData.name}*/
.${imageData.name} {
    background-position: ${imageData.x * 0.5}px ${imageData.y * 0.5}px;
    width: ${imageData.width * 0.5}px;
    height: ${imageData.height * 0.5}px;
    background-size: ${properties.width * 0.5}px ${properties.height * 0.5}px;
}
@media only screen and (min-width:1024px){
    .${imageData.name} {
        background-position: ${imageData.x}px ${imageData.y}px;
        width: ${imageData.width}px;
        height: ${imageData.height}px;
        background-size: ${properties.width}px ${properties.width}px;
    }
}
      `;
      }
      console.log(loopCSS);

      // ファイルの書き出し
      fs.writeFile(outputPathCSS, loopCSS, (err) => {
        if (err) throw err;
        console.log("成功！");
      });

    });

    return false;
};


// エリア外のドラッグドロップ
// イベントの伝播を止めて画面が切り替わらないように調整
document.ondragover = document.ondrop = function(e) {
    e.preventDefault();
    return false;
};




// リスト表示用のVue
var Vue = require('vue/dist/vue.js');
var app = new Vue({
  el: '#vue-app',
  data: {
    dataTitle: '読み込まれたデータ',
    list: [
      // {name: 'aaa'},
      // {name: 'aaa'},
      // {name: 'aaa'},
      // {name: 'aaa'},
      // {name: 'aaa'},
    ]
  }
});




