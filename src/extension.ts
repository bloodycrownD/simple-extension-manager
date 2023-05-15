import { commands, ExtensionContext,Uri } from 'vscode';
import Extension from './utils/extension';
import { ExtensionPackage, getUri } from './utils';
import { ExtensionManagerPanel } from './panels/ExtensionManagerPanel';
import { log } from 'console';


export function activate(context: ExtensionContext) {
	let disposable = commands.registerCommand('simple-extension-manager.helloWorld', () => {

		// new Extension(new ExtensionPackage("tttt")).createExtension("C:\\Users\\戴明旺\\.vscode\\extensions");
		// Extension.deleteExtension("C:\\Users\\戴明旺\\.vscode\\extensions",new ExtensionPackage("tttt"));

	});

	context.subscriptions.push(disposable);

	const showHelloWorldCommand = commands.registerCommand("simple-extension-manager.managerExtensionPack", () => {
		ExtensionManagerPanel.render(context.extensionUri);
	});

	// Add command to the extension context
	context.subscriptions.push(showHelloWorldCommand);
}



export function deactivate() { }
