const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json'};
http.createServer((req,res)=>{
  let pathname;
  try { pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400);return res.end(); }
  const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)||pathname.includes('/.')||pathname.startsWith('/node_modules/')){res.writeHead(403);return res.end();}
  fs.readFile(file,(error,data)=>{res.writeHead(error?404:200,{'Content-Type':mime[path.extname(file)]||'text/plain'});res.end(error?'Nicht gefunden':data);});
}).listen(8080,'127.0.0.1',()=>console.log('Hallo Mehrweg: http://127.0.0.1:8080'));
