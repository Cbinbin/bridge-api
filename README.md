# bridge-api
A small bridge.

# 接口

# (admin)
## 管理员
### 新增管理员
```js
		POST    http://localhost:2017/admin
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
### 更改项目
* 1. 改图片
```js
		POST    http://localhost:2017/admin/project/:id/pic?token=${token}
```
* 2. 其他
```js
		PATCH    http://localhost:2017/admin/project/:id?token=${token}
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
### 更改进度时间
```js
		PATCH    http://localhost:2017/admin/project/:id/schedule?token=${token}
```
### 添加任务(分3类)
```js
		POST    http://localhost:2017/admin/project/:id/schedule/:part?token=${token}
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
### 查看项目详情
```js
		GET    http://localhost:2017/projecrt/:id
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