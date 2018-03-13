//*awlet*//{"title": "formhandler"}//*awlet*//

const formhandler = require('module/formhandler').default;

const handler = formhandler.dispatch(
    formhandler.register('name', (key, value, params) => {
        return 'My name is ' + value;
    }),

    formhandler.register('age', (key, value, params) => {
        return value + params.base;
    }),
);


const rawName = 'wxl';
const name = handler('name', rawName);


const rawAge = 100;
const age = handler('age', rawAge, {
    base: 20
});

console.log(name, age);