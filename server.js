const fs = require('fs');
const url = require('url');
const path = require('path');
const mime = require('./mime');//文件格式
const headers = {
  'access-control-allow-headers':'*',
  'Content-Type': 'text/plain; charset=utf-8',//解决中文乱码 设置头为utf-8格式读取
}

const processRequest = (request, response) => {
  //let pathName = url.parse(request.url).pathname
  let baseUrl = 'http://'+request.headers.host;
  let pathName = new URL(baseUrl + request.url).pathname;//获取文件名
  // 解码 防止中文名产生乱码
  pathName = decodeURI(pathName);
  console.log('access: '+ pathName);
  // 获取资源文件的绝对路径 path.resolve([…paths])里的每个参数都类似在当前目录执行一个cd操作，从左到右执行，返回的是最后的当前目录，
  let filePath = path.resolve(__dirname,'.'+pathName);

  // 文件后缀名
  let ext = path.extname(pathName);//返回的是最后一个点及其后面的内容
  ext = ext ? ext.slice(1) : 'unknown';//若不空 则去除点
  // 未知类型一律用 "text/plain" 类型
  headers['Content-Type'] = mime[ext] ||'text/plain';
  headers['Content-Type'] += '; charset=utf-8';
  
  //获得文件的状态 文件和文件夹分别操作
  fs.stat(filePath, (err, stats) => {
    // 未找到文件
    if (err) {
      headers['Content-Type'] = 'text/html; charset=utf-8';
      response.writeHead(404, headers);
      response.end("<h1>404 Not Found</h1>");
      return;
    }
    //若为文件 则读取 并显示
    if (stats.isFile()) {
      fs.readFile(filePath,(err, data) => {// 异步读取
        if (err) {
          response.writeHead(500, headers);
          response.end('<h1>500 Server Error</h1>');
          return;
        }
        response.writeHead(200, headers);
        response.end(data);//读取后的data为buff 显示出来时 可以设置读取格式(在header上设置)
      }); 
    }
      
    //若为目录 则以html格式读取
    if (stats.isDirectory()) {
      let html = '<head><meta charset="utf-8" /></head>';
      fs.readdir(filePath, (err, files) => {
        if (err) {
          html += `<div>读取路径失败！</div>`;
          response.writeHead(404, headers);
          response.end(html);
          return;
        } 
        headers['Content-Type'] = 'text/html; charset=utf-8';
        response.writeHead(200, headers);
        for (var file of files) {//读取文件夹内的内容
          if(pathName=='/'){//若当前为根目录
            html += `<h2> <a href="${pathName}${file}">${file}</a> </h2>`;
          }
          else html += `<h2> <a href="${pathName}/${file}">${file}</a> </h2>`;
        }
        response.end(html);
      })
    }
  })
}

module.exports = processRequest;