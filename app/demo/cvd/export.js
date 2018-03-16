//*awlet*//{"title": "cvd"}//*awlet*//

const CVD = require('awlibs/cvd');
const awlvalidator = require('awlibs/awlvalidator').default;
const Lazychain = require('awlibs/lazychain').default;

/**
 * 注册每一层的 handler 对 store 进行修改
 * 使用不可变数据更新的方式
 */
const connectorHandler = CVD.dispatch(
    CVD.register('name,age', (key, value, params, store) => {
        if (!value) {
            return '';
        } else {
            return 'yoyo_' + value;
        }
    }),

    CVD.register('jobs', (key, value, params, store) => {

        if (Object.prototype.toString.call(value) == '[object Array]') {
            return [
                ...value
            ];
        }

        const checked = params.checked;
        let model = store.model[key].concat();
        const index = model.indexOf(value);

        if (checked && index == -1) {
            model.push(value);
        }

        if (!checked && index != -1) {
            model.splice(index, 1);
        }

        return model;
    }),
);

const validatorHandler = CVD.dispatch(
    CVD.register('name', (key, value) => {
        return awlvalidator.validateGetter(
            awlvalidator.ruleGetter('required', {
                errorMsg: '请填写名称'
            }),
            awlvalidator.ruleGetter('minLength', {
                minLength: 10
            }),
            awlvalidator.ruleGetter('maxLength', {
                maxLength: 30
            })
        )(value);
    }),

    CVD.register('jobs', (key, value) => {
        if (!value || !value.length) {
            return {
                valid: false,
                msg: '请选择工作',
            };
        }
        return {
            valid: true,
            msg: '',
        };
    }),
);

const dependencyHandler = CVD.dispatch(
    CVD.register('jobs', (key, value, params, store) => {
        let desc = {
            ...store.desc,
        };

        desc['name'] = {
            ...desc['name'],
            showCrown: value.indexOf(1) != -1 ? true : false
        };

        return {
            desc,
        };
    }),
);


/**
 * 提供单一数据源 store
 * 必须包含 model 和 desc 两个属性
 * model 是序列化好的数据可以直接提交
 * desc 维护前端路径所需的数据
 */
const cvd = new CVD({
    model: {
        name: '',
        age: '',
        jobs: [],
    },
    desc: {
        name: {
            showCrown: false,
            valid: true,
            msg: ''
        },

        jobs: {
            list: [{id: 1, name: '腾讯'}, {id: 2, name: '阿里'}, {id: 3, name: '百度'} ],
        }
    },
});

/**
 * 初始化 cvd
 * 初始化完成后生成
 * cvd.connector
 * cvd.validator
 * cvd.dependency
 * 以及三者的统一调用 cvd.flow 方法
 * 修改 store 的入口
 */
cvd.init(connectorHandler, validatorHandler, dependencyHandler);



/**
 * 模拟一个 key 为 name 的 input 控件
 * value 为输入内容
 * params 提供自定义信息
 */
let cvdParams = {
    key: 'name',
    value: 'wxl',
    params: {}
};


// 使用 flow 自动调用三层进行逻辑处理
cvd.flow(cvdParams);

// 获取新的 store
let store = cvd.getStore();
console.log(store);

/**
 * 模拟一个 key 为 age 的 input 控件
 */

cvdParams = {
    key: 'age',
    value: '',
};

// 手动调用
// 三层可任意组合，灵活使用
// 这里只调用 connector 和 dependency 两层
// 这里使用了惰性求值（如何使用见上文）非必须
const lc = new Lazychain(cvdParams);

lc.tap((cvdResult) => {
    return cvd.connector({
        ...cvdResult
    });
}).tap((cvResult) => {
    return cvd.dependency({
        ...cvResult,
    });
});
lc.force();


console.log(cvd.getStore());


/**
 * 模拟一个 key 为 jobs 的 checkbox 控件
 */
const jobs = cvd.getStore().desc['jobs'].list;

// 选中了第一项，把要提交后端的 id 注入进来
cvdParams = {
    key: 'jobs',
    value: jobs[0].id,
    params: {
        checked: true
    }
};

cvd.flow(cvdParams);
console.log(cvd.getStore());

// 选中第二项
setTimeout(() => {
    cvdParams = {
        key: 'jobs',
        value: jobs[1].id,
        params: {
            checked: true
        }
    };
    cvd.flow(cvdParams);
    console.log(cvd.getStore());
}, 1000);


// 取消第一项
setTimeout(() => {
    cvdParams = {
        key: 'jobs',
        value: jobs[0].id,
        params: {
            checked: false
        }
    };
    cvd.flow(cvdParams);
    console.log(cvd.getStore());
}, 2000);





