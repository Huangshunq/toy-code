# c.js

## usage

``` js
    co(function* () {
        var result = yield Promise.resolve(true);
        return result;
    }).then(function (value) {
        console.log(value);
    }, function (err) {
        console.error(err.stack);
    });

    co(function* () {
        var a = Promise.resolve(1);
        var b = Promise.resolve(2);
        var c = Promise.resolve(3);
        var res = yield [a, b, c];
        var res = yield [a, b, c];
        var res = yield [a, b, c];
        console.log(res);
        // => [1, 2, 3] 
    });
```

## reference

[co](https://github.com/tj/co)

[参考文章](https://cnodejs.org/topic/553fa3e62bd4939b1e9055a3)
