const fs = require('fs');
const path = require('path');
const get = require('lodash/get');
const ignore = require('ignore');
const root = process.cwd();
const getRootDirName = () => {
    const arr = root.split('/');
    return arr[arr.length - 1];
}

const DEFAULT_OPTION = {
    ignore: [], // 忽略文件，空数组不会忽略任何文件
    deep: 0,    // 0 表示无限层级
    stretch: false, // 是否舒展模式,舒展模式下文件输出会加上空白 
};
const STRETCH_SYMBOL_PREFIX = {
    DEFAULT: ' ├─ ',
    LAST: ' └─ ',
    CHILD: ' │  ',
    LAST_CHILD: '    ',
}
const SYMBOL_PREFIX = {
    DEFAULT: '├─ ',
    LAST: '└─ ',
    CHILD: '│  ',
    LAST_CHILD: '   ',
}

class Tree {
    constructor(argvOption) {
        this.option = {
            ...DEFAULT_OPTION,
            ignore: ignore(),
        }
        this.tree = [];
        this.fillingOption(argvOption);
        this.fillingTree();
    }

    fillingOption(avgvOption = {}) {
        const option = this.option;
        const defaultIgnorePath = path.resolve(root, '.tree.ignore');

        if (fs.existsSync(defaultIgnorePath)) { 
            option.ignore.add(fs.readFileSync(defaultIgnorePath).toString());
        }

        if (avgvOption.ignore instanceof Array) {
            avgvOption.ignore.forEach(value => {
                option.ignore.add(value);
            });
        }
        if (avgvOption.hasOwnProperty('stretch')) {
            option.stretch = avgvOption.stretch || false;
        }
        option.deep = avgvOption.deep || 0;
    }

    fillingTree(node = null) {
        const option = this.option;
        const tree = this.tree;
        const parentAbsolutePath = get(node, 'absolePath', root);
        const deep = get(node, 'deep', 0) + 1;
        const list = fs.readdirSync(parentAbsolutePath);
        list.forEach((file) => {
            const absolutePath = path.resolve(parentAbsolutePath, file);
            const stat = fs.lstatSync(absolutePath);
            const staticPath =  absolutePath.substring(root.length + 1, absolutePath.length);
            const isDir = stat.isDirectory();

            if (option.deep > 0 && deep > option.deep) {
                return;
            }

            // 忽略条件
            if (option.ignore.ignores(staticPath)) {
                return;
            }

            const childNode = {
                name: file,
                children: [],
                absolePath: absolutePath,
                deep: deep,
            };
            if (isDir) {
                this.fillingTree(childNode);
            }
            (node ? node.children : tree).push(childNode);
        });
    }

    output() {
        const option = this.option;
        const tree = this.tree;
        const symbolPrefix = option.stretch ? STRETCH_SYMBOL_PREFIX : SYMBOL_PREFIX;
        const lineStrArr = [getRootDirName()];

        if (tree.length == 0) {
            lineStrArr.push(`${symbolPrefix.LAST}directory is empty`);
            console.log(lineStrArr.join('\n'));
            return;
        }
        
        const fillingLineStrArr = (children = tree, prefix = '') => {
            for (var i = 0; i < children.length; i++) {
                const child = children[i];
                const next = children[i + 1];
                if (!next) {
                    lineStrArr.push(`${prefix}${symbolPrefix.LAST}${child.name}`);
                    fillingLineStrArr(child.children || [], `${prefix}${symbolPrefix.LAST_CHILD}`);
                } else {
                    lineStrArr.push(`${prefix}${symbolPrefix.DEFAULT}${child.name}`);
                    fillingLineStrArr(child.children || [], `${prefix}${symbolPrefix.CHILD}`);
                }
            }
        }

        fillingLineStrArr();

        console.log(lineStrArr.join('\n'));
    }
}

module.exports = Tree;