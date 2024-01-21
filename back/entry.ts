import { commands, ExtensionContext } from "vscode";
import { Panel } from "./panels";
export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showHelloWorldCommand = commands.registerCommand("hello-world.showHelloWorld", () => {
    Panel.render(context.extensionUri);
  });
  // Add command to the extension context
  context.subscriptions.push(showHelloWorldCommand);
  
  //查询自定义扩展
  context.subscriptions.push(
		commands.registerCommand("simple-extension-manager.view", async () => {
			commands.executeCommand(
				"workbench.extensions.search",
				'@installed @category:"Custom Extension"'
			);
		})
	);
}