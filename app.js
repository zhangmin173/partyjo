const fs = require('fs')
const path = require('path')
const Express = require('express')
const app = Express()
const httpProxyMiddleware = require('http-proxy-middleware')
const port = 2222
const mock = require('./mock')

app.use(Express.static('./online-new/'));


// app.use(httpProxyMiddleware('/partyjo-web', {
//   target: 'http://wechat.nextdog.cc/',
//   changeOrigin: true
// }));

// app.use(httpProxyMiddleware('/api', {
//   target: 'http://wechat.nextdog.cc/partyjo-web/123/',
//   changeOrigin: true
// }));

const apiProxy = httpProxyMiddleware('/api', {
  target: 'http://wechat.nextdog.cc/partyjo-web',
  changeOrigin: true
})

app.use('/api/*', apiProxy)

app.all('*', (req, res) => {
  const filePath = path.join(__dirname, './online-new/' + req.path)
  if (fs.existsSync(filePath)) {
    console.log(req.path)
    res.send(fs.readFileSync(filePath, 'utf-8'))
  } else {
    res.send('hello world')
  }
});

app.listen(port, () => { console.log(`listen at port ${port}`)})