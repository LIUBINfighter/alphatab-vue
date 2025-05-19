# SimpleDisplay组件ControlBar自定义使用指南

## 基本用法

默认情况下（即不传递 `controlBarFeatures` prop 或将其设置为 `null`），`SimpleDisplay` 的 `ControlBar` 会显示一组预定义的常用功能组件：**停止、播放/暂停、速度控制、打印、下载**。

```vue
<template>
  <!-- 将显示默认的五个控制按钮 -->
  <SimpleDisplay />
</template>
```

## 自定义ControlBar显示

通过向 `SimpleDisplay` 组件传递 `controlBarFeatures` prop (一个字符串数组)，可以精确控制 `ControlBar` 中显示哪些功能组件。

```vue
<template>
  <SimpleDisplay 
    :controlBarFeatures="['play-pause', 'metronome', 'zoom']" 
  />
</template>
```
上述示例将只显示播放/暂停按钮、节拍器按钮和缩放控件。

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
    <!-- 只显示播放控制、节拍器和缩放 -->
    <SimpleDisplay 
      :controlBarFeatures="['play-pause', 'metronome', 'zoom']"
    />
    
    <!-- 显示默认的五个控制组件 (等同于不传 controlBarFeatures) -->
    <SimpleDisplay :controlBarFeatures="null" />

    <!-- 不显示任何通过 v-if="shouldShow(...)" 控制的组件 -->
    <SimpleDisplay :controlBarFeatures="[]" />
  </div>
</template>

<script setup>
import SimpleDisplay from '@/components/SimpleDisplay.vue'
</script>
```

## 注意事项

1. `controlBarFeatures` prop 接受一个数组或 `null` 值：
   - 数组：精确指定要显示的组件。如果数组为空 `[]`，则不显示任何由 `features` prop 控制的组件。
   - `null` (或不传递该 prop)：`ControlBar` 将显示其预设的默认控件（停止、播放/暂停、速度控制、打印、下载）。
2. 组件名称（数组中的字符串）需严格匹配 "可用features选项" 表格中的 `'shouldShow() 参数'` 列，它们是大小写敏感的。
3. 如果在 `controlBarFeatures` 数组中传入了列表中不存在的组件名称，该无效名称将被忽略，对应的组件不会显示。
4. `ControlBar` 中组件的实际显示顺序由其在模板中的定义顺序决定，`controlBarFeatures` 数组仅用于决定是否显示，不影响顺序。