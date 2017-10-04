# cssExpCreator

获取被点击的HTML标签元素信息，生成指向该元素的css选择器表达式。

## 介绍

小js插件，该文件在example/js文件夹下，文件名为 cssExpCreator.js。

信息保存在一个数组对象内。数组内存放含有所需信息的对象（node）。

## 函数

* addNode ：传入一个jquery对象，返回一个对象（node）。
* clear ：无参数，用于清空数组。

## 对象内保存的信息

1. parentNum : 遍历到body元素总数
1. tagName : 元素标签名
1. content : 元素文本内容
1. href : 链接属性值
1. id : id属性值
1. className : class属性值
1. parent : 指向父节点对象
1. nthChild : 可用于判断是其父节点的第几个子元素
1. selector : 可能更优化的css选择器表达式
1. levelSelector : 完整的层级路径css选择器表达式
