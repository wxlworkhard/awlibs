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

console.log(result);











// import Lazychain from 'module/lazychain';

// const x1 = new Lazychain([1,2]).tap((target) => {
//     return target.concat('xxx');
// }).force();

