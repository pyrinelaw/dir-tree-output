
/**
 * option
 * {
 *  prefix: '-'
 *  requireAll: true,
 *  condition: {
 *      k1: String,
 *      k2: Boolean,
 *      k3: Array
 *  }      
 * }
 */
const DEFAULT_OPTION = {
    prefix: '-',
    requireAll: true,
    condition: {}
}

const computedArgvs = (option = {}) => {
    const requireAll = option.hasOwnProperty('requireAll') ? 
        (option.requireAll || false) : true;
    const condition = option.condition || {};
    const prefix = option.prefix || DEFAULT_OPTION.prefix;
    const data = {};
    const argvs = (process.argv || []).splice(2, (process.argv || []).length);
    
    let key = '';
    let firstKey = undefined;
    let type = String;

    for (let i =0; i < argvs.length; i++) {
        const value = argvs[i];
        
        if (value.startsWith(prefix)) {
            key = value.substring(prefix.length);
            if (!key || (!requireAll && !condition.hasOwnProperty(key)) || data.hasOwnProperty(key)) {
                key = '';
                continue;
            }
            if (!firstKey) {
                firstKey = key;
            }
            type = condition[key] || String;
            switch(type) {
                case Boolean:
                    data[key] = true;
                    break;
                case Array:
                    data[key] = [];
                    break;
                case Number:
                    data[key] = NaN;
                    break;
                case String:
                default:
                    data[key] = undefined;
                    break;
            }
        } else if (key) {
            switch(type) {
                case Boolean:
                    break;
                case Array:
                    data[key].push(value);
                    break;
                case Number:
                    if (Number.isNaN(data[key])) {
                        data[key] = Number(value);
                    }
                    break;
                case String:
                default:
                    if (!data[key]) {
                        data[key] = value;
                    }
                    break;
            }
        }
    }

    return {
        data: data,
        first: {
            key: firstKey,
            value: data[firstKey],
        }
    }
}

module.exports = computedArgvs;