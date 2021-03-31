'use strict';

const path = require('path');
const { BrowserWindow } = require('electron');

const AppConfig = require('../../configuration');

const lan = AppConfig.readSettings('language');

let Common = require('../../common');

class SplashWindow {
    constructor() {
        this.splashWindow = new BrowserWindow({
            width: Common.WINDOW_SIZE.width,
            height: Common.WINDOW_SIZE.height,
            title: Common.NAME,
            resizable: false,
            center: true,
            show: true,
            frame: false,
            autoHideMenuBar: true,
            alwaysOnTop: true,
            icon: 'assets/icon.png',
            titleBarStyle: 'hidden',
        });

        this.splashWindow.loadURL(`file://${path.join(__dirname, '/../views/splash.html')}`);
        this.isShown = false;
    }

    show() {
        this.splashWindow.show();
        this.isShown = true;
    }

    hide() {
        this.splashWindow.hide();
        this.isShown = false;
    }
}

module.exports = SplashWindow;