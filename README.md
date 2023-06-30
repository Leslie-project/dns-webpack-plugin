# dns-webpack-plugin
前端项目dns优化webpack插件

### Author
LiaoXF  [Github](https://github.com/Leslie-project)

### description
本插件用于检索打包之后的资源，找出所有的url，进行一个dns预解析

### example
+ npm下载插件
```
npm install dns-webpack-plugin --save-dev
```

+ 导入插件
*webpack.config.js，vue.config.js*
``` JavaScript
const DnsWebpackPlugin = require("dns-webpack-plugin")
......
plugins:[
	new DnsWebpackPlugin()
]
```

+ 查看插件作用后效果 查看打包后的*index.html*
``` html
<link rel="dns-prefetch" href="https://xxx.xxx.com">
```


### version 
+ v1.0.0
	插件第一次发版，保证了基本功能

+ v1.0.2
	+ 新增参数as*用于是否重命名输出文件*
	+ 新增ts支持

+ v1.0.3
	+ 新增参数exclude*用于筛除数组里边自定义的文件类型*
	+ 新增参数dns*用于将传入的dns加入预解析中*
	+ 更新依赖包glob
	+ 删除一些输出
