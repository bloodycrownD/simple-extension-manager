## simple extension manager

由于[hayden-fr](https://github.com/hayden-fr)/[vscode-extension-pack-manager](https://github.com/hayden-fr/vscode-extension-pack-manager) 的插件已经很久没有维护了，而我又不是很会react，所以我借鉴他的思路用vue重写了这个插件。它的功能依然是简单的创建扩展包，通过扩展包来整理扩展，以及批量禁止扩展。

可以使用一下命令:

- `extension packs:manage` 创建自定义扩展包
- `extension pack:view` 查看自定义扩展

<img src='./assets/intro.gif'/>

