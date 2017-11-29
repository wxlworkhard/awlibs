import _curry from 'lodash/curry';

// 向右柯里化
function curry2(func) {
    return function(secondArg) {
        return function(firstArg) {
            return func(firstArg, secondArg)
        }
    }
}

const greaterThan = curry2(function (l, r) {
    return l > r;
});

// 向左柯里化，支持部分应用
const lessThan = _curry(function (l, r) {
    return l < r;
});

/**
 * 每个 rule 都是一个校验方法，返回校验结果 result
 */
const awlvalidator = {
    ruleMap: {
        required(value, params) {
            params = {
                ...params
            };
            const errorMsg = params.errorMsg || '必填字段';
            if (!value) {
                return {
                    valid: false,
                    msg: errorMsg
                };
            }
            return {
                valid: true,
                msg: ''
            };
        },

        decimal2(value, params) {
            const errorMsg = params.errorMsg || '格式错误';

            if (!/^(0(\.\d{0,2})?|[1-9]\d*(\.\d{0,2})?)$/.test(value)) {
                return {
                    valid: false,
                    msg: errorMsg
                };
            }
            return {
                valid: true,
                msg: ''
            };
        },

        min(value, params) {
            const min = params.min || 0;
            const errorMsg = params.errorMsg || ('不可小于' + params.min);

            if (lessThan(value, min)) {
                return {
                    valid: false,
                    msg: errorMsg
                };
            }

            return {
                valid: true,
                msg: ''
            };
        },

        max(value, params) {
            const max = params.max || 0;
            const errorMsg = params.errorMsg || ('不可大于' + params.max);

            const greaterThanMax = greaterThan(max);

            if (greaterThanMax(value)) {
                return {
                    valid: false,
                    msg: errorMsg
                };
            }

            return {
                valid: true,
                msg: ''
            };
        },

        maxLength(value, params) {
            const maxLength = params.maxLength || 0;
            const errorMsg = params.errorMsg || ('不可多于' + params.maxLength + '字符');

            if (value.length > params.maxLength) {
                return {
                    valid: false,
                    msg: errorMsg
                };
            }

            return {
                valid: true,
                msg: ''
            };
        },

        minLength(value, params) {
            const minLength = params.minLength || 0;
            const errorMsg = params.errorMsg || ('不可少于' + params.minLength + '字符');

            if (value.length < params.minLength) {
                return {
                    valid: false,
                    msg: errorMsg
                };
            }

            return {
                valid: true,
                msg: ''
            };
        },
    },
    ruleGetter(ruleName, params, customRule) {
        let customRuleMap = {};

        if (!this.ruleMap[ruleName]) {
            if (typeof customRule == 'function') {
                console.log(`自定义规则${ruleName}`);
                customRuleMap[ruleName] = customRule;
            } else {
                throw `不存在规则${ruleName}`;
            }
        }

        return (value) => {
            if (ruleName != 'required' && !value && value !== 0) {
                return {
                    valid: true,
                    msg: ''
                }
            }

            const rule = customRuleMap[ruleName] || this.ruleMap[ruleName];
            return rule(value, { ...params });
        };
    },

    // 生成校验方法
    validateGetter() {
        const rules = [].slice.call(arguments, 0);

        let result = {
            valid: true,
            msg: ''
        };

        return (value) => {
            rules.some((item) => {
                result = {
                    ...result,
                    ...item(value)
                };

                if (!result.valid) {
                    return true;
                }
            });

            return result;
        };
    },


};

export default awlvalidator;