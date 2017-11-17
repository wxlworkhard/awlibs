/**
 * 每个 rule 都是一个校验方法，返回校验结果 result
 */

/**
 * let rules = [
 *  awlvalidator.ruleGetter('required', value, {
 *      errorMsg: '请输入xxx',
 *  }),
 *  awlvalidator.ruleGetter('decimal2', value),
 *  awlvalidator.ruleGetter('min', value, {
 *      min: 100
 *  }),
 *  awlvalidator.ruleGetter('maxLength', value),
 * ];
 * let result = awlvalidator.validate(rules);
 *
 * 结果为：{
 *  valid: true/false,
 *  msg: '格式错误'
 * }
 */

const awlvalidator = {
    ruleGetter(ruleName, value, params) {
        return () => {
            if (ruleName != 'required' && !value && value !== 0) {
                return {
                    valid: true,
                    msg: ''
                }
            }
            return this.ruleMap[ruleName].call(null, value, {
                ...params
            });
        };
    },

    ruleMap: {
        required(value, params) {
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

            if (value < params.min) {
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

            if (value > params.max) {
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
    },

    validate(rules) {
        let result = {
            valid: true,
            msg: ''
        };

        rules.some((item) => {
            let tmpResult = item();

            if (!tmpResult.valid) {
                result = {
                    ...tmpResult
                };
                return true;
            }
        });

        return result;
    }
};

export default awlvalidator;