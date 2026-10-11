const {app, BrowserWindow, ipcMain, screen, desktopCapturer, Tray, Menu, nativeImage} = require('electron'); //This line imports the app and BrowserWindow modules from the Electron library. The app module controls the application's lifecycle, while the BrowserWindow module is used to create and manage application windows.
const path = require("node:path");
const fs  = require("node:fs");
const { shell } = require('electron/common');

let window;
let tray;

function createWindow() {
    window = new BrowserWindow({
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
        frame: false,
        transparent: true,
        show: false
    })
    window.loadFile('index.html');
    window.on('closed', () => {
        window = null;
    })
}

function toggleWindow() {
    if (!window) {
        createWindow();
    }

    if (window.isVisible()) {
        window.hide();
    } else {
        window.show();
        window.focus();
    }
}

app.whenReady().then(() => {
    createWindow();

    const trayImage = nativeImage.createFromPath(path.join(__dirname, 'assets/tray.png'));
    if (trayImage.isEmpty()) {
        throw new Error('Unable to load tray icon from assets/tray.png');
    }
    if (process.platform === 'darwin') {
        trayImage.setTemplateImage(true);
    }

    tray = new Tray(trayImage);
    tray.setToolTip('Electron Learning Demo');
    tray.setContextMenu(Menu.buildFromTemplate([
        { label: 'Show / Hide Window', click: toggleWindow },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() }
    ]));
    tray.on('click', toggleWindow);

    app.on('activate', () => {
        if (!window) {
            createWindow();
        }
        window.show();
        window.focus();
    });

    ipcMain.on("capture-screen", async() => {
        const screenSize = screen.getPrimaryDisplay().workAreaSize;
        const screens = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: {
                width: screenSize.width,
                height: screenSize.height
            }
        })
        const img = screens[0].thumbnail.toPNG();
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const fileName = `screenshot-${timestamp}.png`;
        const filePath = path.join(__dirname, fileName);

        fs.writeFile(filePath, img, (err) => {
            shell.openExternal(`file://${filePath}`)
        })
    })
});