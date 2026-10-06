const {app, BrowserWindow} = require('electron'); //This line imports the app and BrowserWindow modules from the Electron library. The app module controls the application's lifecycle, while the BrowserWindow module is used to create and manage application windows.

//Is the app ready and initialized? Show the window when app is ready
app.whenReady().then(() => {
    const window = new BrowserWindow({
        frame: false, //This line creates a new instance of the BrowserWindow class and assigns it to the window variable. The frame option is set to false, which means that the window will not have a standard operating system frame (title bar, close button, etc.). This allows for a custom-designed window appearance.
        transparent: true,
        
    })
    window.loadFile('index.html')
})