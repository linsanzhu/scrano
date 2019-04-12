> ### What is scrano

scrano 是一个用js编写,模仿python scrapy的爬虫框架,它在使用方法上力求与scrapy一致,让用户将注意力集中于如何解析网页,以及如何存储解析到的数据,而不用在意如何发送请求。
> ### Install

```
npm install -g scrano
```

> ### Usage

- 创建项目

首先进入任意的你想存放项目的文件夹,随后执行

    scrano genproject <project_name>

其中project_name是你的项目名
执行以上命令后,scrano会在当前目录生成一个用你传入的项目名命名的项目
这里需要注意:
**我们安装的scrano是在全局的,所以为了能在当前项目引入scrano,需要执行**

    npm link scrano 

来将scrano连接到当前项目中

- 创建spider

你可以使用scrano内置的命令在当前项目生成一个spider,进入项目目录执行:

    scrano genspider <spider_name>

这条命令仅仅是在当前项目添加一个spider文件,为了能够使用这个spider,你还需要手动在config.js文件中的SPIDER_MODULES项目下添加响应条目,其中键是spider的名字,用于crawl命令,值是该spider的类名

- 开始爬取

当你编写好spider以后,就可以执行

    scrano crawl <spider_name>

来启动抓取流程,这里需要注意, spider_name是你在配置文件中在SPIDER_MODULES中写入的键


