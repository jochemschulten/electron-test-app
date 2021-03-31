'use strict';

const path = require('path');
//const isXfce = require('is-xfce');
const { app, shell, BrowserWindow } = require('electron');
const electronLocalShortcut = require('electron-localshortcut');

const AppConfig = require('../../configuration');

// const CSSInjector = require('../../inject/css');
// const MessageHandler = require('../../handlers/message');
const UpdateHandler = require('../../handlers/update');

const lan = AppConfig.readSettings('language');

let Common = require('../../common');

class CashRegisterWindow {

    constructor() {
        this.isShown = false;
        this.loginState = { NULL: -2, WAITING: -1, YES: 1, NO: 0 };
        this.loginState.current = this.loginState.NULL;
        this.inervals = {};
        this.createWindow();
        this.initCashRegisterWindowShortcut();
        this.initWindowEvents();
        this.initWindowWebContent();
    }

    resizeWindow(isLogged, splashWindow) {
        const size = Common.WINDOW_SIZE;

        this.cashRegisterWindow.setResizable(isLogged);
        this.cashRegisterWindow.setSize(size.width, size.height);
        if (this.loginState.current === 1 - isLogged || this.loginState.current === this.loginState.WAITING) {
            splashWindow.hide();
            this.show();
            this.cashRegisterWindow.center();
            this.loginState.current = isLogged;
        }
    }

    createWindow() {
        this.cashRegisterWindow = new BrowserWindow({
            title: Common.NAME,
            resizable: true,
            center: true,
            show: false,
            frame: true,
            autoHideMenuBar: true,
            icon: path.join(__dirname, '../../../assets/icon.png'),
            titleBarStyle: 'hidden-inset',
            webPreferences: {
                javascript: true,
                plugins: true,
                nodeIntegration: false,
                webSecurity: false,
                preload: path.join(__dirname, '../../preload.js'),
            },
        });

        /* menu is always visible on xfce session */
        // isXfce().then(data => {
        //     if(data) {
        //         this.cashRegisterWindow.setMenuBarVisibility(true);
        //         this.cashRegisterWindow.setAutoHideMenuBar(false);
        //     }
        // });
    }

    loadURL(url) {
        this.cashRegisterWindow.loadURL(url);
    }

    show() {
        this.cashRegisterWindow.show();
        this.cashRegisterWindow.focus();
        //this.cashRegisterWindow.webContents.send('show-wechat-window');
        this.isShown = true;
    }

    hide() {
        this.cashRegisterWindow.hide();
        //this.cashRegisterWindow.webContents.send('hide-wechat-window');
        this.isShown = false;
    }

    connectShop() {
        Object.keys(this.inervals).forEach((key, index) => {
            clearInterval(key);
            delete this.inervals[key];
        });

        console.log('Connect.');
        this.loadURL(Common.SHOP_URL);
        const int = setInterval(() => {
            if (this.loginState.current === this.loginState.NULL) {
                this.loadURL(Common.SHOP_URL);
                console.log('Reconnect.');
            }
        }, 5000);
        this.inervals[int] = true;
    }

    initWindowWebContent() {
        this.cashRegisterWindow.webContents.setUserAgent(Common.USER_AGENT[process.platform]);
        if (Common.DEBUG_MODE) {
            this.cashRegisterWindow.webContents.openDevTools();
        }

        this.connectShop();


        this.cashRegisterWindow.webContents.on('dom-ready', () => {
            // this.cashRegisterWindow.webContents.insertCSS(CSSInjector.commonCSS);
            // if (process.platform === 'darwin') {
            //     this.cashRegisterWindow.webContents.insertCSS(CSSInjector.osxCSS);
            // }

            if (!UpdateHandler.CHECKED) {
                new UpdateHandler().checkForUpdate(`v${app.getVersion()}`, true);
            }
        });


        // this.cashRegisterWindow.webContents.on('will-navigate', (ev, url) => {
        //     if (/(.*wx.*\.qq\.com.*)|(web.*\.wechat\.com.*)/.test(url)) return;
        //     ev.preventDefault();
        // });

        // this.cashRegisterWindow.webContents.on('dom-ready', () => {
        //     this.cashRegisterWindow.webContents.insertCSS(CSSInjector.commonCSS);
        //     if (process.platform === 'darwin') {
        //         this.cashRegisterWindow.webContents.insertCSS(CSSInjector.osxCSS);
        //     }
        //
        //     if (!UpdateHandler.CHECKED) {
        //         new UpdateHandler().checkForUpdate(`v${app.getVersion()}`, true);
        //     }
        // });

        // this.cashRegisterWindow.webContents.on('new-window', (event, url) => {
        //     event.preventDefault();
        //     shell.openExternal(new MessageHandler().handleRedirectMessage(url));
        // });

        // this.cashRegisterWindow.webContents.on('will-navigate', (event, url) => {
        //     if (url.endsWith('/fake')) event.preventDefault();
        // });
    }

    initWindowEvents() {
        this.cashRegisterWindow.on('close', (e) => {
            if (this.cashRegisterWindow.isVisible()) {
                e.preventDefault();
                this.hide();
            }
            this.unregisterLocalShortCut();
        });

        this.cashRegisterWindow.on('page-title-updated', (ev) => {
            if (this.loginState.current === this.loginState.NULL) {
                this.loginState.current = this.loginState.WAITING;
            }
            ev.preventDefault();
        });

        this.cashRegisterWindow.on('show', () => {
            this.registerLocalShortcut();
        });
    }

    registerLocalShortcut() {
        electronLocalShortcut.register(this.cashRegisterWindow, 'CommandOrControl+H', () => {
            this.cashRegisterWindow.hide();
        });
    }

    unregisterLocalShortCut() {
        electronLocalShortcut.unregisterAll(this.cashRegisterWindow);
    }

    initCashRegisterWindowShortcut() {
        this.registerLocalShortcut();
    }
}

module.exports = CashRegisterWindow;