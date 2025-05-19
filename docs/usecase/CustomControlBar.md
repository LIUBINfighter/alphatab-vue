# SimpleDisplay组件ControlBar自定义使用指南

## 基本用法

默认情况下，SimpleDisplay会显示ControlBar的所有功能组件：

```vue
<template>
  <SimpleDisplay />
</template>
```

## 自定义ControlBar显示

通过`controlBarFeatures` prop可以控制显示哪些功能组件：

```vue
<template>
  <SimpleDisplay 
    :controlBarFeatures="['play-pause', 'time-position', 'speed-control']" 
  />
</template>
```

### 可用features选项

以下是**完整功能组件列表**整合后的表格，包括组件名称、对应的 `shouldShow()` 参数，以及中文功能描述：

| **组件名称**        | **shouldShow() 参数** | **功能描述** |
| --------------- | ------------------- | -------- |
| ShortInfo       | `'short-info'`      | 简短信息     |
| TimePosition    | `'time-position'`   | 时间位置     |
| StopButton      | `'stop'`            | 停止按钮     |
| PlayPauseButton | `'play-pause'`      | 播放 / 暂停  |
| SpeedControl    | `'speed-control'`   | 速度控制     |
| CountInButton   | `'count-in'`        | 节拍器预备拍   |
| MetronomeButton | `'metronome'`       | 节拍器      |
| LoopButton      | `'loop'`            | 循环播放     |
| PrintButton     | `'print'`           | 打印       |
| DownloadButton  | `'download'`        | 下载       |
| ZoomControl     | `'zoom'`            | 缩放控制     |
| LayoutControl   | `'layout'`          | 布局控制     |
| TrackControl    | `'track-control'`   | 音轨控制     |



## 完整示例代码

```vue
<template>
  <div>
    <!-- 只显示播放控制和时间位置 -->
    <SimpleDisplay 
      :controlBarFeatures="['play-pause', 'time-position']"
    />
    
    <!-- 显示所有控制组件 (等同于不传或传null) -->
    <SimpleDisplay :controlBarFeatures="null" />
  </div>
</template>

<script setup>
import SimpleDisplay from '@/components/SimpleDisplay.vue'
</script>
```

## 注意事项

1. `controlBarFeatures`接受数组或null值：
   - 数组：只显示数组中指定的组件
   - null：显示所有可用组件
   - 空数组：不显示任何控制组件

2. 组件名称需严格匹配，大小写敏感

3. 如果传入不存在的组件名称，该组件将被忽略

4. 组件显示顺序与数组中的顺序一致