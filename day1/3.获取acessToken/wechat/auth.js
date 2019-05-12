const sha1 = require('sha1')
const config = require('../config')
module.exports = () => {
	return (req, res, next) => {
		console.log(req.query)

		const {nonce, timestamp, signature, echostr} = req.query

		const {token} = config

		//1.将微信参与加密的三个参数字典排序(timestamp,nonce,token)

		const arr = [timestamp, nonce, token]
		const arrSort = arr.sort()
		//2.将数组中的所有参数拼接成一个字符串，进行sha1加密
		const str = arrSort.join('')
		const sha1Str = sha1(str)
		console.log(sha1Str);

		//3.加密完成生成一个signature，和微信发来的进行比对

		if (sha1Str === signature) {
			//如果一样，返回echostr给微信服务器
			res.send(echostr)
		} else {
			//如果不一样，返回error
			res.end('error')
		}
	}
}
