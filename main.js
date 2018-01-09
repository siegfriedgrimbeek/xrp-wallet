const {app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

const RippleAPI = require("ripple-lib").RippleAPI
const Request = require("request")

const api = new RippleAPI({server: 'wss://s1.ripple.com:443'})
const address = 'rhTUikgmZfbWBRD6zANQ1sABKXDCfm7sJk'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: true,
      minWidth:800,
      minHeight:600
    })

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

exports.address = address;

exports.getRippleWalletValue = () => {
    return new Promise((resolve, reject) => {
        api.connect().then(() => {
            api.getBalances(address).then(balances => {
                resolve(balances);
            }, error => {
                reject(error);
            });
        }, error => {
            reject(error);
        });
    });
}

exports.getRippleMarketValue = function() {
    return new Promise((resolve, reject) => {
        Request.get("https://api.coinmarketcap.com/v1/ticker/ripple/", (error, response, body) => {
            if(error) {
                reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
}
