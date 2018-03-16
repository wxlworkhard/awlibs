<p align="center">
  <h3 align="center">Awlibs</h3>

  <p align="center">
    A base tools library.
  </p>
</p>

## Table of contents

- [Quick start](#quick-start)
- [Status](#status)
- [What's included](#whats-included)
- [Atinterceptor](#atinterceptor)
- [Awlvalidator](#awlvalidator)
- [Formhandler](#formhandler)
- [Lazychain](#lazychain)
- [Pcurry](#pcurry)
- [Promiseajax](#promiseajax)
- [CVD](#cvd)

## Quick start

- Install with [npm](https://www.npmjs.com/): `npm install awlibs`

## Status
[![npm version](https://img.shields.io/npm/v/awlibs.svg)](https://www.npmjs.com/package/awlibs)

## What's included
包含 atinterceptor、awlvalidator、formhandler、lazychain、pcurry、promiseajax、cvd 6 个工具库，下面分别介绍。

## Atinterceptor

异步任务拦截器，把一个异步任务抽象成一个请求 -> 响应的过程，对异步任务的返回结果进行归类，方便后续的统一处理，内置异步任务的状态标记（ready/pending），可以防止同一任务的重复执行。

#### 代码示例

```
const atinterceptor = require('awlibs/atinterceptor');
const asyncTaskTrigger = atinterceptor();

asyncTaskTrigger(() => {
  return [
    fetch() // 异步任务，需要返回一个 Promise 对象
  ];
}, true, 'getList').then((result) => {
});
```

#### 参数
`const asyncTaskTrigger = atinterceptor(asyncTag, configs)`    
`asyncTaskTrigger(getAsyncTaskArray, repeat, tagKey, onAsyncTagChange)`

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>asyncTag</td>
            <td>false</td>
            <td>Object</td>
            <td>
              状态标记对象，对象的每个 key 标记一个任务的状态，例如：<br>
              <code>{ getList: 'ready', getInfo: 'ready'}</code>
            </td>
        </tr>
        <tr>
            <td>configs</td>
            <td>false</td>          
            <td>Object</td>          
            <td>配置对象，定义错误类型、错误信息的 key</td>
        </tr>
        <tr>
            <td>getAsyncTaskArray</td>
            <td>true</td>          
            <td>Function</td>          
            <td>获取异步任务数组的函数</td>
        </tr>      
        <tr>
            <td>repeat</td>
            <td>true</td>          
            <td>Boolean</td>          
            <td>对同一个异步任务是否允许重复执行，允许重复执行值为 true</td>
        </tr>
        <tr>
            <td>tagKey</td>
            <td>true</td>          
            <td>String</td>          
            <td>asyncTag 对象的 key，异步任务的状态标记</td>
        </tr>
        <tr>
            <td>onAsyncTagChange</td>
            <td>false</td>          
            <td>Function</td>          
            <td>状态标记对象变化时的回调函数</td>
        </tr>
    </tbody>
</table>

## Awlvalidator

轻量级校验器，源码内容不到 200 行，易使用，易扩展。

#### 代码示例

```
const awlvalidator = require('awlibs/awlvalidator');

const value = 'xxx';

const validator = awlvalidator.validateGetter(
    awlvalidator.ruleGetter('required', {
        errorMsg: '请填写包含 xxx 的字符串'
    }),
    awlvalidator.ruleGetter('xxx', null, (value, params) => {
        value = value.toString();
        if (value.indexOf('xxx') !== -1) {
            return {
                valid: true
            };
        } else {
            return {
                valid: false,
                msg: '不包含 xxx'
            };
        }
    }),
    awlvalidator.ruleGetter('minLength', {
        minLength: 5
    }),
);

const result = validator(value);
```

#### 参数
`awlvalidator.validateGetter(rule1, rule2, ..., ruleN)` 接收任意数量的校验规则，生成校验方法。    
`awlvalidator.ruleGetter(ruleName, params, handler)` 生成校验规则。

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>ruleName</td>
            <td>true</td>
            <td>String</td>
          <td>
            规则名称，内置 <code> 'required', 'integer', 'decimal2', 'min', 'max', 'maxLength', 'minLength'</code> 规则，可以自定义
          </td>
        </tr>
        <tr>
            <td>params</td>
            <td>false</td>          
            <td>Object</td>          
            <td>为校验逻辑提供必要参数，例如：max 规则需要提供 max 最大值参数</td>
        </tr>
        <tr>
            <td>handler</td>
            <td>false</td>          
            <td>Function</td>          
            <td>自定义校验规则的处理逻辑</td>
        </tr>
    </tbody>
</table>

内置规则比较少，但是提供了一种校验的机制，推荐开发者根据自己的需求定制规则。


## Formhandler

使用函数式组合，避免批量 `if else` 的小工具。

#### 代码示例

```
const formhandler = require('module/formhandler').default;

const handler = formhandler.dispatch(
    formhandler.register('name', (key, value, params) => {
        return 'My name is ' + value;
    }),

    formhandler.register('age', (key, value, params) => {
        return value + params.base;
    }),
);


const rawName = 'wxl';
const name = handler('name', rawName);


const rawAge = 100;
const age = handler('age', rawAge, {
    base: 20
});

// 'wxl' --> 'My name is wxl.'
// 100   --> 120
```
#### 参数
`formhandler.dispatch(handler1, handler2, ..., handlerN)` 组合处理器。    
`formhandler.register(name, callback)` 注册单个处理器。

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>name</td>
            <td>true</td>
            <td>String</td>
          <td>处理器名称</td>
        </tr>
        <tr>
            <td>callback</td>
            <td>true</td>          
            <td>Function</td>          
            <td>针对唯一 name 的逻辑处理</td>
        </tr>
    </tbody>
</table>

## Lazychain

惰性求值的小工具。

#### 代码示例

```
const Lazychain = require('module/lazychain').default;

const lc = new Lazychain([1, 2]).tap((target) => {
    return target.concat('xxx');
}).tap((target) => {
    return target.join('*');
}).tap((target) => {
    return target + '__';
})

const ret = lc.force();
// ret = '1*2*xxx__'
```

#### 参数
`new Lacychain(target).tap(handler).tap(handler2)` 把处理器添加到待执行的队列。    
`force` 执行函数队列。

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>target</td>
            <td>true</td>
            <td>Any</td>
            <td>待处理的数据</td>
        </tr>
        <tr>
            <td>handler</td>
            <td>true</td>          
            <td>Function</td>          
            <td>对 target 的处理逻辑</td>
        </tr>
    </tbody>
</table>


## Pcurry

针对 Promise 的柯里化工具，预先定义处理器，不需要在每次 Promise 完成后都重复写处理逻辑。

#### 代码示例

```
const pcurry = require('module/pcurry');

const decorateA = pcurry((promise) => {
    return promise.then((data) => {
        let msg = data + ':handlerA';
        console.log(msg);
        return msg;
    });
});

const decorateAB = decorateA((promise) => {
    return promise.then((data) => {
        let msg = data + ':handlerB';
        console.log(msg);
        return msg;
    });
});


decorateAB(new Promise((resolve) => {
    let msg = 'begin';
    console.log(msg);
    resolve(msg);
})).then((result) => {
});
```

#### 参数
`pcurry(handlerA)(handlerB)(promise)`

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>handler*</td>
            <td>true</td>
            <td>Function</td>
            <td>预先定义的处理器，以一个 Promise 对象为参数，并返回该参数对象</td>
        </tr>
        <tr>
            <td>promise</td>
            <td>true</td>          
            <td>Promise</td>          
            <td>处理器的参数</td>
        </tr>
    </tbody>
</table>

## Promiseajax

基于 Promise 的轻量级 Ajax 库。

#### 代码示例

```
import { get as ajaxGet, post as ajaxPost } from 'module/promiseajax';

ajaxPost({
    url: '/apis/getList',
    contentType: 'json',
    params: {
        pageNo: 1,
        pageSize: 20
    }
}).then((res) => {
    console.log(res);
});


ajaxGet({
    url: '/apis/getInfo',
}).then((res) => {
    console.log(res);
});
```

#### 参数

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>url</td>
            <td>true</td>
            <td>String</td>
            <td>请求地址</td>
        </tr>
        <tr>
            <td>contentType</td>
            <td>false</td>          
            <td>String</td>          
            <td>编码方式，默认值是 x-www-form-urlencoded</td>
        </tr>
        <tr>
            <td>params</td>
            <td>false</td>          
            <td>Object</td>          
            <td>请求参数</td>
        </tr> 
    </tbody>
</table>

## CVD

复杂表单录入场景的分层解决方案，轻量级、跨平台、易扩展。

### 核心概念

- 单一数据源：整个表单交互逻辑的状态被存储在一个状态树 store 中。来自服务端的数据无需编写更多的代码情况下被序列化并注入到客户端中，由于单一的状态树，调试变得容易。此外，受益于单一状态树，以前难以实现的“清空/撤销”这类功能也变得轻而易举。
- State 是只读的：改变 state 需要使用特定的方法 connector、validator、dependency、flow 才可以，类似 Redux 只能通过 Action，下面会介绍各个方法的含义。
- 分层：把对表单的处理逻辑分成三层 connector（序列化用户输入的数据）、validator（校验序列化后的数据输出校验结果）、dependency（处理表单控件之间的依赖关系），代码解耦、三层任意组合代码灵活。
- 使用纯函数来执行修改：使用函数式组合的方式，注册逻辑处理器（handler 函数），接收先前的 state 并返回新的 state，注意使用不可变数据更新，类似 Redux 的 Reducer。

#### 代码示例

```
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

```
以上代码可以直接运行，这里只给出了简单例子，在特别复杂的表单场景有过应用。
