import path from 'path';
import * as vscode from 'vscode';
import fs from 'fs';
import express from 'express';
import http from 'http';

let server: http.Server | undefined;

export const startServer = (currentDir: string, callback: () => void): void => {
    const app = express();
    const PORT = process.env.PORT || 9550;
  
    // Serve static files from the current directory
    app.use(express.static(currentDir));
  
    // Serve index.html on the root route
    app.get('/', (req, res) => {
      const indexPath = path.join(currentDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('index.html not found');
      }
    });
  
    // Start the express server
    server = app.listen(PORT, () => {
      const url = `http://localhost:${PORT}`;
      vscode.window.showInformationMessage(`Server is running on ${url}`);
      callback();
    });
};
  
  // Function to stop the server
export const stopServer = (callback: () => void): void => {
    if (server) {
      server.close(() => {
        console.log('Server stopped');
        callback();
      });
    } else {
      console.log('Server is not running');
      callback();
    }
};
