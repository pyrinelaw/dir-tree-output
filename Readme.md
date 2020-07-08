## object-write-to-file

输出文件夹多层目录

### 执行示例
``` bash
npm install -g dir-tree-output

cd dir
dir-tree -deep 2 -stretch -ignore node_modules .bin dist
```
### 输出示例
```bash
test
 ├─ assets
 │   ├─ images
 │   └─ style
 ├─ build
 │   └─ test
 ├─ scripts
 ├─ src
 │   ├─ components
 │   ├─ routes
 │   └─ utils
 └─ package.json
```

### 参数说明
ObjectWriteToFile(data, file);

参数     | 类型 | 是否必传 | 默认值 | 说明
-------- | --- | --- | --- | ---
-v | none | 否 | undefined | 输出版本
-h | none | 否 | undefined | 输出帮助文档
-deep | Number | 否 | 0 | 目录层数，0表示无限层级
-stretch | Boolean | 否 | false | 是否展开输出，带空格
-ignore | Array | 否 | [] | 忽略目录或者文件夹，与 git 中的忽略文件写法一致，也可以在根目录下添加 “.tree.ignore” 文件，用法同 git 忽略配置文件一致
