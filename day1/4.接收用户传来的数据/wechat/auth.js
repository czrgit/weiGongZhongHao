const sha1 = require('sha1')
const config = require('../config')
const {getUserDataAsync, parseXMLAsync, formatMessage} = require('../utils/tool')
const template = require('./template')

module.exports = () => {
	return async (req, res, next) => {
		// console.log(req.query)

		const {nonce, timestamp, signature, echostr} = req.query

		const {token} = config

		//1.将微信参与加密的三个参数字典排序(timestamp,nonce,token)
		const sha1Str = sha1([timestamp, nonce, token].sort().join(''))
		//3.加密完成生成一个signature，和微信发来的进行比对


		if (req.method === 'GET') {
			if (sha1Str === signature) {
				//如果一样，返回echostr给微信服务器
				res.send(echostr)
			} else {
				//如果不一样，返回error
				res.end('error')
			}
		} else if (req.method === 'POST') {
			//再次验证消息来自于微信服务器
			if (sha1Str !== signature) {
				res.end('error')
			}
			// console.log(req.query)

			//接收请求体中的流式数据

			const xmlData = await getUserDataAsync(req)

			// console.log(xmlData);

			//把xml转为json对象

			const jsData = await parseXMLAsync(xmlData)

			// console.log(jsData);

			const message = formatMessage(jsData)


			//自定义返回对象

			let options = {
				toUserName: message.FromUserName,
				fromUserName: message.ToUserName,
				createTime: Date.now(),
				msgType: 'text'
			}
			/*用户的自动回复*/

			let content = '您在说什么？我听不懂！'

			if (message.MsgType === 'text') {
				//判断用户发送的内容具体是什么
				if (message.Content === '1') {//全匹配

					content = '请尽请吩咐妲己,主人~'

				} else if (message.Content === '2') {

					content = '努力做主人喜欢的事~'

				} else if (message.Content.match('爱')) {//半匹配

					content = '妲己一直爱主人，因为被设定成这样~'

				}
			}

			options.content = content
			// console.log(options)
			let replyMessage = template(options)
			//返回响应给微信服务器
			res.send(replyMessage)


			/*//如果开发者服务器没有返回响应给微信服务器，微信服务器会发送3次请求过来
			res.end('')*/
		} else {

			res.end('error')
		}

	}
}
