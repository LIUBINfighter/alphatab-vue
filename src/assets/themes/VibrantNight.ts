/* customTheme2.ts */
// 统一使用16进制
// customTheme2.ts
// 第三个自定义主题
// 第一个相对完整的版本
// 改造依据： https://deepwiki.com/search/css-export-const-darkthemecss_fcf0abed-bb96-41b7-9644-f557c99cc792

// 深色背景 #121212
// 音符主色调是明亮的蓝色系（ #80d8ff, #40c4ff）
// 音符主色调未被应用，被api方法覆写
// 交互元素是生动的绿色系（ #69F0AE）。
// 注意增加了覆写 ControlBar.vue 中组件原有样式的样式
// 使得工具栏也会变为背景黑色（ #121212）和交互绿色（ #69F0AE）

export const DARK_THEME_CSS = `
/* ========== 主容器背景 ========== */  
.at-main { background-color: #121212 !important; }  
  
/* ========== SVG 容器 ========== */  
.at-surface-svg { background-color: #121212 !important; }  
  
/* ========== 音符相关元素 ========== */  
/* SVG 直接渲染的符干 (Stems) */  
.at-main svg.at-surface-svg > path[stroke="#000000"][style*="fill: none"] {  
  stroke: #FFFFFF !important;  
}  
  
/* SVG 直接渲染的符杠 (Beams) */  
.at-main svg.at-surface-svg > path[style="stroke: none"] {  
  fill: #FFFFFF !important;  
}  
  
/* 小节线 */  
.at-main svg.at-surface-svg > rect[fill="#000000"],  
.at-main svg.at-surface-svg > rect[style*="fill: #000000"] {  
  fill: #FFFFFF !important;  
}

/* 小节线 - 更新 */
.at-main svg.at-surface-svg > rect[fill="#222211"],  
.at-main svg.at-surface-svg > rect[style*="fill: #222211"],  
.at-main g[data-name="bar"] rect {  
  fill: #FFFFFF !important;  
}

/* 小节线 - 线条部分 */
.at-main .at-bar, .at-main svg .at-bar,   
.at-main g[data-name="bar"] line {   
  stroke: #bdbdbd !important;  
  stroke-width: 1.5px !important;  
}  
  
/* 普通音符 */  
.at-main .at-notehead, .at-main svg .at-notehead,   
.at-main g[data-name="notehead"] *,   
.at-main .at-stem, .at-main svg .at-stem,   
.at-main g[data-name="stem"] * {   
  fill: #80d8ff !important;   
  stroke: #40c4ff !important;   
}  
  
/* 休止符 */  
.at-main .at-rest, .at-main svg .at-rest,   
.at-main g[data-name="rest"] *,   
.at-main .at-multirest, .at-main svg .at-multirest,   
.at-main g[data-name="multirest"] * {   
  fill: #FFFFFF !important;   
  stroke: #E0E0E0 !important;   
  visibility: visible !important;   
}  
  
/* 连音线/延音线 */    
.at-main path[data-name="tie"], .at-main path[data-name="slur"] {     
  stroke: #E0E0E0 !important;     
  stroke-width: 1.5px !important;     
  fill: none !important;     
}

/* 连音线/延音线 - 更新 */    
.at-main path[data-name="tie"],   
.at-main path[data-name="slur"],  
.at-main g[data-name="tie"] path,  
.at-main g[data-name="slur"] path {     
  stroke: #E0E0E0 !important;     
  stroke-width: 1.5px !important;     
  fill: none !important;     
}  
  
/* 无效音符 */  
.at-main .at-dead-note, .at-main svg .at-dead-note,   
.at-main g[data-name="dead-note"] *,   
.at-main text.at-dead-note {   
  fill: #FF9E80 !important;   
  font-weight: bold !important;   
}  
  
/* 装饰音符 */  
.at-main .at-note[data-note-type="grace"],   
.at-main .at-parenthesis,   
.at-main g[data-name="grace-note"] *,   
.at-main g[data-name="parenthesis"] * {   
  fill-opacity: 0.7 !important;   
  stroke-opacity: 0.7 !important;   
}  
  
/* 和弦符号 */  
.at-main .at-chord, .at-main svg .at-chord,  
.at-main g[data-name="chord"] * {  
  fill: #ffcc80 !important;  
}  
  
/* 音符装饰效果 */  
.at-main .at-annotation, .at-main svg .at-annotation,  
.at-main g[data-name="annotation"] * {  
  fill: #ce93d8 !important;  
}  
  
/* ========== 谱表元素 ========== */  
/* 五线谱线 */  
.at-main .at-staff-line, .at-main svg .at-staff-line,   
.at-main g[data-name="staff"] line {   
  stroke: #bdbdbd !important;   
}  
  
/* 节拍线 */  
.at-main .at-bar, .at-main svg .at-bar,   
.at-main g[data-name="bar"] * {   
  stroke: #bdbdbd !important;   
}  
  
/* 反复记号 */  
.at-main .at-repeat, .at-main svg .at-repeat,  
.at-main g[data-name="repeat"] * {  
  fill: #f48fb1 !important;  
  stroke: #f48fb1 !important;  
}  
  
/* ========== 文本元素 ========== */  
/* 小节号 */  
.at-main .at-bar-number, .at-main svg .at-bar-number,   
.at-main g[data-name="bar-number"] text {   
  fill: #FFFFFF !important;   
  font-weight: bold !important;   
  font-size: 12px !important;   
  stroke: none !important;   
}  
  
/* 歌词 */  
.at-main .at-lyrics *, .at-main g[data-name="lyrics"] text {   
  fill: #ffcc80 !important;   
}  
  
/* 力度标记 */  
.at-main g[data-name="dynamic"] text {   
  fill: #f48fb1 !important;   
}  
  
/* 演奏技巧标记 */  
.at-main g[data-name="technique"] *,  
.at-main .at-technique {  
  fill: #80cbc4 !important;  
}  
  
/* 速度标记 */  
.at-main g[data-name="tempo"] *,  
.at-main .at-tempo {  
  fill: #a5d6a7 !important;  
}  
  
/* 通用文本 */  
.at-main text, .at-main svg text,   
.at-main g[data-name] text {   
  fill: #FFFFFF !important;   
  visibility: visible !important;   
}  
  
/* ========== 交互元素 ========== */  
/* 选择区域 */  
.at-main .at-selection, .at-main svg .at-selection,   
.at-main g[data-name="selection"] rect {   
  fill: rgba(255, 255, 255, 0.1) !important;   
  stroke: #69F0AE !important;   
  stroke-width: 1px !important;   
  stroke-dasharray: none !important;   
}  
  
.at-selection div {  
  background: rgba(105, 240, 174, 0.1) !important;  
}  
  
/* 光标 - 小节 */  
.at-cursor-bar {   
  background-color: rgba(105, 240, 174, 0.15) !important;   
  border-left: 4px solid #69F0AE !important;   
  box-shadow: 0 0 10px rgba(105, 240, 174, 0.4) !important;   
}  
  
/* 光标 - 节拍 */  
.at-cursor-beat {   
  background-color: #69F0AE !important;   
  box-shadow: 0 0 4px rgba(105, 240, 174, 0.8) !important;   
  width: 5px !important; /* 增加宽度从3px到5px */  
}  
  
/* 高亮 - 播放中的元素 */  
.at-highlight * {   
  fill: #69F0AE !important;   
  stroke: #69F0AE !important;   
}  
  
/* ========== 控制元素 ========== */  
/* 工具栏背景 */  
.at-controls {  
  background-color: #1e1e1e !important;  
  color: #FFFFFF !important;  
}  
  
/* 按钮 */  
.at-controls .btn {  
  color: #FFFFFF !important;  
}  
  
.at-controls .btn.active {  
  background-color: #2e7d32 !important;  
}  
  
/* 下拉菜单 */  
.at-controls select {  
  background-color: #1e1e1e !important;  
  color: #FFFFFF !important;  
}
`;
