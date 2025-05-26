// darkTheme.ts 最早的暗色方案
// 统一使用16进制？
// 纯黑背景 (#121212)
// 音符主色调是明亮的蓝色系（ #80d8ff, #40c4ff）
// 音符主色调没有被应用，不明白原因，可能是api设置覆写，搁置。
// 休止符和谱线是白色/浅灰
// 交互元素是生动的绿色系（ #69F0AE）。
// 与 customTheme2.ts 相似，但更突出黑白对比和明亮音符。
export const DARK_THEME_CSS = `
/* ========== 主容器背景 ========== */
.at-main { background-color: #121212 !important; }

/* ========== SVG 容器 ========== */
.at-surface-svg { background-color: #121212 !important; }

/* ========== 音符相关元素 ========== */
/* SVG 直接渲染的符干 (Stems) */
.at-main svg.at-surface-svg > path[stroke="#000000"][style*="fill: none"] {
  stroke: #FFFFFF !important; /* 将黑色符干的描边改为白色 */
}

/* SVG 直接渲染的符杠 (Beams) */
.at-main svg.at-surface-svg > path[style="stroke: none"] {
  fill: #FFFFFF !important; /* 将黑色符杠的填充改为白色 */
}

/* 小节线 - 矩形填充部分 */
.at-main svg.at-surface-svg > rect[fill="#000000"],
.at-main svg.at-surface-svg > rect[style*="fill: #000000"],
.at-main svg.at-surface-svg > rect[fill="#222211"],
.at-main svg.at-surface-svg > rect[style*="fill: #222211"],
.at-main g[data-name="bar"] rect {
  fill: #FFFFFF !important; /* 小节线矩形填充改为纯白色 */
}

/* 小节线 - 线条部分 */
.at-main .at-bar, .at-main svg .at-bar,
.at-main g[data-name="bar"] line {
  stroke: #bdbdbd !important; /* 小节线线条改为浅灰色 */
  stroke-width: 1.5px !important;
}

/* 普通音符 */
.at-main .at-notehead, .at-main svg .at-notehead,
.at-main g[data-name="notehead"] *,
.at-main .at-stem, .at-main svg .at-stem,
.at-main g[data-name="stem"] * {
  fill: #80d8ff !important; /* 音符填充为明亮的蓝色 */
  stroke: #40c4ff !important; /* 音符描边为较深的蓝色 */
}

/* 休止符 */
.at-main .at-rest, .at-main svg .at-rest,
.at-main g[data-name="rest"] *,
.at-main .at-multirest, .at-main svg .at-multirest,
.at-main g[data-name="multirest"] * {
  fill: #FFFFFF !important; /* 休止符填充为纯白色 */
  stroke: #E0E0E0 !important; /* 休止符描边为浅灰色 */
  visibility: visible !important;
}

/* 连音线/延音线 */
.at-main path[data-name="tie"], .at-main path[data-name="slur"],
.at-main g[data-name="tie"] path,
.at-main g[data-name="slur"] path {
  stroke: #E0E0E0 !important; /* 连音线/延音线改为浅灰色 */
  stroke-width: 1.5px !important;
  fill: none !important;
}

/* 附点 */
.at-main .at-dot, .at-main svg .at-dot,
.at-main g[data-name="dot"] *,
.at-main circle[data-name="dot"] {
  fill: #FFFFFF !important; /* 附点颜色与音符主体保持一致，为白色 */
  stroke: none !important;
}

/* 无效音符 */
.at-main .at-dead-note, .at-main svg .at-dead-note,
.at-main g[data-name="dead-note"] *,
.at-main text.at-dead-note {
  fill: #FF9E80 !important; /* 保持醒目的橙红色 */
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
  fill: #FFFFFF !important; /* 和弦符号改为纯白色 */
}

/* 音符装饰效果 (Annotations) */
.at-main .at-annotation, .at-main svg .at-annotation,
.at-main g[data-name="annotation"] * {
  fill: #FFFFFF !important; /* 注释颜色改为纯白色 */
}

/* ========== 谱表元素 ========== */
/* 五线谱线 */
.at-main .at-staff-line, .at-main svg .at-staff-line,
.at-main g[data-name="staff"] line {
  stroke: #bdbdbd !important; /* 五线谱线改为浅灰色 */
}

/* 反复记号 */
.at-main .at-repeat, .at-main svg .at-repeat,
.at-main g[data-name="repeat"] * {
  fill: #FFFFFF !important; /* 反复记号改为纯白色 */
  stroke: #FFFFFF !important;
}

/* ========== 文本元素 ========== */
/* 小节号 */
.at-main .at-bar-number, .at-main svg .at-bar-number,
.at-main g[data-name="bar-number"] text {
  fill: #FFFFFF !important; /* 小节号改为纯白色 */
  font-weight: bold !important;
  font-size: 12px !important;
  stroke: none !important;
}

/* 歌词 */
.at-main .at-lyrics *, .at-main g[data-name="lyrics"] text {
  fill: #E0E0E0 !important; /* 歌词改为浅灰色，与黑白对比更协调 */
}

/* 力度标记 */
.at-main g[data-name="dynamic"] text {
  fill: #69F0AE !important; /* 力度标记改为生动的绿色 */
}

/* 演奏技巧标记 */
.at-main g[data-name="technique"] *,
.at-main .at-technique {
  fill: #69F0AE !important; /* 演奏技巧标记改为生动的绿色 */
}

/* 速度标记 */
.at-main g[data-name="tempo"] *,
.at-main .at-tempo {
  fill: #69F0AE !important; /* 速度标记改为生动的绿色 */
}

/* 通用文本 */
.at-main text, .at-main svg text,
.at-main g[data-name] text {
  fill: #FFFFFF !important; /* 通用文本改为纯白色 */
  visibility: visible !important;
}

/* ========== 交互元素 ========== */
/* 选择区域 */
.at-main .at-selection, .at-main svg .at-selection,
.at-main g[data-name="selection"] rect {
  fill: rgba(105, 240, 174, 0.1) !important; /* 选择区域填充为半透明的绿色 */
  stroke: #69F0AE !important; /* 选择区域描边为生动的绿色 */
  stroke-width: 1px !important;
  stroke-dasharray: none !important;
}

.at-selection div {
  background: rgba(105, 240, 174, 0.1) !important; /* 选择区域的 div 背景改为半透明绿色 */
}

/* 光标 - 小节 */
.at-cursor-bar {
  background-color: rgba(105, 240, 174, 0.15) !important; /* 光标背景改为半透明绿色 */
  border-left: 0.5px solid #69F0AE !important; /* 光标左边框改为生动的绿色 */
  box-shadow: 0 0 1px rgba(105, 240, 174, 0.4) !important; /* 光标阴影改为绿色 */
}

/* 光标 - 节拍 */
.at-cursor-beat {
  background-color: #69F0AE !important; /* 节拍光标改为生动的绿色 */
  box-shadow: 0 0 4px rgba(105, 240, 174, 0.8) !important; /* 节拍光标阴影改为绿色 */
  width: 120px !important; /* 增加宽度 */
}

/* 高亮 - 播放中的元素 */
.at-highlight * {
  fill: #69F0AE !important; /* 播放中的高亮元素改为生动的绿色 */
  stroke: #69F0AE !important;
}

/* ========== 控制元素 ========== */
/* 工具栏背景 */
.at-controls {
  background-color: #1e1e1e !important;
  color: #FFFFFF !important;
  scrollbar-width: thin !important;
  scrollbar-color: var(--scrollbar-thumb-bg) var(--scrollbar-bg) !important;
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

/* 水平滚动条样式 */
.at-controls::-webkit-scrollbar {
  height: 8px !important;
  width: 8px !important;
  background-color: var(--scrollbar-bg) !important;
}

.at-controls::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-bg) !important;
  border-radius: 4px !important;
  border: 1px solid var(--scrollbar-border-color) !important;
}

.at-controls::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover-bg) !important;
}

.at-controls::-webkit-scrollbar-thumb:active {
  background-color: var(--scrollbar-thumb-active-bg) !important;
}

.at-controls::-webkit-scrollbar-track {
  background: var(--scrollbar-bg) !important;
  border-radius: 4px !important;
}

.at-controls::-webkit-scrollbar-corner {
  background: var(--scrollbar-bg) !important;
}

/* ========== Additions for Sliders within .at-controls in DARK_THEME_CSS ========== */

/* 工具栏背景 */
.at-controls {
  background-color: #1e1e1e !important; /* 工具栏背景使用深灰色 */
  color: #FFFFFF !important;
}

/* 按钮 */
.at-controls .btn {
  color: #FFFFFF !important;
}

.at-controls .btn.active {
  background-color: #2e7d32 !important; /* 激活按钮背景使用深绿色 */
}

/* 下拉菜单 */
.at-controls select {
  background-color: #1e1e1e !important; /* 下拉菜单背景与工具栏背景保持一致 */
  color: #FFFFFF !important;
}


/* ========== Additions for TrackSidebar in DARK_THEME_CSS ========== */

/* Main Track Sidebar Container */
.track-sidebar {
  background-color: #242424 !important; /* A dark grey, slightly different from .at-main or .at-controls for visual hierarchy */
  border-right: 1px solid #383838 !important; /* A subtle border */
}

/* Expanded Track Sidebar */
.track-sidebar.expanded {
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5) !important; /* More pronounced shadow for dark theme */
  /* Scrollbar should be handled by the CSS variable system if implemented */
}

/* Sidebar Header (e.g., "音轨" button) */
.track-sidebar .sidebar-header {
  background-color: #1e1e1e !important; /* Match .at-controls background */
  color: #FFFFFF !important; /* Text is already white, ensure it stays so */
}
.track-sidebar .sidebar-header:hover {
  background-color: #2c2c2c !important; /* Slight hover effect */
}

/* Container for individual track items */
.track-sidebar .tracks-container {
  /* Inherits background from .track-sidebar, which is fine */
}

/* Individual Track Item */
.track-sidebar .track-item {
  background-color: transparent !important; /* Use the sidebar's main background */
  border-bottom: 1px solid #383838 !important; /* Match sidebar border color */
  color: #E0E0E0 !important; /* Default text color for track items */
}

/* Active/Selected Track Item */
.track-sidebar .track-item.active {
  background-color: #333333 !important; /* A slightly lighter, distinct background for active item */
  color: #FFFFFF !important;
}

/* Track Name Text */
.track-sidebar .track-name {
  color: #E0E0E0 !important; /* Ensure track names are light */
}
.track-sidebar .track-item.active .track-name {
  color: #FFFFFF !important; /* Ensure active track names are bright white */
}


/* Control Buttons (Eye, Volume, Headphones) within a track item */
.track-sidebar .control-button {
  background-color: #3a3a3a !important; /* A noticeable button background */
  color: #CCCCCC !important; /* Icon color */
}

.track-sidebar .control-button:hover {
  background-color: #4a4a4a !important;
  color: #FFFFFF !important;
}

.track-sidebar .control-button.active {
  background-color: #69F0AE !important; /* Using the accent green from your score highlights */
  color: #121212 !important; /* Dark icon on bright green for contrast */
}

/* Volume Slider */
.track-sidebar .volume-slider {
  background: #3a3a3a !important; /* Track of the slider */
}

/* WebKit Volume Slider Thumb */
.track-sidebar .volume-slider::-webkit-slider-thumb {
  background: #69F0AE !important; /* Thumb color matching active buttons */
  border: 1px solid #1e1e1e; /* Optional: slight border for definition */
}

/* Firefox Volume Slider Thumb */
.track-sidebar .volume-slider::-moz-range-thumb {
  background: #69F0AE !important; /* Thumb color matching active buttons */
  border: 1px solid #1e1e1e; /* Optional: slight border for definition */
}

/* Help Text Section */
.track-sidebar .track-controls-help {
  background-color: #2a2a2a !important; /* A slightly different dark background */
  color: #bbbbbb !important; /* Light grey text for help */
  border-top: 1px solid #383838 !important; /* Separator line */
}

.track-sidebar .track-controls-help p,
.track-sidebar .track-controls-help ul,
.track-sidebar .track-controls-help li {
  color: #bbbbbb !important; /* Ensure all text inside is light */
}

.track-sidebar .track-controls-help .help-icon {
  color: #bbbbbb !important; /* Ensure help icons are also styled if they inherit stroke/fill */
}

/* Ensure icons within the sidebar header are white */
.track-sidebar .sidebar-header .sidebar-icon {
    color: #FFFFFF !important;
}
`;
