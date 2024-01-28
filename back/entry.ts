import { commands, ExtensionContext, window } from "vscode";
import Panel from "./application";
import { dirname } from "path";
import { Global } from "./util";
import { extensionService } from "./service";
export function activate(context: ExtensionContext) {
  Global.RootPath = dirname(context.extensionPath);
  Global.Context = context;
  if (!process.env.MODE_PROD) {
    Global.RootPath = process.env.USERPROFILE + "\\.vscode\\extensions";
  };
  ( async function test() {
    extensionService.exportCustomedExtensions();
  })();
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