import AdmZip = require("adm-zip");


module Test {
  class UnMut{
    readonly test:string;
    constructor(test:string){
      this.test = test;
    }
  }
  interface Mut{
    test:string
  }

  const unmut:UnMut = new UnMut("test");
  (unmut as Mut).test = "sss";
  console.log(unmut);
  
    
  // readFile("/Users/戴明旺/.vscode/extensions/frhtylcn.pythonsnippets-1.0.2","utf8").then(v=>{
  //     console.log(v);
  // })
}



