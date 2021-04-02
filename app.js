const http = require('http');
const processRequest = require('./server');
const {port,hostname} = require('./config').listenInfo;

const httpServer = http.createServer((req, res) => {
  processRequest(req, res);
})

httpServer.listen(port, hostname, () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});