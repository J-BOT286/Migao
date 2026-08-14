# 这不得瘦死 · iOS

这是原微信小程序的原生 SwiftUI 重写版，最低支持 iOS 16。

## 打开

用 Xcode 打开 `ZheBuDeShouSi.xcodeproj`，选择 iPhone 模拟器或真机后运行。第一次真机运行需要在 Xcode 的 Signing & Capabilities 中选择自己的 Apple Developer Team。

## 已包含

- 首页、趋势、我的三页底部导航
- 当前体重、目标进度、饮水和运动概览
- 体重原生双列 Wheel Picker，整数和小数分别滑动
- 居中的记录弹窗，饮食、饮水、运动和体重记录
- 趋势折线图、周期切换、统计和历史记录
- UserDefaults 本地保存体重、饮水、活动和趋势历史

当前目录没有安装完整 Xcode/iOS SDK，因此本环境只能完成 Swift 语法解析和工程文件校验；最终模拟器编译需要在安装了 Xcode 的 macOS 上执行。
