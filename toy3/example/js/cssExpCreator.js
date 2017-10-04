//创建数组
var arrList = (function(){
    //构造:nth-child(n)表达式
    var getNthChildString = function(length,index){
        var nthChildString = "", n = index+1;

        if(n){
            if(length){
                nthChildString = ":nth-child("+n+")";
            } else {
                nthChildString = ":only-child";
            }
        } else {
            throw new Error("构造:nth-child(n)表达式失败");
        }

        return nthChildString;
    };
    //构造完整的层级路径css选择器表达式
    var getLevelSelector = function(node){
        var levelString = node.tagName,
            p = node.parent;
        
        if(p){
            levelString = p.levelSelector + " > " + levelString;
            if($(levelString).length>1){
                levelString += node.nthChild;
            }
        } else {
            levelString = node.tagName;
        }
        
        if($(levelString).length!==1){
            console.log("所选第"+(node.parentNum+1)+"层对象levelSelector或有误！");
        }
        
        return levelString;
    };
    //构造可能更优化的css选择器表达式
    var getSelector = function(node){
        var fastSelector, classString;

        if(node.id){
            fastSelector = "#"+node.id;
        }
        else if($(node.tagName).length===1){
            fastSelector = node.tagName;
        }
        else if(node.className){
            classString = "."+node.className.split(" ").join(".");
            if($(classString).length===1){
                fastSelector = classString;
            }
        }
        
        if(!fastSelector){
            var selectorArr = node.parent.selector.split(" > ");

            if(classString){
                selectorArr.push(classString);
            } else {
                selectorArr.push(node.tagName);
            }
            
            if($(selectorArr.join(">")).length!==1){
                selectorArr.pop();
                selectorArr.push(node.tagName+node.nthChild);
            }

            fastSelector = selectorArr.join(" > ");
        }
        
        if($(fastSelector).length!==1){
            console.log("所选第"+(node.parentNum+1)+"层对象selector或有误！");
        }
        
        return fastSelector;
    };
    /*定义node对象
            对象包含的信息：   parentNum : 遍历到body元素总数
                            tagName : 元素标签名
                            content : 元素文本内容
                            href : 链接属性值
                            id : id属性值
                            className : class属性值
                            parent : 指向父节点对象
                            nthChild : 可用于判断是其父节点的第几个子元素
                            selector : 可能更优化的css选择器表达式
                            levelSelector : 完整的层级路径css选择器表达式
     */
    function Node($tag){
        this.parentNum = $tag.parents().length - 1;
        this.tagName = $tag[0].tagName.toLocaleLowerCase();
        this.content = $tag.text();
        this.href = $tag.attr("href")||null;
        this.id = $tag.attr("id")||null;
        this.className = $tag.attr("class")||null;

        if(this.parentNum!==0){
            this.parent = new arguments.callee($tag.parent());
            this.nthChild = getNthChildString($tag.siblings().length,$tag.index());
        } else {
            this.parent = null;
            this.nthChild = "";
        }

        this.levelSelector = getLevelSelector(this);
        this.selector = getSelector(this);

        return this;
    }
    //将处理好的node对象放入数组
    var addNode = function($tag){
        var node = new Node($tag);
        this.push(node);
        
        return node;
    };
    //清空数组
    var clear = function(){
        return (this.splice(0,list.length)) ? true : false;
    };
    //生成添加了自定义方法的数组
    var createArr = function(){
        var arr = [];
        arr.addNode = addNode;
        arr.clear = clear;

        return arr;
    };

    return createArr();
})();

//获取单击节点节点信息
$(function(){    
    $('body').click(function(event){
        var $tag = $(event.target);

        var node = arrList.addNode($tag);
        console.log(node);
        
        event.preventDefault();
    });
});

//高亮鼠标所指节点
$(function(){
    $('body').mouseover(function(event){
        var $tag = $(event.target), resetColor = $tag.css('background-color');
        $tag.css('background-color', '#94D4F0');
        
        $tag.mouseout(function(event){
            $(event.target).css('background-color', resetColor)
                            .off('mouseout');
        });
    });
});