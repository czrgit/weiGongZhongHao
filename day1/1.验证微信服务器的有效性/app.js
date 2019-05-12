//引入express 对象
const express = require('express')
const sha1 = require('sha1')
//创建app对象

const app = express()

//定义配置对象
const config = {
	token: 'CHENzhirong123',
	appID: 'wx73ee28908eaff02a',
	appsecret: '792ca474c46f31bca1673f91327e0d2e'
}

//验证服务器的有效性
/*
* { signature: 'f39d26a4c72baa49b523e10caa835520fa5bdd9d',
  echostr: '4738860727488380107',
  timestamp: '1557559435',
  nonce: '1100387215' }*/

//接收所有消息
app.use((req, res, next) => {
	console.log(req.query)

	const {nonce,timestamp,signature,echostr} = req.query

	const {token} = config

	//1.将微信参与加密的三个参数字典排序(timestamp,nonce,token)

	const arr = [timestamp,nonce,token]
	const arrSort = arr.sort()
	//2.将数组中的所有参数拼接成一个字符串，进行sha1加密
	const str = arrSort.join('')
	const sha1Str = sha1(str)
	console.log(sha1Str);

	//3.加密完成生成一个signature，和微信发来的进行比对

	if(sha1Str===signature){
		//如果一样，返回echostr给微信服务器
		res.send(echostr)
	}else {
		//如果不一样，返回error
		res.end('error')
	}
})

//监听端口号
app.listen(3000, () => console.log('服务器启动成功'))
