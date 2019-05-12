/*
* 工具包函数
*
* */

const {parseString} = require('xml2js')
module.exports = {
	getUserDataAsync(req) {
		return new Promise((resolve, reject) => {
			let xmlData = ''
			req
				.on('data', data => {
					//当流式数据传递过来会触发该事件
					// console.log(data)
					//读取的数据是buffer
					xmlData += data.toString()
					// xmlData += data
				})
				.on('end', () => {
					//当数据接收完后
					resolve(xmlData)
				})
		})
	},
	parseXMLAsync(xmlData) {
		return new Promise((resolve, reject) => {
			parseString(xmlData, {trim: true}, (err, data) => {
				if (!err) {
					resolve(data)
				} else {
					reject('parseXMLAsync有误' + err)
				}
			})
		})
	},
	formatMessage(jsData) {
		let message = {}
		//获取xml对象
		jsData = jsData.xml

		//判断是否为对象
		if (typeof jsData === 'object') {
			//遍历对象
			for (let key in jsData) {
				//获取属性值
				let value = jsData[key]

				// //过滤空数据
				if (Array.isArray(value) && value.length > 0) {
					//将合法数据复制到message中'
					// console.log(value[0])
					message[key] = value[0]
				}
			}
		}

		return message
	}
}
