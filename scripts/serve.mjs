import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('site');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.woff2':'font/woff2','.svg':'image/svg+xml','.json':'application/json; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
  try {
    let url=new URL(req.url,'http://localhost');
    const file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    if(!(await stat(file)).isFile()){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}).end(await readFile(file));
  }catch{res.writeHead(404).end('Not found');}
});
server.listen(Number(process.env.PORT||4177),'127.0.0.1',()=>console.log('Glass Atlas: http://127.0.0.1:'+server.address().port));
