import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { Request } from "../share";
import { dispatcher } from "./controller";
export default class Panel {
    public static currentPanel: Panel | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];
    /**
     * The HelloWorldPanel class private constructor (called only from the render method).
     *
     * @param panel A reference to the webview panel
     * @param extensionUri The URI of the directory containing the extension
     */
    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this._panel = panel;

        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(extensionUri, this._panel.webview);

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview);
    }

    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    public static render(extensionUri: Uri) {
        if (Panel.currentPanel) {
            // If the webview panel already exists reveal it
            Panel.currentPanel._panel.reveal(ViewColumn.One);
        } else {
            // If a webview panel does not already exist create and show a new one
            const panel = window.createWebviewPanel(
                // Panel view type
                "Simple Extension Manager",
                // Panel title
                "Simple Extension Manager",
                // The editor column the panel should be displayed in
                ViewColumn.One,
                // Extra panel configurations
                {
                    // Enable JavaScript in the webview
                    enableScripts: true,
                    // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
                    localResourceRoots: [Uri.joinPath(extensionUri, "assets"), Uri.joinPath(extensionUri, "out")],
                }
            );

            Panel.currentPanel = new Panel(panel, extensionUri);

        }
    }

    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    public dispose() {
        Panel.currentPanel = undefined;

        // Dispose of the current webview panel
        this._panel.dispose();

        // Dispose of all disposables (i.e. commands) for the current webview panel
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
    private _getWebviewContent(extensionUri: Uri, webview: Webview) {
        //webview特殊，必须用webview.asWebviewUri再转一遍
        let stylesUri = webview.asWebviewUri(Uri.joinPath(extensionUri, "/out/front/index.css")).toString();
        let scriptUri = webview.asWebviewUri(Uri.joinPath(extensionUri, "/out/front/index.js")).toString();
        //设置标签icon，icon的path不需要是webviewUri
        this._panel.iconPath = Uri.joinPath(extensionUri, "assets", "logo.png");
        if (!process.env.MODE_PROD) {
            stylesUri = "http://127.0.0.1:5173/@vite/client";
            scriptUri = "http://127.0.0.1:5173/src/main.ts";
        }
        const nonce = Date.now().toString();

        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Simple Extension Manager</title>
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
     * executes code based on the message that is recieved.
     *
     * @param webview A reference to the extension webview
     * @param context A reference to the extension context
     */
    private _setWebviewMessageListener(webview: Webview) {
        //生成分发器
        const dispatch = dispatcher(webview);
        webview.onDidReceiveMessage(
            (message: Request) => {
                //分发消息给controller
                dispatch(message);
            },
            undefined,
            this._disposables
        );
    }
}

