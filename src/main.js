
'use strict';

const path = require('path');
const {app, ipcMain} = require('electron');


const UpdateHandler = require('./handlers/update');
const Common = require('./common');
const AppConfig = require('./configuration');

const AppTray = require('./windows/controllers/app_tray');
const SplashWindow = require('./windows/controllers/splash');
const SettingsWindow = require('./windows/controllers/settings')
const CashRegisterWindow = require('./windows/controllers/cashregister');


class BooqCashregister {

    constructor() {
        this.splashWindow = null;
        this.settingsWindow = null;
        this.cashRegisterWindow = null;
    }

    init() {

        // Check if settings are known

        // If yes - show shop

        // If not - show settings

        if(this.checkInstance()) {
            this.initApp();
            this.initIPC();
        } else {
            console.log('quit');
            app.quit();
        }

    }

    checkInstance() {
        return true;
        //
        // if (AppConfig.readSettings('multi-instance') === 'on') return true;
        //
        // app.requestSingleInstanceLock()
        // return !app.on('second-instance', (commandLine, workingDirectory) => {
        //     if(this.splashWindow && this.splashWindow.isShown){
        //         this.splashWindow.show();
        //         return
        //     }
        //     if(this.cashRegisterWindow){
        //         this.cashRegisterWindow.show();
        //     }
        //     if(this.settingsWindow && this.settingsWindow.isShown){
        //         this.settingsWindow.show();
        //     }
        // });

    }

    initApp() {
        app.on('ready', ()=> {
            this.createSplashWindow();
            this.createCashRegisterWindow();
            this.createTray();


            if (!AppConfig.readSettings('language')) {
                AppConfig.saveSettings('language', 'en');
                AppConfig.saveSettings('prevent-recall', 'on');
                AppConfig.saveSettings('icon', 'black');
                AppConfig.saveSettings('multi-instance','on');
            }

            if(this.splashWindow.isShown == 1) {
                setTimeout(function() {

                }, 500);
                this.splashWindow.hide()
            }

        });

        app.on('activate', () => {
            if (this.cashRegisterWindow == null) {
                this.createCashRegisterWindow();
            } else {
                this.cashRegisterWindow.show();
            }
        });
    }


    initIPC() {

        ipcMain.on('badge-changed', (event, num) => {
            if (process.platform == "darwin") {
                app.dock.setBadge(num);
                if (num) {
                    this.tray.setTitle(` ${num}`);
                } else {
                    this.tray.setTitle('');
                }
            } else if (process.platform === "linux" || process.platform === "win32") {
                app.setBadgeCount(num * 1);
                this.tray.setUnreadStat((num * 1 > 0) ? 1 : 0);
            }
        });

        ipcMain.on('update', (event, message) => {
            let updateHandler = new UpdateHandler();
            updateHandler.checkForUpdate(`v${app.getVersion()}`, false);
        });

    }

    createTray() {
        this.tray = new AppTray(this.splashWindow, this.cashRegisterWindow);
    }

    createSplashWindow() {
        this.splashWindow = new SplashWindow();
        this.splashWindow.show();
    }

    createCashRegisterWindow() {
        this.cashRegisterWindow = new CashRegisterWindow();
        this.cashRegisterWindow.show();
    }

    createSettingsWindow() {
        this.settingsWindow = new SettingsWindow();
    }

}

new BooqCashregister().init();