# bridge-api
A small bridge.

# 接口

# (admin)
## 管理员
### 新增管理员
```js
		POST    http://localhost:2017/reg?pass=${pass}
```
```js
{
	admin: ${admin},
	password: ${password}
}
```
### 登录
```js
		POST    http://localhost:2017/login
```
```js
{
	admin: "xxx",
	password: "password"
}
```
### 删除管理员
```js
		DELETE    http://localhost:2017/admin/:id?token=${token}
```
### 查看管理员
```js
		GET    http://localhost:2017/admin?token=${token}
```
## 用户
### 查看信息
```js
		GET    http://localhost:2017/admin/user?token=${token}
```
### 删除信息
```js
		DELETE    http://localhost:2017/admin/user/:id?token=${token}
```
## 客户
### 新增
```js
		POST    http://localhost:2017/admin/customer?token=${token}
```
### 更改信息
1. 改图片
```js
		POST    http://localhost:2017/admin/customer/:id/img?token=${token}
```
2. 其他
```js
		PATCH    http://localhost:2017/admin/customer/:id?token=${token}
```
### 删除信息
```js
		DELETE    http://localhost:2017/admin/customer/:id?token=${token}
```
## 开发者
### 新增
```js
		POST    http://localhost:2017/admin/developer?token=${token}
```
### 更改信息
1. 改图片
```js
		POST    http://localhost:2017/admin/developer/:id/img?token=${token}
```
2. 其他
```js
		PATCH    http://localhost:2017/admin/developer/:id?token=${token}
```
### 删除信息
```js
		DELETE    http://localhost:2017/admin/developer/:id?token=${token}
```
## 项目
### 添加项目
```js
		POST    http://localhost:2017/admin/project?token=${token}
```
```js
{
	title: ${title},        //项目名称(String)
	version: ${version},        //项目版本(String)
	picture: ${picture},        //项目图片(String)
	cycle: ${cycle},        //项目周期(Number)
	startDate: ${startDate},        //项目开始时间(Date)
	endDate: ${endDate},        //项目结束时间(Date)
	progression: ${progression}        //项目进度(String)
}
//可以不填字段自动生成
```

### 更改项目
* 1. 改图片(上传)
```js
		POST    http://localhost:2017/admin/project/:id/pic?token=${token}
```
key: picture
* 2. 其他
```js
		PATCH    http://localhost:2017/admin/project/:id/change?token=${token}
```
```js
{
	title: "xxx",
	version: "xxx",
	cycle: "xxx",
	startDate: "xxx",
	endDate: "xxx",
	progression: "xxx"
	//(可选项更改)
}
```
* 3. 添加设计图
```js
		POST    http://localhost:2017/admin/project/:id/design?token=${token}
```
* 4. 删除设计图
```js
		DELETE    http://localhost:2017/admin/project/:projectId/design/:designId?token=${token}
```
### 添加进度时间
```js
		POST    http://localhost:2017/admin/project/:id/schedule?token=${token}
```
```js
{
	time1: ${time1},        //时间(Date)
	time2: ${time2},        //时间([Date, Date])
	time3: ${time3},        //时间([Date, Date])
	time4: ${time4},        //时间([Date, Date])
	time5: ${time5}        //时间(Date)
}
//eq.  Date格式可以为‘2017-2-14 16:16:16’    
//可以不填字段自动生成    
```
### 更改进度时间
```js
		PATCH    http://localhost:2017/admin/project/:id/schedule?token=${token}
```
### 添加任务栏(分3类)
```js
		POST    http://localhost:2017/admin/project/:id/schedule/:part?token=${token}
```
part: frontEnd || backstage || backEnd 
```js
{
	txt: ${txt},        //任务(String)
	completion: ${completion}        //完成状态(Boolean)
}
```
### 添加任务
```js
		POST    http://localhost:2017/admin/project/schedule/:barid/task?token=${token}
```
barid为上一步添加任务栏返回的Id
```js
{
	txt: ${txt},        //任务(String)
	completion: ${completion}        //完成状态(Boolean)
}
```
### 更改任务
```js
		PATCH    http://localhost:2017/admin/project/schedule/:id/task?token=${token}
```
### 查看项目列表
```js
		GET    http://localhost:2017/admin/project?token=${token}
```
### 查看项目详情
```js
		GET    http://localhost:2017/admin/project/:id?token=${token}
```
### 删除项目
```js
		DELETE    http://localhost:2017/admin/project/:id?token=${token}
```



# (bridge)
## 用户
### 授权登录
```js
		POST    http://localhost:2017/session?code=${code}&iv=${iv}&encryptedData=${encryptedData}
```
## 项目
### 查看项目列表
```js
		GET    http://localhost:2017/projecrt
```
返回=>
```js
{
	"_id": "xxx",        //
	"title": "xxx",        //项目名称
	"version": "xxx",        //项目版本
	"picture": "xxx",        //项目图片
	"cycle": 0,        //项目周期
	"startDate": "xxx",        //项目开始时间
	"endDate": "xxx",        //项目结束时间
	"progression": "xxx",        //项目进度
	"possessor": "xxx",        //客户
	"schedule": "xxx",        //进度表
	"developers": {        //开发者
		"backEnd": [],        //后端
		"backstage": [],        //后台管理
		"frontEnd": []        //前端
	}
}
```

### 查看项目详情
```js
		GET    http://localhost:2017/projecrt/:id
```
返回=>
```js
{
	......
	"schedule": {
		"_id": "xxx",
		"finish": {        //已完成
			"text": "该项目已完结。",
			"discussion": "如需修改或添加功能，将在下一版本中更新。",
			"time": [
				"xxx",
				"Invalid date"
			]
		},
		"check": {        //验收中
			"text": "该项目已部署上线。",
			"discussion": "xxx",
			"time": [
				"xxx",
				"xxx"
			]
		},
		"going": {        //开发阶段
			"text": "该项目已进入代码开发阶段。",
			"taskbars": {
				"frontEnd": "xxx",
				"backstage": "xxx",
				"backEnd": "xxx"
			},
			"time": [
				"xxx",
				"xxx"
			]
		},
		"start": {        //需求阶段
			"text": "该项目已经正式启动。",
			"discussion": "该阶段包括以下工作内容：",
			"tasks": {
				"txt1": "xxx",
				"txt2": "xxx",
				"txt3": "xxx",
				"txt4": "xxx",
				"txt5": "xxx",
				"txt6": "xxx"
			},
			"time": [
				"xxx",
				"xxx"
			]
		},
		"pending": {        //待处理
			"text": "该项目暂未开始，待处理。",
			"discussion": "xxx",
			"time": [
				"xxx",
				"xxx"
			]
		}
	},
	......
}
```

### 查看设计图
```js
		GET    http://localhost:2017/projecrt/:id/design
```
### 查看开发文档
```js
		GET    http://localhost:2017/projecrt/:id/document
```
### 查看阶段详情
```js
		GET    http://localhost:2017/projecrt/:id/schedule
```
## 开发者
### 查看开发者列表
```js
		GET    http://localhost:2017/projecrt/:id/developer
```
### 查看开发者信息(客户)
```js
		GET    http://localhost:2017/developer/:id?userid=${openid}
```
### 查看开发者信息(开发者)
```js
		GET    http://localhost:2017/developer/:id?userid=${openid}
```
### 更改开发者信息(开发者)
```js
		PATCH    http://localhost:2017/developer/:id?userid=${openid}
```
### 更改开发者状态(开发者)
```js
		PATCH    http://localhost:2017/developer/:id/status?userid=${openid}
```