//*awlet*//{"title": "pcurry"}//*awlet*//

import pcurry from '../../../pcurry';


// 先定义方法
// 方法不依赖调用者 promise，可以应用在任何一个 promise 对象
// 这样这些方法的代码可以复用
// 使用柯里化可以在任意粒度实现复用
const decorate = pcurry((promise) => {
    return promise.then((data) => {
        let msg = 'resolve1'
        console.log(msg, data);
        return msg;
    }, () => {

    });
})((promise) => {
    return promise.then((data) => {
        let msg = 'resolve2';
        console.log(msg, data);
        return msg;
    });
});

console.log(decorate);


const promise = decorate(new Promise((resolve) => {
    let msg = 'begin';
    console.log(msg);
    resolve(msg);
}));

console.log(promise);