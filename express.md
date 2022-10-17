# express 文档

```js
app.get("/", (req, res) => {
  //
});
```

## 了解基本概念 request 、 response

request （请求对象）

- app 当 callback 为外部文件时，用 req.app 访问 express 实例
- baseUrl 获取路由当前安装的 URL 路径
- body 获取情趣主体
- cookies 获取 cookies
- refresh/stale 请求是否还新鲜
- hostname / ip 请求 IP
- originalUrl 获取原始请求 URL
- params 获取路由的 params
- path 获取请求路径
- protocol 获取协议类型
- query 获取 URL 的查询参数串
- route 获取当前匹配的路由
- subdomains 获取子域名
- accepts 获取可接受的 文档类型

response HTTP 响应

- append() 追加 http 头
- set() 在 append() 后重置之前的头
- cookie(name, value) 设置 cookie
- option: domain/expires/httpOnly/maxAge/path/secure/signed
- clearCookie (清除 cookie)
- download() 传送指定文件路径
- get 返回指定的 http 头
- json 传送 JSON 响应
- jsonp 传送 jsonp 响应
- location() 只设置了响应 Location HTTP 头，不设置状态码或者 close response
- redirect() 设置了对应 Localtion HTTP 头，并且设置状态吗 302
- send() 传送 HTTP 响应
- status() 设置 HTTP 状态码
- type() 设置 Content-Type 的 MIME 类型

## 路由

```js
const app = express();

app.get("/", () => {});
app.post("/", () => {});
```

## 静态文件
```js
app.use('/public', express.static('public'))
```