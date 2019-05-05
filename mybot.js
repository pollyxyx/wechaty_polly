const { Wechaty,Friendship,Message } = require('wechaty')
const QrcodeTeminal = require('qrcode-terminal')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.json({limit:'20mb'})) //设置前端post提交最大内容
app.use(bodyParser.urlencoded({limit:'20mb',extended:false}))
app.use(bodyParser.text())
app.get('/',function(req,res){
	res.send('hello')
})
app.listen(8888,()=>{
	console.log('Example app listening on port 8888!') //开启监听端口8888 localhost
})
Wechaty.instance()
.on('scan', (url, code) => {
	console.log(`Scan QR Code to login: ${code}\n${url}`)//二维码
	if (!(/201|200/).test(String(code))){
		const loginUrl = url.replace(/\/qrcode\//,'/l/')
		QrcodeTeminal.generate(loginUrl)
	}
})
.on('login',  user => console.log(`微信助理${user.name()} 登录`))//登录
//.on('logout', user => console.log(`${user.name()}登出`))//登出

//.on('message',  message => console.log(`Message: ${message.content()}`))
// 自动加好友功能
.on('friendship',async(contact,request) => {
  let logMsg
  try {
    logMsg = '添加好友' + contact.name()
    console.log(logMsg)

    switch (contact.type()) {
      case Friendship.Type.Receive:
        if (/你好，我是|加群|好友推荐|推荐/i.test(request.hello())) {
          logMsg = '自动添加好友，关键字推荐'
          await contact.accept()
        } else {
          logMsg = '没有通过验证 ' + request.hello()
        }
        break
            case Friendship.Type.Confirm:
        logMsg = 'friend ship confirmed with ' + contact.name()
        break
    }
  } catch (e) {
    logMsg = e.message
  }
  console.log(logMsg)
})
//自动回复消息
.on('Message',async(msg)=>{
const user = msg.from() //用户
const text = msg.text() //消息
const qun  = msg.room() //是否为群消息
if(qun){
	console.log(`群名：${room.topic()}发消息的人：${user.name()}消息内容：${text}`)
}else{
	console.log(`发消息的人：${user.name()}消息内容：${text}`)
}
if (msg.self()){
	return
}
})
.init()

