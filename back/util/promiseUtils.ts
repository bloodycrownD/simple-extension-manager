import { promisify } from "util";
import {
    access,
    readdir,
    stat,
    unlink,
    rmdir,
    constants,
    mkdir,
    writeFile,
    readFile
} from "fs";

export const existPromise = async (path: string) => {
    return new Promise<boolean>((resolve, reject) => {
        access(path, constants.F_OK, (err) => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
};
export const readdirPromise = promisify(readdir);
export const statPromise = promisify(stat);
export const unlinkPromise = promisify(unlink);
export const rmdirPromise = promisify(rmdir);
export const mkdirPromise = promisify(mkdir);
export const writeFilePromise = promisify(writeFile);
export const readFilePromise = promisify(readFile);
export async function emptyDirPromise(path: string) {
    const files = await readdirPromise(path);
    for (const file of files) {
        const filePath = `${path}/${file}`;
        const stats = await statPromise(filePath);
        if (stats.isDirectory()) {
            await emptyDirPromise(filePath);
        } else {
            await unlinkPromise(filePath);
        }
    }
    await rmdirPromise(path);
}
export async function setTimeoutPromise(time: number, func: Function) {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            func();
            resolve();
        }, time)
    });
}