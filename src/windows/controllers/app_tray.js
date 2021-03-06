'use strict';

const path = require('path');
const { app, Menu, nativeImage, Tray, ipcMain } = require('electron');

const AppConfig = require('../../configuration');

const lan = AppConfig.readSettings('language');

const assetsPath = path.join(__dirname, '../../../assets');

let Common = require('../../common');

class App_tray {
    constructor(splashWindow, cashRegisterWindow) {
        this.splashWindow = splashWindow;
        this.cashRegisterWindow = cashRegisterWindow;
        this.lastUnreadStat = 0;
        const trayColor = AppConfig.readSettings('tray-color');
        if (trayColor === 'white' || trayColor === 'black') {
            this.trayColor = trayColor;
        } else {
            this.trayColor = 'white';
            AppConfig.saveSettings('tray-color', this.trayColor);
        }
        this.createTray();
    }

    createTray() {
        let image;
        if (process.platform === 'linux' || process.platform === 'win32') {
            image = nativeImage.createFromPath(path.join(assetsPath, `tray_${this.trayColor}.png`));
            this.trayIcon = image;
            this.trayIconUnread = nativeImage.createFromPath(path.join(assetsPath, `tray_unread_${this.trayColor}.png`));
        } else {
            image = nativeImage.createFromPath(path.join(assetsPath, 'status_bar.png'));
        }
        image.setTemplateImage(true);

        this.tray = new Tray(image);
        this.tray.setToolTip(Common.NAME);

        ipcMain.on('refreshIcon', () => this.refreshIcon());

        if (process.platform === 'linux' || process.platform === 'win32') {
            const contextMenu = Menu.buildFromTemplate([
                { label: 'Show', click: () => this.hideSplashAndShowCashRegister() },
                { label: 'Exit', click: () => app.exit(0) },
            ]);
            this.tray.setContextMenu(contextMenu);
        }
        this.tray.on('click', () => this.hideSplashAndShowCashRegister());
    }

    setTitle(title) {
        this.tray.setTitle(title);
    }

    hideSplashAndShowCashRegister() {
        if (this.splashWindow.isShown) return;
        this.cashRegisterWindow.show();
    }

    refreshIcon() {
        this.trayColor = AppConfig.readSettings('tray-color');
        this.trayIcon = nativeImage.createFromPath(path.join(assetsPath, `tray_${this.trayColor}.png`));
        this.trayIconUnread = nativeImage.createFromPath(path.join(assetsPath, `tray_unread_${this.trayColor}.png`));
        if (this.lastUnreadStat === 0) {
            this.tray.setImage(this.trayIcon);
        } else {
            this.tray.setImage(this.trayIconUnread);
        }
    }

    setUnreadStat(stat) {
        if (stat === this.lastUnreadStat) return;
        this.lastUnreadStat = stat;
        if (stat === 0) {
            this.tray.setImage(this.trayIcon);
        } else {
            this.tray.setImage(this.trayIconUnread);
        }
    }
}

module.exports = App_tray;