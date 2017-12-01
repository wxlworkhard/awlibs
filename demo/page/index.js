import awlvalidator from '../../awlvalidator';

import formhandler from '../../formhandler';


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




