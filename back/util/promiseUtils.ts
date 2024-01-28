import {
    readdir,
    stat,
    unlink,
} from "fs/promises";
import { runTasks } from "../share";


export async function emptyDirPromise(path: string) {
    async function getFileStat(path: string) {
        return { path, isFile: (await stat(path)).isFile() }
    }
    const files = await readdir(path);
    const statTasks = [];
    for (const file of files) {
        const filePath = `${path}/${file}`;
        statTasks.push(getFileStat(filePath));
    }
    const statResult = await runTasks(statTasks);
    const deleteTasks = [];
    for (const result of statResult) {
        if (result.isFile) {
            deleteTasks.push(unlink(result.path));
        }
        else {
            deleteTasks.push(emptyDirPromise(result.path));
        }
    }
    await runTasks(deleteTasks);
    return;
}


export async function setTimeoutPromise(time: number, func: Function) {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            func();
            resolve();
        }, time)
    });
}

