## demo

在线预览：[小琳音乐站](https://hyl999.co:85/hot)

源码：https://gitee.com/mind251314/hyl-music

## 介绍

身为一个爱听歌的前端，只要写起代码耳机必需放着 bgm 伴奏。就在前几天我突发奇想，我能不能做个自己的音乐 app 玩玩。

说干就干，在百度上找到了一个[网易云的 api 文档](https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=neteasecloudmusicapi)。 这个文档是一个 node 项目，利用跨站请求伪造 (CSRF), 伪造请求头 , 调用官方 API。

我将项目放到我的服务器上通过 pm2 运行起来，至此后端服务就搞定了。

前端采用**react-umi+antd-moblie**技术栈，目前做出了**热门歌曲、歌手、搜索**三个主要模块。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c05e2acb950a43749c4c6f21be356899~tplv-k3u1fbpfcp-watermark.image?)

但其实最复杂的地方是播放器，包括**播放/暂停，上一曲/下一曲，进度条，歌词**这些东西都需要自己设计，也算是系统的学习了一下原生 audio 对象。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5efa2171427049b1b3ee771985f012e8~tplv-k3u1fbpfcp-watermark.image?)

由于是 react，所以主要用 redux 管理全局状态，useEffect 监听 audio 的属性来及时通知视图更新。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1fcb46f489f34e4d979cacdb45d79305~tplv-k3u1fbpfcp-watermark.image?)

## 补充

由于是调了网易云的后台，一些 vip 歌曲本来只能试听 30 秒。但我已经 csrf 了,所以 vip 歌曲也是可以随便听滴
