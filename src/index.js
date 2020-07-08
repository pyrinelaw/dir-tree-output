const Tree = require('./tree.js');
const processArgvs = require('process-argvs');

const argvs = processArgvs({
    require: {
        deep: Number,
        stretch: Boolean,
        ignore: Array,
    }
});

const tree = new Tree(argvs.data);

switch(argvs.first.key) {
    case 'v':
    case 'V':
        console.log(`version: ${require('../package').version}`);
        break;
    case 'h':
    case 'H':
        console.log(`Commands:
    -v, -v              output the version number
    -h, -h              output the command
    -deep               tree deep, default is unlimited
    -stretch            output tree has space
    -ignore             ignore files, also can use the file “.tree.ignore”
Readme:
    http://www.baidu.com
`);
    break;
    default:
        tree.output();
        break;
}