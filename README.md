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
### 更改信息
```js
		PATCH    http://localhost:2017/admin/user/:id?token=${token}
```
### 变更用户类型
```js
		PATCH    http://localhost:2017/admin/user/:id/mold?token=${token}
```
```js
{
	mold: ${mold}        //用户类型['user', 'customer', 'developer']
}
```
### 删除信息
```js
		DELETE    http://localhost:2017/admin/user/:id?token=${token}
```

### 客户
### 查看信息
```js
		GET    http://localhost:2017/admin/customer?token=${token}
```
### 更改信息
```js
		PATCH    http://localhost:2017/admin/customer/:id?token=${token}
```

## 开发者
### 查看信息
```js
		GET    http://localhost:2017/admin/developer?token=${token}
```
### 更改信息
```js
		PATCH    http://localhost:2017/admin/developer/:id?token=${token}
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
	// cycle: ${cycle},        //项目周期(Number)
	startDate: ${startDate},        //项目开始时间(Date)
	endDate: ${endDate},        //项目结束时间(Date)
	progression: ${progression}        //项目进度(String)
}
//可以不填字段自动生成
```
### 删除项目
```js
		DELETE    http://localhost:2017/admin/project/:id?token=${token}
```
返回=>  "message": "the project delete success"

### 更改项目
* 1. 改图片(上传)
```js
		POST    http://localhost:2017/admin/project/:id/pic?token=${token}
```
key: picture    
返回=>  项目    

* 2. 其他
```js
		PATCH    http://localhost:2017/admin/project/:id/change?token=${token}
```
```js
{
	title: "xxx",
	version: "xxx",
	// cycle: "xxx",        //自动计算
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
// 保存后，filename存的是上传时的文件名    
返回=>  
```js
{
	filename: "xxx",        //图片名(String)
	designUrl: "xxx"        //图片路径(String)
}
```
* 4. 删除设计图
```js
		DELETE    http://localhost:2017/admin/project/:id/design/:designId?token=${token}
```
返回=>  "message": "the design delete success"    
* 5. 添加开发文档
```js
		POST    http://localhost:2017/admin/project/:id/doc?token=${token}
```
```js
{
	writer: ${writer}        //文档(String)
}
```
    
* 6. 删除开发文档
```js
		DELETE    http://localhost:2017/admin/project/:id/doc/:docId?token=${token}
```
返回=>  "message": "the doc delete success"    

### 添加进度(时间及其他)
```js
		POST    http://localhost:2017/admin/project/:id/schedule?token=${token}
```
```js
{
	time1: ${time1},        //时间(Date)
	time2: ${time2},        //时间([Date, Date])
	time3: ${time3},        //时间([Date, Date])
	time4: ${time4},        //时间([Date, Date])
	time5: ${time5},        //时间(Date)
	// text1: ${text1},        //文案(String)
	// text2: ${text2},        //文案([String, String])
	// text3: ${text3},        //文案([String, String])
	// text4: ${text4},        //文案([String, String])
	// text5: ${text5},        //文案(String)
	// discussion1: ${discussion1},        //文案(String)
	// discussion2: ${discussion2},        //文案([String, String])
	// discussion3: ${discussion3},        //文案([String, String])
	// discussion4: ${discussion4},        //文案([String, String])
	// discussion5: ${discussion5},        //文案(String)
}
//eq.  Date格式可以为‘2017-2-14 16:16:16’    
//可以不填字段自动生成    
```
### 更改进度时间
```js
		PATCH    http://localhost:2017/admin/project/:id/schedule?token=${token}
```
```js
{
	t1: ${t1},        //时间(Date)
	t2: ${t2},
	t3: ${t3},
	t4: ${t4},
	t5: ${t5},
	t6: ${t6},
	t7: ${t7},
	t8: ${t8}
}
```
返回=>  进度    

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
		PATCH    http://localhost:2017/admin/project/schedule/task/:taskId?token=${token}
```
```js
{
	txt: ${txt},        //任务(String)
	completion: ${completion}        //完成状态(Boolean)
}
```
### 删除任务
```js
		DELETE    http://localhost:2017/admin/project/schedule/task/:taskId?token=${token}
```
返回=>  "message": "the task delete success"    

### 添加需求阶段内容
```js
		POST    http://localhost:2017/admin/project/:id/start?token=${token}
```
```js
{
	content: ${content}        //内容(String)
}
```
### 删除需求内容
```js
		DELETE    http://localhost:2017/admin/project/schedule/content/:contentId?token=${token}
```
返回=>  "message": "the content delete success"    

### 查看项目列表
```js
		GET    http://localhost:2017/admin/project?token=${token}
```
### 查看项目详情
```js
		GET    http://localhost:2017/admin/project/:id?token=${token}
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