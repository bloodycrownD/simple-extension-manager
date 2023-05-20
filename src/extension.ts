import { commands, ExtensionContext } from 'vscode';
import { ExtensionManagerPanel } from './panels/ExtensionManagerPanel';
import { dirname } from 'path';

export function activate(context: ExtensionContext) {
	const rootPath = dirname(context.extensionPath);
	context.subscriptions.push(
		commands.registerCommand("simple-extension-manager.manage.ExtensionPack", async () => {
			ExtensionManagerPanel.render(context.extensionUri, rootPath);
		})
	);


	context.subscriptions.push(
		commands.registerCommand("simple-extension-manager.view.ExtensionPack", async () => {
			commands.executeCommand(
				"workbench.extensions.search",
				'@installed @category:"Custom Extension"'
			);
		})
	);
}




export function deactivate() { }
