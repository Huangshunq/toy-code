const { isGenFn, isGen, isObj, isPro } = require('./lib/type');

function co(gen) {
  const ctx = this;
  //返回一个promise
  return new Promise(function(resolve, reject) {
    //如果是 generatorFunction,就执行以获得对应的generator对象
    if (isGenFn(gen)) gen = gen.call(ctx);
    //如果不是 generator对象，返回
    if (!isGen(gen)) return resolve(gen);
    //初始化入口函数，第一次调用
    onFulfilled();
    //成功状态下的回调
    function onFulfilled(res) {
      let ret;
      try {
        //拿到第一个 yield返回的对象值
        ret = gen.next(res);
      } catch (e) {
        //出错直接调用 reject把 promise置为失败状态
        return reject(e);
      }
      //开启调用链
      next(ret);
    }

    function onRejected(err) {
      let ret;
      try {
        //抛出错误，这边使用 generator对象 throw。这个的好处是可以在co的 generatorFunction里面使用 try捕获到这个异常。
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function next(ret) {
      //如果执行完成，直接调用 resolve把 promise置为成功状态
      if (ret.done) return resolve(ret.value);
      //把 yield的值转换成 promise
      //支持 promise，array，object
      //转换成 promise
      const val = toPromise.call(ctx, ret.value);
      //成功转换就可以直接给新的 promise添加 onFulfilled, onRejected。当新的 promise状态变成结束态（成功或失败）。就会调用对应的回调。整个next链路就执行下去了。
      if (val && isPro(val)) return val.then(onFulfilled, onRejected);
      //否则说明有错误，调用 onRejected给出错误提示
      return onRejected(new TypeError(
          'You may only yield a promise, generator, array, or object, ' 
          + 'but the following object was passed: "' 
          + String(ret.value) 
          + '"'));
    }
  });
}

function toPromise(obj) {
  //确保 obj有意义
  //如果已经是Promise对象，也把obj返回出去
  if (!obj || isPro(obj)) return obj;
  //若是generator函数或现成的generator对象，则直接把obj作为参数传入co函数，并把这个co函数
  //返回出来的"外壳 Promise"作为 return出来的 Promise
  if (isGenFn(obj) || isGen(obj)) return co.call(this, obj);
  //若是Promise数组，则调用arrayToPromise方法
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
  //若是属性值是Promise对象的对象，则调用objectToPromise方法
  if (isObj(obj)) return objectToPromise.call(this, obj);
  return obj;
}

/**
 * 利用 Promise.all方法，充当全部结果的返回者
 * 利用 Array.map方法，实现了并行操作，分别对数组中的每一个元素递归执行 toPromise方法，把这些子Promise接着
 * 返回 co中来获取执行结果，最后等待这些子 Promise全部得到结果后，Promise.all执行成功，
 * 返回执行结果数组
 */
function arrayToPromise(obj) {
  return Promise.all(obj.map(toPromise, this));
}

/**
 * 与数组略有不同，利用for循环来实现并行的异步调用，
 * Promise.all()仅充当一个类计数器，并返回最终结果
 */
function objectToPromise(obj) {
  //results是将用于返回的对象，使用和obj相同的构造函数
  let results = new obj.constructor();
  //Object.keys方法用于返回对象的所有的属性名
  const keys = Object.keys(obj);
  //寄存所有对象属性的Promise的数组
  let promises = [];
  
  //利用for循环来实现异步
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    //确保obj[key]为Promise对象，然后调用defer推入promises数组等待执行，否则直接将结果返回给result[key]
    const promise = toPromise.call(this, obj[key]);
    if (promise && isPro(promise)) defer(promise, key);
    else results[key] = obj[key];
  }
  //传入的是promise.then()返回的空Promise，所以此处Promise.all仅充当一个计数器，确保所有异步操作的resolve操作中对results对象的属性都赋值完毕后，返回最终的results对象
  return Promise.all(promises).then(function () {
    return results;
  });
  //执行异步操作，并在操作结果赋值给results[key]
  function defer(promise, key) {
    results[key] = undefined;
    promises.push(promise.then(function (res) {
      results[key] = res;
    }));
  }
}

module.exports = co;