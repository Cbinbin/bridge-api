const router = require('express').Router()
	, request = require('superagent')
	, jwt = require('jsonwebtoken')
	, wxApis = require('../utils/wxApis')
	, WXBizDataCrypt = require('../utils/WXBizDataCrypt')
	, User = require('../models/User')

function setinfo(openid, nickname, sex, headpic, origin, res) {
	User.findOne({openid: openid})
	.exec((err, same)=> {
		if(same) {
			console.log(same)
			jwt.sign(
				{uId: same._id, opId: same.openid},
				'newteo', 
				{expiresIn: '7d'}, 
				(err, token)=> {
					if(err) return res.send(err)
					res.send({token: token})
				}
			)
		} else {
			const info = new User({
				openid: openid,
				nickname: nickname,
				sex: sex,
				head_pic: headpic,
				origin: origin,
				mold: 'ordinary'
			})
			info.save((err)=> {
				if(err) return res.send(err)
				jwt.sign(
					{uId: info._id, opId: info.openid},
					'newteo', 
					{expiresIn: '7d'}, 
					(err, token)=> {
						if(err) return res.send(err)
						res.send({token: token})
					}
				)
			})
		}
	})
}

router.get('/', (req, res)=> {
	const code = req.query.code
	, iv = req.query.iv 
	, encryptedData = req.query.encryptedData
	, xcxId = process.env.XCX_ID
	, xcxSecret = process.env.XCX_SECRET
	if (!code || !iv || !encryptedData)
		return res.send({message: 'Missing Query String!'})
	request.get(`${wxApis.session}?appid=${xcxId}&secret=${xcxSecret}&js_code=${code}&grant_type=authorization_code`)
	.end((err, result)=> {
		if(!JSON.parse(result.text).errcode) {
			const sessionKey = JSON.parse(result.text).session_key
			const pc = new WXBizDataCrypt(xcxId, sessionKey)
			const wxInfo = pc.decryptData(encryptedData, iv)
			console.log(wxInfo)
			setinfo(wxInfo.openId, wxInfo.nickName, wxInfo.gender, wxInfo.avatarUrl, res)
		} else res.send(result.text)
	})
})

module.exports = router