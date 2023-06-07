import { existsSync } from "fs";
import { join } from "path";

try{
    existsSync((undefined as unknown) as string);
    join((undefined as unknown) as string);
    console.log("---------------");
    
}
catch(e){
    console.log(e);
}