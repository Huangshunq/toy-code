const hasToStringTag = (Symbol && Symbol.toStringTag) ? true : false;

function isGeneratorFunction(fn) {
    if (hasToStringTag) {
        return fn[Symbol.toStringTag] === 'GeneratorFunction';
    }
    const genFn = (function*(){}).constructor;
    return fn instanceof genFn;
}

function isGenerator(obj) {
    if (hasToStringTag) {
        return obj[Symbol.toStringTag] === 'Generator';
    } else if(obj.toString) {//兼容处理
        return obj.toString() === '[object Generator]';
    }
    return false;
}

function isPromise(obj) {
    return 'function' == typeof obj.then;
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

module.exports = {
    isGenFn: isGeneratorFunction,
    isGen: isGenerator,
    isObj: isObject,
    isPro: isPromise
}