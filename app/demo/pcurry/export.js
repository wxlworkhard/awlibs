//*awlet*//{"title": "pcurry"}//*awlet*//


const pcurry = require('awlibs/pcurry');

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


const promise = decorateAB(new Promise((resolve) => {
    let msg = 'begin';
    console.log(msg);
    resolve(msg);
}));