import awlvalidator from '../../awlvalidator';



const value = '100';

const result = awlvalidator.validateGetter(
    awlvalidator.ruleGetter('xxx', null, (value, params) => {
        console.log('xxx');
    }),
    awlvalidator.ruleGetter('required'),
    awlvalidator.ruleGetter('min', {
        min: 0
    }),
    awlvalidator.ruleGetter('decimal2'),
    awlvalidator.ruleGetter('max', {
        max: 500
    }),
    awlvalidator.ruleGetter('maxLength', {
        maxLength: 5
    }),
)(value);

console.log(result);