'use strict';

const electron = require('electron'); // electronモジュールを読み込む
const app = electron.app; // ネイティブブラウザの生成
const BrowserWindow = electron.BrowserWindow;

// ------ その他ライブラリ
const storage = require('electron-json-storage');



// window のグローバル参照を保持します
// あなたが何もしない場合、 JSのGCによって自動的に消されます。
let mainWindow;


const CONFIG = {
    WIDTH: 1136,
    HEIGHT: 600,
    INIT_URL: 'file://' + __dirname + '/index.html'
}

// var $ = require('nodobjc');// COCOA API を呼ぶ用のライブラリ
// $.import('Foundation');
// $.import('Cocoa');


function createWindow () {

    // 指定したサイズでChromiumの起動
    mainWindow = new BrowserWindow({width: CONFIG.WIDTH, height: CONFIG.HEIGHT});

    // ファイルパスからローカルHTMLファイルを読み込み
    // 'file://' + __dirname : 現在のディレクトリからの相対参照
    console.log(CONFIG.INIT_URL);
    // mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.loadURL(CONFIG.INIT_URL);

    // DevToolsの起動
    mainWindow.webContents.openDevTools();


    // ChromiumのWindow自体のイベントセット
    // （内部に表示されているHTMLのイベントとはまた別）
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

