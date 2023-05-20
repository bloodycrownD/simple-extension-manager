import type { WebviewApi } from "vscode-webview";



export class callBackArray {
  private static callBacks: Map<string, Function> = new Map();

  public static setCallBack(index: string, cb: Function) {
    this.callBacks.set(index, cb);
  }

  public static getCallBack(index: string, data?: string): any {
    const cb = this.callBacks.get(index);
    this.callBacks.delete(index);
    return <Function>cb!(data);
  }

}

export class DataShape {
  public result: object;
  public err: boolean;
  constructor(result: object) {
    this.result = result;
    this.err = false;
  }

}

export class Msg {
  public cmd: Cmd;
  public data?: string;
  public callBacKId: string | undefined;

  constructor(cmd: Cmd, data?: string) {
    this.cmd = cmd;
    this.data = data;
  }
}

export enum Cmd {
  deleteExtension,
  getExtensions,
  showErrMSg

}

class VSCodeAPIWrapper {
  private readonly vsCodeApi: WebviewApi<unknown> | undefined;

  constructor() {
    if (typeof acquireVsCodeApi === "function") {
      this.vsCodeApi = acquireVsCodeApi();
    }
  }

  /**
   * Post a message (i.e. send arbitrary data) to the owner of the webview.
   *
   * @remarks When running webview code inside a web browser, postMessage will instead
   * log the given message to the console.
   *
   * @param message Abitrary data (must be JSON serializable) to send to the extension context.
   */
  public postMessage(message: Msg, callBack?: Function) {

    if (this.vsCodeApi) {
      if (callBack) {
        const randomID = Date.now().toString();
        message.callBacKId = randomID;
        callBackArray.setCallBack(randomID, callBack);
      }
      this.vsCodeApi.postMessage(message);
    } else {
      console.log(message);
    }
  }


  /**
   * Get the persistent state stored for this webview.
   *
   * @remarks When running webview source code inside a web browser, getState will retrieve state
   * from local storage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
   *
   * @return The current state or `undefined` if no state has been set.
   */
  public getState(): unknown | undefined {
    if (this.vsCodeApi) {
      return this.vsCodeApi.getState();
    } else {
      const state = localStorage.getItem("vscodeState");
      return state ? JSON.parse(state) : undefined;
    }
  }

  /**
   * Set the persistent state stored for this webview.
   *
   * @remarks When running webview source code inside a web browser, setState will set the given
   * state using local storage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
   *
   * @param newState New persisted state. This must be a JSON serializable object. Can be retrieved
   * using {@link getState}.
   *
   * @return The new state.
   */
  public setState<T extends unknown | undefined>(newState: T): T {
    if (this.vsCodeApi) {
      return this.vsCodeApi.setState(newState);
    } else {
      localStorage.setItem("vscodeState", JSON.stringify(newState));
      return newState;
    }
  }
}

// Exports class singleton to prevent multiple invocations of acquireVsCodeApi.
export const vscode = new VSCodeAPIWrapper();

window.addEventListener('message', event => {
  const message = <Msg>event.data;
  if (message) {    
    if (message.callBacKId) {
      callBackArray.getCallBack(message.callBacKId, message.data)
    }
  }
})
