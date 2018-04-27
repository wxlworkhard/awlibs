const DEFAULT_OPTIONS = {
    idKey: 'id',
    pIdKey: 'pId',
    childrenKey: 'children',

    type: 'nested',  // nested flattened
    data: []
};



function Tree(options) {
    this.options = {
        ...DEFAULT_OPTIONS,
        ...options,
    };

    const { type, data } = options;

    this.data = [
        ...this.parse(type, data)
    ];

}


Tree.prototype.parse = function() {
    return this[arguments[0] + 'Parser'].call(this, arguments[1]);
}

Tree.prototype.nestedParser = function (data) {
    const ret = deepFirstRecursive.call(this, data);

    return ret;

    /**
     * 深度优先
     *       +-D
     *   +-B-|
     * A-|   +-E
     *   +-C-F
     *
     * 找到 B 节点后把 B 作为父节点，children 数组作为数据，进入下次递归
     *
     * 如果是广度优先，应该先处理 B 同级节点，这样就需要重新遍历，获取 B 以及 C 的子节点，
     * 这时子节点也不知道父节点是哪个，这里不确定是否能轻易的实现广度优先遍历
     */
    function deepFirstRecursive(data, pItem, unique) {
        pItem = pItem || null;
        unique = unique || { id: 1 };
        const result = [];

        for (let i = 0, length = data.length; i < length; i++) {
            const item = data[i];

            // 没有唯一标志时增加一个
            if (item[this.options.idKey] == null) {
                item[this.options.idKey] = unique.id++;
            }

            // 没有对父节点的引用关系时增加一个
            if (pItem && item[this.options.pIdKey] == null) {
                item[this.options.pIdKey] = pItem[this.options.idKey];
            }

            result.push(item);

            // 进入递归的条件
            if (item[this.options.childrenKey] && item[this.options.childrenKey].length) {
                const restList = deepFirstRecursive.call(this, item[this.options.childrenKey], item, unique);
                // 拼接
                [].push.apply(result, restList);
            }
        }
        return result;
    }

}

Tree.prototype.getData = function () {
    return this.data;
}

Tree.prototype.flattenedParser = function (data) {
    const ret = data.concat();
     deepFirstRecursive.call(this, ret);

    return ret;

    /**
     * 深度优先的递归
     *       +-D
     *   +-B-|
     * A-|   +-E
     *   +-C-F
     *
     * 先取顶级节点 A 然后遍历获取 item.pId = A.id 的元素并插入 A.chidren
     * 然后以 item 为 target 继续下次递归
     *
     * 如果是广度优先，需要先把 B、C 先插入，这样就无法找到 B、C 的子节点，不确认广度优先如何实现
     *
     * 不能使用不可变数据更新，就是需要操作对象的属性
     */
    function deepFirstRecursive(data, target, targetIndex) {
        if (!target) {
            data.forEach((item, index) => {
                if (!item[this.options.pIdKey]) {
                    deepFirstRecursive.call(this, data, item, index);
                }
            });
        } else {
            data.forEach((item, index) => {
                if (item[this.options.pIdKey] == target[this.options.idKey]) {

                    target[this.options.childrenKey] = target[this.options.childrenKey] || [];
                    target[this.options.childrenKey].push(item);
                    deepFirstRecursive.call(this, data, item, index);
                }
            });
        }
    }
}


module.exports = Tree;