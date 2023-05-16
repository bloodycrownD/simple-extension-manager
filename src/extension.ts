import { commands, ExtensionContext,window } from 'vscode';
import { ExtensionManagerPanel } from './panels/ExtensionManagerPanel';
import { dirname } from 'path';

export function activate(context: ExtensionContext) {
	const rootPath = dirname(context.extensionPath);
	const command = commands.registerCommand("simple-extension-manager.managerExtensionPack", async () => {
		ExtensionManagerPanel.render(context.extensionUri,"C:\\Users\\戴明旺\\.vscode\\extensions");		
	});
	 
	context.subscriptions.push(command);
}




export function deactivate() { }
