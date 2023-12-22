import { commands, ExtensionContext, window ,Uri, ProgressLocation} from 'vscode';
import { ExtensionManagerPanel } from './panels/ExtensionManagerPanel';
import { dirname, resolve } from 'path';
import {  IS_DEVELOPMENT_MODE, State } from './utils';

export function activate(context: ExtensionContext) {
	let rootPath = dirname(context.extensionPath);
	if(IS_DEVELOPMENT_MODE){
		rootPath = process.env.USERPROFILE + "\\.vscode\\extensions";
	}
	context.subscriptions.push(
		commands.registerCommand("simple-extension-manager.manage", async () => {
			ExtensionManagerPanel.currentPanel?.dispose();
			State.rootPath = rootPath;
			State.context = context;
			ExtensionManagerPanel.render(context.extensionUri);
		})
	);
	
	context.subscriptions.push(
		commands.registerCommand("simple-extension-manager.view", async () => {
			commands.executeCommand(
				"workbench.extensions.search",
				'@installed @category:"Custom Extension"'
			);
		})
	);
	context.subscriptions.push(
		commands.registerCommand("simple-extension-manager.edit", async (extensionId: string) => {
			ExtensionManagerPanel.currentPanel?.dispose();
			State.rootPath = rootPath;
			State.context = context;
			ExtensionManagerPanel.render(context.extensionUri,extensionId);
		})
	);
}




export function deactivate() { }
