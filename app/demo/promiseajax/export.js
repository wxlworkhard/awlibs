//*awlet*//{"title": "promiseajax"}//*awlet*//

import { get as ajaxGet, post as ajaxPost } from 'awlibs/promiseajax';


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