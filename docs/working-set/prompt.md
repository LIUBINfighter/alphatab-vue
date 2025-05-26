遍历 @/src ，解析当前各个视图和组件的管理方式和父子关系
在 @/docs/wiki 目录下撰写相关内容，包括：
1.视图管理
2.组件层级
3.每一个组件的定制化
4.样式管理方案
每一个代码文件或者架构都要新建一个markdown文件
然后将这个文件挂载到 @/docs/.vitepress/config.mts 的 wiki 文件夹对应 目录下

也就是你在做任务拆分的时候，每一个任务包含：定位代码文件，查看相关代码文件（如果需要）书写markdown文档以及挂载文档到目录边栏

最后一个任务是检查 @/docs/.vitepress/config.mts 是否包含了所有新增的markdown文件

最后应该返回在 docs/wiki/下的markdown文件以及写好的 config.mts