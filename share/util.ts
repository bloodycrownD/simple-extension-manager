export { type Dict,runTasks }
interface Dict<T> {
    [key: string]: T
}

/**
 * 运行所有任务，失败任务将被剔除
 * @param params 
 * @returns 
 */
async function runTasks<T>(params: Promise<T>[]): Promise<Awaited<T>[]> {
    const allSettledTasks = await Promise.allSettled(params);
    const result = [];
    for (const task of allSettledTasks) {
        if (task.status == 'fulfilled') {
            result.push(task.value);
        }
    }
    return result;
}