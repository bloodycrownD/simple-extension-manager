import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getUri, getNonce, IS_DEVELOPMENT_MODE } from "../utils";
import { controller, Msg } from "./controller";


export class ExtensionManagerPanel {
    public static extensionRootPath: string;
    public static currentPanel: ExtensionManagerPanel | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];

    constructor(panel: WebviewPanel, extensionUri: Uri, rootPath: string) {
        ExtensionManagerPanel.extensionRootPath = rootPath;
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
        this._setWebviewMessageListener(this._panel.webview);
    }

    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    public static render(extensionUri: Uri, rootPath: string) {
        if (ExtensionManagerPanel.currentPanel) {
            ExtensionManagerPanel.currentPanel._panel.reveal(ViewColumn.One);
        } else {
            const panel = window.createWebviewPanel(
                "Simple Extension Manager",
                "Simplify extension pack management",
                ViewColumn.One,
                { enableScripts: true, retainContextWhenHidden: true }
            );
            ExtensionManagerPanel.currentPanel = new ExtensionManagerPanel(panel, extensionUri, rootPath);
        }
    }

    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    public dispose() {
        ExtensionManagerPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    /**
     * Defines and returns the HTML that should be rendered within the webview panel.
     *
     * @remarks This is also the place where references to the Vue webview build files
     * are created and inserted into the webview HTML.
     *
     * @param webview A reference to the extension webview
     * @param extensionUri The URI of the directory containing the extension
     * @returns A template string literal containing the HTML that should be
     * rendered within the webview panel
     */
    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
        let stylesUri: Uri;
        let scriptUri: Uri;
        let codiconsUri: Uri;

        // path in development
        if (IS_DEVELOPMENT_MODE) {
            stylesUri = getUri(webview, extensionUri, ["web-view", "build", "assets", "index.css"]);
            scriptUri = getUri(webview, extensionUri, ["web-view", "build", "assets", "index.js"]);
            codiconsUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css'));
        }
        else {
            // path in production
            stylesUri = getUri(webview, extensionUri, ["out", "build", "assets", "index.css"]);
            scriptUri = getUri(webview, extensionUri, ["out", "build", "assets", "index.js"]);
            codiconsUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'out', 'build', 'codicon', 'codicon.css'));
        }

        const nonce = getNonce();

        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <link href="${codiconsUri}" rel="stylesheet" />
          <title>Hello World</title>
        </head>
        <body>
          <div id="app"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
    }

    /**
     * Sets up an event listener to listen for messages passed from the webview context and
     * executes code based on the message that is received.
     *
     * @param webview A reference to the extension webview
     * @param context A reference to the extension context
     */
    private _setWebviewMessageListener(webview: Webview) {
        webview.onDidReceiveMessage(
            (message: Msg) => controller(message, webview)
            ,
            undefined,
            this._disposables
        );
    }
}