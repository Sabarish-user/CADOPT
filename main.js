const { app, BrowserWindow, Menu, screen } = require('electron');
const path = require('path');

function createWindow() {
    const { bounds } = screen.getPrimaryDisplay();
    const { width, height } = bounds;

    // Base resolution (Full HD) reference
    const BASE_WIDTH = 1920;
    const BASE_HEIGHT = 1080;

    // Calculate dynamic zoom factor
    let zoomFactor = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
    zoomFactor = Math.max(zoomFactor, 0.3); // Prevents zoom from going too low

    // Set window size based on screen size
    let winWidth = Math.max(800, Math.floor(width * 0.80));  // 75% of screen width
    let winHeight = Math.max(600, Math.floor(height * 0.80)); // 75% of screen height

    const win = new BrowserWindow({
        width: winWidth,
        height: winHeight,
        icon: path.join(__dirname, 'resources', 'app', 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.maximize();
    // Load login page
    win.loadFile('default.htm');

    // Disable default menu
    Menu.setApplicationMenu(null);

    // Apply the calculated zoom factor
    win.webContents.on('did-finish-load', () => {
        win.webContents.setZoomFactor(zoomFactor);
    });

    // Handle keyboard zooming
    win.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.type === 'keyDown') {
            if (input.key === '+') { // Ctrl + +
                zoomFactor = Math.min(2.0, zoomFactor + 0.1);
            } else if (input.key === '-') { // Ctrl + -
                zoomFactor = Math.max(0.3, zoomFactor - 0.1);
            } else if (input.key === '0') { // Ctrl + 0 resets zoom
                zoomFactor = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
                zoomFactor = Math.max(zoomFactor, 1);
            }
            win.webContents.setZoomFactor(zoomFactor);
            event.preventDefault();
        }
    });

    // Handle mouse wheel zooming (Ctrl + scroll)
    win.webContents.on('wheel', (event) => {
        if (event.ctrlKey) {
            zoomFactor = event.deltaY < 0 
                ? Math.min(2.0, zoomFactor + 0.1)  // Zoom In
                : Math.max(0.3, zoomFactor - 0.1); // Zoom Out
            win.webContents.setZoomFactor(zoomFactor);
            event.preventDefault();
        }
    });

    return win;
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
