//*awlet*//{"title": "树形结构处理"}//*awlet*//
import Tree from 'awlibs/tree';


var tree1 = [
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


var tree2 = [
    { id: 1, name: 'L1' },
    { id: 2, pId: 1, name: 'L2_1' },
    { id: 3, pId: 2, name: 'L3_1' },

    { id: 4, pId: 1, name: 'L2_2' },
    { id: 5, pId: 4, name: 'L3_1' },

];

console.log(tree1);
const treeInstance1 = new Tree({
    type: 'nested',
    idKey: 'id',
    pIdKey: 'pId',
    childrenKey: 'children',
    data: tree1,
});

const ret1 = treeInstance1.getData();
console.log(ret1);


console.log(tree2);
const treeInstance2 = new Tree({
    type: 'flattened',
    idKey: 'id',
    pIdKey: 'pId',
    childrenKey: 'children',
    data: tree2,
});
const ret2 = treeInstance2.getData();
console.log(ret2);