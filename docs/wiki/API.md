# AlphaTab.js 集成接口文档

## 核心API

### AlphaTab初始化
```javascript
const settings = {
  file: "path/to/score.gp",
  player: {
    enablePlayer: true,
    soundFont: "assets/soundfont.sf2"
  }
};

const api = new alphaTab.AlphaTabApi("#tab-container", settings);
```

### 常用方法
- `api.render()`: 重新渲染乐谱
- `api.score`: 获取当前乐谱数据
- `api.tracks`: 获取所有音轨
- `api.playPause()`: 播放/暂停
- `api.stop()`: 停止播放

## 事件处理

### 播放事件
```javascript
api.player.positionChanged.on(e => {
  console.log("当前播放位置:", e.currentPosition);
});
```

### 常用事件
- `scoreLoaded`: 乐谱加载完成
- `playerReady`: 播放器准备就绪
- `playerStateChanged`: 播放状态变化
- `renderFinished`: 渲染完成

## 配置参数

### 主要配置项
| 参数 | 类型 | 说明 |
|------|------|------|
| `file` | string | 乐谱文件路径 |
| `player.enablePlayer` | boolean | 是否启用播放器 |
| `display.settings` | object | 显示设置 |
| `notation.elements` | object | 音符元素设置 |

## 自定义渲染
```javascript
api.renderer.postRender.on(() => {
  // 自定义渲染逻辑
});