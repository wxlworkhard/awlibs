//*awlet*//{"title": "demo"}//*awlet*//

import awlvalidator from '../../../awlvalidator';

const value = 'xxx';
const validate = awlvalidator.validateGetter(
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

const result = validate(value);

// console.log(result);








const Lazychain = require('module/lazychain').default;

const lc = new Lazychain([1, 2]).tap((target) => {
    return target.concat('xxx');
}).tap((target) => {
    return target.join('*');
}).tap((target) => {
    return target + '__';
})
const ret = lc.force();

console.log(ret);