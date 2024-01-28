import AdmZip = require("adm-zip");
import { createWriteStream, existsSync, mkdir, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";

module Test {

  const zip = new AdmZip();
  zip.addFile("test/test1.txt", Buffer.from("----", "utf8"), "entry comment goes here1");
  zip.addFile("test/test2.txt", Buffer.from("++++", "utf8"), "entry comment goes here2");
  zip.writeZipPromise("C:/Users/戴明旺/Desktop/extensions.zip");


  // readFile("/Users/戴明旺/.vscode/extensions/frhtylcn.pythonsnippets-1.0.2","utf8").then(v=>{
  //     console.log(v);
  // })
}



