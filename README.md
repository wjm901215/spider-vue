## garbage-vue 
#### 流程(开发test)
1. 安装依赖文件:`npm i` 或者 `cnpm i`
2. 启动:`npm run dev`
3. 开发注意事项
    * 单个页面的样式请勿写在全局样式中
    * 通用组件放在**src/components**下
    * 通用页面放在**src/views/common**下
    * 建议使用**less**和**sass**格式书写样式
    * 一个页面模块单独占一个文件夹,主页面使用**index.vue**命名,对应样式名称**index.less**附属页面占同一个文件夹
    * 页面和对应的样式文件应同名,如**add-or-update.vue**对应**add-or-update.less**
    * 函数名应该名如其义,禁止只用中文,拼音作为文件名,变量名
    * 使用es6语法书写函数可以避免this作用域问题
    * 引用图片资源不宜过大,避免浏览器预加载时间过长
    * 非必要请勿使用js操作dom
    * 请勿引用其他类似jquery,react,angular等技术框架
    * 项目使用element-ui开发,请勿使用其他ui框架
    * 新增的svg图标放在 assets/svg/extension目录下
4. 相关技术点/框架
    * vue [官网]('https://vuejs.org/')
    * vuex [官网]('https://vuex.vuejs.org/')
    * element-ui [官网]('https://element.eleme.io/#/zh-CN')
    * scss
    * less
    * axios
    * es6    
####流程(打包)
1. 安装赖文件:`npm i` 或者 `cnpm i`
2. 打包:`npm run build`
### 常用配置项
* 后台请求接口配置:`修改.env 文件 VUE_APP_BASE_URL 值`
* 启动端口配置(`端口默认8080,如果被占用会自动选择其他空闲端口号`)
  
****
#### 项目结构(src)
* api:请求
    * common 通用请求
    * 其他模块
* assets:静态资源文件
    * icon:svg图标资源
    * img:图片资源
    * scss:全局样式
* components:组件
* i18n:国际化(internationalization)
   * lang:语言包
* icons:图标
* mock:mock请求拦截
* router:路由
* store:vuex-store
* utils:常用函数集合
* vendor:纯前端导入导出依赖
* views:视图
   * common:通用模块(404 login setting mixin)
   * modules:模块
       * home:首页
       * job:定时任务
       * map:地图
       * sys:系统设置

****
#### 注意
  * 建议使用WebStorm开发
  * 若有新建模块，请即使更新项目结构说明
  * 项目依赖node环境及npm，请安装node以及npm(官网最新稳定版)
  * 使用bash命令cp拷贝项目时不会复制 **.** 开头的隐藏文件,会导致启动报错
  
#### 提交相关



```bash
#以从远程分支拉取/更新
git pull origin master
# 添加到版本管理
git add 文件名/文件夹
# 提交到本地
git commit 文件名/文件夹
# 提交到远程分支
git push origin master  
```  
    





