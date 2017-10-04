(function(win){
    // 加速IIFE对对象的访问
    var global = win;
    var doc = this.document;// this默认指向 window。
    var regContainsTag = /^\s*<(\w+|!)[^>]*>/;

    var GetOrMakeDom = function(params,context){
        var currentContext = doc;

        if(context){
            if(context.nodeType){// 它是文档节点或元素节点
                currentContext = context;
            }else{// 它是选择器字符串，可用来选择节点
                currentContext = doc.querySelector(context);
            }
        }
        // 如果没有传入 params，返回空的dom()对象
        if(!params || params === '' || typeof params === 'string' && params.trim() === ''){
            this.length = 0;
            return this;
        }
        // 如果 params是 HTML字符串，构造文档片段，填入并返回对象
        if(typeof params === 'string' && regContainsTag.test(params)){
            var divElm = currentContext.createElement('div');
            divElm.className = 'd-wrapper';
            var docFrag = currentContext.createDocumentFragment();
            docFrag.appendChild(divElm);
            divElm.innerHTML = params;
            var numberOfChildren = divElm.children.length;
            //遍历节点列表并填充对象，因为 HTML字符串可能含有多个兄弟节点
            for(var z = 0; z < numberOfChildren; z++){
                this[z] = divElm.children[z];
            }
            // var queryDiv = docFrag.querySelector('div');
            // queryDiv.innerHTML = params;
            // var numberOfChildren = queryDiv.children.length;
            // 遍历节点列表并填充对象，因为 HTML字符串可能含有多个兄弟节点
            // for(var z = 0; z < numberOfChildren; z++){
            //     this[z] = queryDiv.children[z];
            // }

            // 设置对象的 length
            this.length = numberOfChildren;
            // 返回类型为类数组对象
            return this;
        }
        // 如果 params是单个节点引用，填好并返回对象
        if(typeof params === 'object' && params.nodeName){
            this.length = 1;
            this[0] = params;
            return this;
        }
        // 如果 params是对象但不是节点则假设其为节点列表或者数组，或选择器字符串
        var nodes;
        if(typeof params !== 'string'){// 节点列表或者数组
            nodes = params;
        }else{// 是字符串
            nodes = currentContext.querySelectorAll(params.trim());
        }
        // 遍历前面创建的数组或者节点列表，填充并返回类数组对象
        var nodeLength = nodes.length;
        for(var i = 0; i < nodeLength;i++){
            this[i] = nodes[i];
        }
        this.length = nodeLength;
        return this;
    };

    var d = function(params,context){
        return new GetOrMakeDom(params,context);
    };

    // 暴露 d 到全局作用域，使得 d 可以被调用
    global.d = d;

    // 暴露 d.prototype
    d.fn = GetOrMakeDom.prototype;
    // 构造 each()方法
    d.fn.each = function(callback){
        var len = this.length;
        for(var i = 0; i < len; i++){
            // 执行回调函数，设置 this为当前元素，传递相应参数
            callback.call(this[i],i,this[i]);//call(绑定的this值，参数1，参数2，...)
        }
        return this; // 使其可链式调用
    };
    // 构造 html()方法
    d.fn.html = function(htmlString){
        if(htmlString){
            return this.each(function(){
                this.innerHTML = htmlString;
            });
        }else{
            return this[0].innerHTML;
        }
    };
    // 构造 text()方法
    d.fn.text = function(textString){
        if(textString){
            return this.each(function(){
                this.textContent = textString;
            });
        }else{
            return this[0].textContent.trim();
        }
    };
    // 构造 append()方法
    d.fn.append = function(stringOrObject){
        return this.each(function(){
            if(typeof stringOrObject === 'string'){
                this.insertAdjacentHTML('beforeend',stringOrObject);
            }else{
                var that = this;
                d(stringOrObject).each(function(name,value){
                    that.insertAdjacentHTML('beforeend',value.outerHTML);
                });
            }
        });
    };
})(window);