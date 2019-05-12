//引入express 对象
const express = require('express')
const auth = require('./wechat/auth')
//创建app对象

const app = express()

//接收所有消息
app.use(auth())

//监听端口号
app.listen(3000, () => console.log('服务器启动成功'))
