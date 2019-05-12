/*
获取acess_token思路


* 读取本地文件
* 	-本地有文件
* 		-判断是否过期
* 			-过期
* 				重新获取，覆盖以前的文件
* 			-没过期
* 				直接使用
* 	-本地没有
* 		-发送获取请求，保存到本地文件
*
*
* */

const {appID, appsecret} = require('../config')

//只需要引入request-promise-native
const rq = require('request-promise-native')

//写入文件，和读取文件
const {writeFile, readFile} = require('fs')

class Wechat {
	constructor() {

	}

	/*
	* 获取access_token
	* */

	getAccessToken() {
		//得到地址
		const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`

		return new Promise((resolve, reject) => {
			//发送请求
			rq({
				method: 'GET',
				url,
				json: true
			})
				.then(res => {

					/*{
						access_token: '21_BhrtDiip8xo0AvkVZNNhvq5NPa1grltlBYT19adtMLQr7bbdBU5KyezTEgk6hjTS5mp7RGW6jyIXm7TdgWeePk3M6Ns4_eLiyzinieRcj89387wqUWwqpvuy--0ESyJGBI7wuK3wVBEwGUQDKNSdAIAVYD',
						expires_in: 7200
					}*/
					console.log(res)

					//设置access_token的过期时间
					res.expires_in = Date.now() + (res.expires_in - 300) * 1000
					//将promise对象改为成功
					resolve(res)
				})
				.catch(err => {
					console.log(err);
					//将promise对象改为失败
					reject(err)
				})
		})
	}

	/*
	* 保存saveAccessToken(accessToken)
	* */
	saveAccessToken(accessToken) {
		//将accessSToken转为json字符出
		accessToken = JSON.stringify(accessToken)

		//将accessToken保存下来

		return new Promise((resolve, reject) => {
			writeFile('./accessToken.txt', accessToken, err => {
				if (!err) {
					console.log('文件保存成功')
					resolve()
				} else {
					reject('saveAccessToken方法出错' + err)
				}
			})
		})
	}

	/*
	* 保存saveAccessToken()
	* */
	readAccessToken() {

		//读取accessToken

		return new Promise((resolve, reject) => {
			readFile('./accessToken.txt', (err, data) => {
				if (!err) {
					console.log('文件读取成功')
					//将data转为json对象
					data = JSON.parse(data)
					resolve(data)
				} else {
					reject('readAccessToken方法出错' + err)
				}
			})
		})
	}

	/*
	* 用来检测access_token是否有效
	* */

	isValidAccessToken(data) {
		//检测传入的参数是否有效
		if (!data && !data.access_token && !data.expires_in) {
			//代表access_token无效
			return false
		}

		//检测是否在有效期内

		return data.expires_in > Date.now()
	}

	/*
	* fetchAccessToken()
	* 返回access_token值
	*
	* */
	fetchAccessToken() {

		if(this.access_token&&this.expires_in&&this.isValidAccessToken(this)){
			//说明之前保存过，并access_token有效
			return Promise.resolve({
				access_token : this.access_token,
				expires_in : this.expires_in
			})
		}
		//是fetchAccessToken的返回值

		return this.readAccessToken()
			.then(async res => {
				//有文件
				//判断是否过期
				if (this.isValidAccessToken(res)) {
					//有效的
					// resolve(res)
					return Promise.resolve(res)
				} else {
					//过期的
					//发送请求获取access_token getAccessToken()
					const res = await this.getAccessToken()
					//请求成功,保存到本地，使用saveAccessToken()
					await this.saveAccessToken(res)
					// resolve(res)
					return Promise.resolve(res)
				}
			})
			.catch(async err => {
				//没有文件
				//发送请求获取access_token getAccessToken()
				const res = await this.getAccessToken()
				//请求成功,保存到本地，使用saveAccessToken()
				await this.saveAccessToken(res)
				// resolve(res)
				return Promise.resolve(res)
			})
			.then(res => {
				//将access_token挂载到this
				this.access_token = res.access_token
				this.expires_in = res.expires_in

				//返回res包装一层promise对象（此对象为成功）
				//是this.readAccessToken的返回值
				return Promise.resolve(res)
			})
	}
}

/*模拟测试*/
const w = new Wechat()


