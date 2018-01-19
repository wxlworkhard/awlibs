import awlvalidator from '../../../awlvalidator';

import formhandler from '../../../formhandler';


const value = '12';

const result = awlvalidator.validateGetter(
    awlvalidator.ruleGetter('xxx', null, (value, params) => {
        console.log('xxx');
    }),
    awlvalidator.ruleGetter('required'),
    // awlvalidator.ruleGetter('min', {
    //     min: 0
    // }),
    awlvalidator.ruleGetter('integer'),
    awlvalidator.ruleGetter('max', {
        max: 500
    }),
    awlvalidator.ruleGetter('maxLength', {
        maxLength: 5
    }),
)(value);

console.log(result);



import fetchinterceptorFactory from '../../../fetchinterceptor';



import Lazychain from 'module/lazychain';

const x1 = new Lazychain([1,2]).tap((target) => {
    return target.concat('xxx');
}).force();

console.log(x1);