import awlvalidator from '../../awlvalidator';


var a = awlvalidator.ruleMap['min'](1, {
    min: 1000
});


var b = awlvalidator.ruleMap['max'](100, {
    max: 5
});

console.log(a);
console.log(b);