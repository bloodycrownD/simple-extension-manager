import { readFile } from "fs/promises";
import path = require("path");

module Test{
    const RootPath = process.env.USERPROFILE + "\\.vscode\\extensions";
    console.log(path.join('/',RootPath,"frhtylcn.pythonsnippets-1.0.2"));
    console.log(path.resolve('/',RootPath,"frhtylcn.pythonsnippets-1.0.2"));
    
    // readFile("/Users/戴明旺/.vscode/extensions/frhtylcn.pythonsnippets-1.0.2","utf8").then(v=>{
    //     console.log(v);
    // })
}



