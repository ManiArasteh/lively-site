import * as vscode from 'vscode';
import { exec } from 'child_process';
import { startServer, stopServer } from './server';

let statusBarItem: vscode.StatusBarItem;

function isWorkspaceOpened(): boolean {
  return vscode.workspace.workspaceFolders !== undefined && vscode.workspace.workspaceFolders.length > 0;
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "lively-site" is now active!');
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.command = 'extension.lively-site.runServer';
  updateStatusBar('Run Server');
  context.subscriptions.push(statusBarItem);
  const workspaceFolders = vscode.workspace.workspaceFolders!;

  const runSrvCommand = vscode.commands.registerCommand('extension.lively-site.runServer', () => {
    if (isWorkspaceOpened()) {
      startServer(workspaceFolders[0].uri.fsPath, () => {
        updateStatusBar('Stop Server');
        statusBarItem.command = 'extension.lively-site.stopServer';
        vscode.window.showInformationMessage("Server is running on http://localhost:9550");
        openInBrowser("http://localhost:9550")
        
      });
    } else {
      vscode.window.showErrorMessage('No workspace has been found. Open one from File -> Open Folder then try again');
    }
  });

  const stopSrvCommand = vscode.commands.registerCommand('extension.lively-site.stopServer', () => {
    stopServer(() => {
      updateStatusBar('Run Server');
      statusBarItem.command = 'extension.lively-site.runServer';
      vscode.window.showInformationMessage("Server stopped");
    });
  });

  context.subscriptions.push(runSrvCommand, stopSrvCommand);
}

export function deactivate() {
  
}

function openInBrowser(url: string): void {
  const platform = process.platform;
  let command: string;

  switch (platform) {
    case 'win32': // Windows
      command = `start ${url}`;
      break;
    case 'darwin': // macOS
      command = `open ${url}`;
      break;
    default: // Linux and other Unix-like systems
      command = `xdg-open ${url}`;
      break;
  }

  exec(command, (error) => {
    if (error) {
      vscode.window.showErrorMessage(`Failed to open browser: ${error.message}`);
    }
  });
}

function updateStatusBar(text: string) {
  statusBarItem.text = text;
  statusBarItem.show();
}
