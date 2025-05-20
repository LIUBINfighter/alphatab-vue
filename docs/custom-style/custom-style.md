# 自定义渲染样式以适配暗色主题

在 alphaTab 中，有几种方式可以自定义渲染样式以适配暗色主题。主要有以下几种方法：

## 1. 使用 CSS 自定义播放器光标和高亮样式

alphaTab 提供了一些全局 CSS 类，可以用来自定义播放器的光标和高亮颜色，这对于适配暗色主题非常有用：

```
.at-cursor-bar {  
  /* 定义小节背景颜色（当小节被播放时） */  
  background: rgba(255, 242, 0, 0.25);  
}  
  
.at-selection div {  
  /* 定义选择区域的背景颜色 */  
  background: rgba(64, 64, 255, 0.1);  
}  
  
.at-cursor-beat {  
  /* 定义节拍光标 */  
  background: rgba(64, 64, 255, 0.75);  
  width: 3px;  
}  
  
.at-highlight * {  
  /* 定义音乐符号被播放时的颜色（svg） */  
  fill: #0078ff;  
  stroke: #0078ff;  
}
```

custom.scss:119-139

这些 CSS 类可以在你的网站中根据当前主题动态修改，例如使用 CSS 变量或者媒体查询来适配暗色主题。

## 2. 使用 display.resources 设置

alphaTab 提供了 `display.resources` 设置，允许你调整渲染时使用的字体和颜色：

```
settings.display.resources.effectFont = "..."; // 设置效果字体  
settings.display.resources.fretboardNumberFont = "..."; // 设置指板数字字体  
settings.display.resources.tablatureFont = "..."; // 设置吉他谱字体  
// 其他字体和颜色设置...
```

resources.mdx:28-35

这些设置可以通过 JavaScript、JSON 或 HTML 数据属性来配置，使你能够根据当前主题动态调整颜色。

## 3. 使用 Color 模型和 Style 容器进行精细控制

从 alphaTab 1.5.0 版本开始，你可以使用 `style` 容器对音乐符号元素进行个性化样式设置：

```
// 在 scoreLoaded 事件中应用自定义颜色  
api.scoreLoaded.on(score => {  
  // 创建 score 级别的自定义样式  
  score.style = new alphaTab.model.ScoreStyle();  
  score.style.colors.set(  
    alphaTab.model.ScoreSubElement.Title,  
    alphaTab.model.Color.fromJson("#426d9d")  
  );  
    
  // 可以为不同级别的元素设置不同的颜色  
  // 例如：音符、小节、轨道等  
});
```

index.tsx:19-29

这种方法提供了最精细的控制，允许你为数据模型中的每个元素设置特定的颜色，非常适合根据主题动态调整颜色。

## 4. 可自定义样式的元素层级

alphaTab 支持在多个层级上自定义颜色：

1. **Score 级别**：使用 `ScoreStyle` 和 `ScoreSubElement` 枚举
2. **Track 级别**：使用 `TrackStyle` 和 `TrackSubElement` 枚举
3. **Bar 级别**：使用 `BarStyle` 和 `BarSubElement` 枚举
4. **Voice 级别**：使用 `VoiceStyle` 和 `VoiceSubElement` 枚举
5. **Beat 级别**：使用 `BeatStyle` 和 `BeatSubElement` 枚举
6. **Note 级别**：使用 `NoteStyle` 和 `NoteSubElement` 枚举 coloring.mdx:38-87

## 实现暗色主题的最佳实践

要实现暗色主题支持，你可以：

1. 监听系统或网站的主题变化
2. 根据当前主题，使用 `api.render()` 方法重新渲染乐谱，同时应用相应的颜色设置
3. 使用 `api.scoreLoaded` 事件来确保每次加载新乐谱时都应用正确的主题颜色

```
// 示例：监听主题变化并更新 alphaTab 样式  
function updateTheme(isDarkMode) {  
  if (!api.score) return;  
    
  applyColorsToScore(api.score, isDarkMode);  
  api.render(); // 重新渲染以应用新样式  
}  
  
function applyColorsToScore(score, isDarkMode) {  
  score.style = new alphaTab.model.ScoreStyle();  
    
  // 根据主题设置不同的颜色  
  if (isDarkMode) {  
    score.style.colors.set(  
      alphaTab.model.ScoreSubElement.Title,  
      alphaTab.model.Color.fromJson("#70acf0") // 暗色主题颜色  
    );  
    // 设置其他元素的暗色主题颜色...  
  } else {  
    score.style.colors.set(  
      alphaTab.model.ScoreSubElement.Title,  
      alphaTab.model.Color.fromJson("#426d9d") // 亮色主题颜色  
    );  
    // 设置其他元素的亮色主题颜色...  
  }  
}  
  
// 在 scoreLoaded 事件中应用当前主题  
api.scoreLoaded.on(score => {  
  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';  
  applyColorsToScore(score, isDarkMode);  
});
```

这种方法可以让你的 alphaTab 实例无缝适配网站的亮色/暗色主题切换。

## Notes

alphaTab 提供了多种方式来自定义渲染样式，从简单的 CSS 类到复杂的数据模型样式容器。对于暗色主题适配，最灵活的方法是使用 `style` 容器和 `Color` 模型，它们允许你为乐谱中的每个元素设置特定的颜色。这些 API 在 alphaTab 1.5.0 版本中引入，提供了前所未有的样式自定义能力。

要注意的是，当你修改数据模型中的样式后，需要调用 `api.render()` 方法来重新渲染乐谱以应用新的样式。这是一个性能密集型操作，因为它会重新布局和绘制整个乐谱。

Wiki pages you might want to explore:

- [Website Architecture (CoderLine/alphaTabWebsite)](https://deepwiki.com/CoderLine/alphaTabWebsite/3-website-architecture)
- [Deployment System (CoderLine/alphaTabWebsite)](https://deepwiki.com/CoderLine/alphaTabWebsite/3.3-deployment-system)