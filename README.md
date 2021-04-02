# 简单的静态文件服务器
## 1 功能
运行如下命令
```js
node app.js
```
然后进入`http://127.0.0.1:3006`即可查看当前拥有的文件 控制台会显示查看的文件名 并在线显示 支持多种文件类型。

## 2 解决的问题
### 2.1 中文的URL 无法识别 造成404
```js
pathName = decodeURI(pathName);//可将URL中的文件名解码 然后再进行读取即可找到
```
### 2.2 中文内容乱码的问题
```js
//头部信息加入 charset=utf-8 也就是告诉浏览器也utf-8格式读取接收到的数据 
//可正常显示中文
const headers = {
  'Content-Type': 'text/plain; charset=utf-8',//解决中文乱码 设置头为utf-8格式读取
}
//当需要读取其他类型文件时 
headers['Content-Type'] = mime[ext] ||'text/plain';//获取显示的内容类型
headers['Content-Type'] += '; charset=utf-8';//设置以utf-8读取
```
