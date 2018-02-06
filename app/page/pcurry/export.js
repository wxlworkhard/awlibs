//*awlet*//{"title": "pcurry"}//*awlet*//

import pcurry from '../../../pcurry';

var c = pcurry(new Promise((resolve, reject) => {
    resolve(a);
}), 2);

var c1 = c((data) => {
    console.log('resolve c1', data);
    return 'c1';
}, (data) => {
    console.log('reject c1');
    return 'c1';
})

var c2 = c1((data) => {
    console.log('resolve c2', data);
    return 'c2';
}, () => {
    console.log('reject c2', data);
    return 'c2';
});

c2.then((data) => {
    console.log('resolve n', data)
})
