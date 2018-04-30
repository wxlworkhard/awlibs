//*awlet*//{"title": "树形结构处理"}//*awlet*//
const Tree = require('awlibs/tree');

/**
 * 嵌套表示的树形数据源
 * 只有父 -> 子关系，没有子 -> 父关系
 */
const treeData1 = [
    {
        name: 'L1',
        children: [
            {
                name: 'L2_1',
                children: [ { name: 'L3_1'} ]
            },

            {
                name: 'L2_2',
                children: [ { name: 'L3_1' } ]
            },
        ]
    }
];

const treeIst1 = new Tree({
    type: 'nested',
    idKey: 'id',
    pIdKey: 'pId',
    childrenKey: 'children',
    data: treeData1,
});

const ret1 = treeIst1.getData();
console.log(ret1);


/**
 * 扁平表示的树形数据源
 * 只有子 -> 父关系，没有父 -> 子关系
 */
var treeData2 = [
    { id: 1, name: 'L1' },
    { id: 2, pId: 1, name: 'L2_1' },
    { id: 3, pId: 2, name: 'L3_1' },

    { id: 4, pId: 1, name: 'L2_2' },
    { id: 5, pId: 4, name: 'L3_1' },

];

const treeIst2 = new Tree({
    type: 'flattened',
    idKey: 'id',
    pIdKey: 'pId',
    childrenKey: 'children',
    data: treeData2,
});
const ret2 = treeIst2.getData();
console.log(ret2);