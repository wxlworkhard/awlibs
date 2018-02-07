//*awlet*//{"title": "atinterceptor"}//*awlet*//

import atinterceptor from '../../../atinterceptor';
import pcurry from '../../../pcurry';

const fetchData = atinterceptor();

const decorate = pcurry((promise) => {
    return promise.then((result) => {
        let errorItem;
        const hasError = result.some((item) => {
            errorItem = item;
            return item.code != 0;
        });

        if (hasError) {
            throw errorItem;
        }

        return result.map((item) => {
            return item.data;
        });
    }).catch((e) => {
        let msg = '';
        if (e['atinterceptorErrorType'] == 'req:q1') {
        }

        if (e['atinterceptorErrorType'] == 'res:s1') {
            msg = `系统繁忙${e['atinterceptorErrorType']}`;
        }

        if (!e['atinterceptorErrorType'] && e.msg) {
            msg = e.msg;
        }

        document.querySelector('h1').innerHTML = msg;
    });
});

function getList() {
    let promise = fetchData(() => {
        return [
            new Promise((resolve, reject) => {
                console.log('请求数据.....');
                setTimeout(() => {
                    resolve({
                        code: 0,
                        msg: 'code 非 0 错误',
                        data: {
                            list: [1,2,3]
                        }
                    });
                }, 1000);
            })
        ];
    }, true, 'getList', (asyncTag) => {
        console.log(asyncTag);
    });

    decorate(promise).then((dataArray) => {
        if (!dataArray) {
            return;
        }
        console.log(dataArray[0]);
    });

}

getList();

const button = document.createElement('button');
button.innerHTML = 'getList';
button.addEventListener('click', () => {
    getList();
}, false)

document.body.appendChild(button);

const h1 = document.createElement('h1');
document.body.appendChild(h1);