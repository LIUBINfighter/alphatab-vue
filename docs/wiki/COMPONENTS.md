# 组件文档

## 控制组件

### MetronomeButton
节拍器开关按钮

#### Props
无

#### Events
- click: 切换节拍器状态

#### 使用示例
```vue
<MetronomeButton />
```
### CountInButton
倒计时按钮

#### Props
无

#### Events
- click: 切换倒计时状态

### LayoutControl
布局控制组件

#### Props
- value: 当前布局模式
- options: 可选布局模式数组

#### Events
- input: 布局模式变更事件

### ZoomControl
缩放控制组件

#### Props
- value: 当前缩放比例
- min: 最小缩放比例
- max: 最大缩放比例
- step: 缩放步长

#### Events
- input: 缩放比例变更事件

### PrintButton
打印按钮

#### Props
无

#### Events
- click: 触发打印操作

### LoopButton
循环播放按钮

#### Props
- active: 是否激活循环

#### Events
### PlayPauseButton
播放/暂停切换按钮

#### 状态
- playerState: 
  - 0: 停止状态
  - 1: 播放中
  - 2: 暂停中

#### 功能
- 点击切换播放/暂停状态
- 自动根据播放器状态更新图标
- 乐谱未加载时自动禁用

#### 使用示例
### StopButton
停止播放按钮

#### 功能
- 点击停止当前播放
- 乐谱未加载时自动禁用

#### 使用示例
```vue
<StopButton />
```
```vue
<PlayPauseButton />
```
- click: 切换循环状态