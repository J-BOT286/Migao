# 这不得瘦死 · iOS / iPadOS / macOS

这是原微信小程序的原生 SwiftUI 重写版，最低支持 iOS 26、iPadOS 26 和 macOS 26。

## 打开

用 Xcode 打开 `ZheBuDeShouSi.xcodeproj`，选择 iPhone/iPad 模拟器、真机或 Mac 后运行。第一次真机运行需要在 Xcode 的 Signing & Capabilities 中选择自己的 Apple Developer Team。

## 已包含

- 首页、趋势、我的三页底部导航
- 当前体重、目标进度、饮水和运动概览
- 体重原生双列 Wheel Picker，整数和小数分别滑动
- 居中的记录弹窗，饮食、饮水、运动和体重记录
- 趋势折线图、周期切换、统计和历史记录
- UserDefaults 本地保存体重、饮水、活动和趋势历史

macOS 版本使用原生 SwiftUI 窗口运行，输入框会自动使用 macOS 的文本输入行为；iOS/iPadOS 版本保留数字键盘和滚轮选择器交互。iPadOS 和 macOS 会将主要内容限制在居中的宽度内，便于宽屏阅读。
