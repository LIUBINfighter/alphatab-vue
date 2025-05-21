/* customTheme.ts */
// 统一使用16进制
// 深海军蓝背景 ( #0F1A2D)
// 音符、符干、休止符等基础元素多为柔和的浅灰色系（ #E0E0E0, #C0C0C0）
// 谱线和和弦符号是柔和的蓝灰色 ( #607D8B) 和暖黄色 (#FFD54F, #FFC107)
// 力度标记和高亮元素是清新的浅蓝色/青色 ( #80DEEA)。

export const DARK_THEME_CSS = `
  /* ========== 主容器背景 ========== */
  .at-main {
    background-color: #0F1A2D !important; /* 深海军蓝背景，柔和且专业 */
  }

  /* ========== SVG 容器 ========== */
  .at-surface-svg {
    background-color: #0F1A2D !important; /* SVG 容器背景与主背景保持一致 */
  }

  /* ========== 音符相关元素 ========== */
  /* SVG 直接渲染的符干 (Stems) */
  .at-main svg.at-surface-svg > path[stroke="#000000"][style*="fill: none"] {
    stroke: #E0E0E0 !important; /* 符干描边改为柔和的浅灰色 */
  }

  /* SVG 直接渲染的符杠 (Beams) */
  .at-main svg.at-surface-svg > path[style="stroke: none"] {
    fill: #E0E0E0 !important; /* 符杠填充改为柔和的浅灰色 */
  }

  /* 小节线 - 更新 */
  /* 针对矩形填充的小节线 */
  .at-main svg.at-surface-svg > rect[fill="#222211"],
  .at-main svg.at-surface-svg > rect[style*="fill: #222211"],
  .at-main g[data-name="bar"] rect {
    fill: #607D8B !important; /* 小节线矩形填充改为柔和的蓝灰色 */
  }

  /* 小节线 - 线条部分 */
  .at-main .at-bar, .at-main svg .at-bar,
  .at-main g[data-name="bar"] line {
    stroke: #607D8B !important; /* 小节线线条改为柔和的蓝灰色 */
    stroke-width: 1.5px !important;
  }

  /* 普通音符 */
  .at-main .at-notehead, .at-main svg .at-notehead,
  .at-main g[data-name="notehead"] *,
  .at-main .at-stem, .at-main svg .at-stem,
  .at-main g[data-name="stem"] * {
    fill: #E0E0E0 !important; /* 音符填充改为柔和的浅灰色 */
    stroke: #C0C0C0 !important; /* 音符描边改为略深的灰色，增加清晰度 */
  }

  /* 休止符 */
  .at-main .at-rest, .at-main svg .at-rest,
  .at-main g[data-name="rest"] *,
  .at-main .at-multirest, .at-main svg .at-multirest,
  .at-main g[data-name="multirest"] * {
    fill: #E0E0E0 !important; /* 休止符填充改为柔和的浅灰色 */
    stroke: #C0C0C0 !important; /* 休止符描边改为略深的灰色 */
    visibility: visible !important;
  }

  /* 连音线/延音线 - 更新 */
  .at-main path[data-name="tie"],
  .at-main path[data-name="slur"],
  .at-main g[data-name="tie"] path,
  .at-main g[data-name="slur"] path {
    stroke: #E0E0E0 !important; /* 连音线/延音线改为柔和的浅灰色 */
    stroke-width: 1.5px !important;
    fill: none !important;
  }

  /* 附点 - 新增 */
  .at-main .at-dot, .at-main svg .at-dot,
  .at-main g[data-name="dot"] *,
  .at-main circle[data-name="dot"] {
    fill: #E0E0E0 !important; /* 附点颜色与音符主体保持一致 */
    stroke: none !important;
  }

  /* 无效音符 */
  .at-main .at-dead-note, .at-main svg .at-dead-note,
  .at-main g[data-name="dead-note"] *,
  .at-main text.at-dead-note {
    fill: #FF7043 !important; /* 保持一个醒目的橙红色，但稍作调整 */
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

  /* ========== 文本元素 ========== */
  /* 小节号 */
  .at-main .at-bar-number, .at-main svg .at-bar-number,
  .at-main g[data-name="bar-number"] text {
    fill: #E0E0E0 !important; /* 小节号改为柔和的浅灰色 */
    font-weight: bold !important;
    font-size: 12px !important;
    stroke: none !important;
  }

  /* 歌词 */
  .at-main .at-lyrics *, .at-main g[data-name="lyrics"] text {
    fill: #FFD54F !important; /* 歌词改为柔和的暖黄色，突出但不刺眼 */
  }

  /* 力度标记 */
  .at-main g[data-name="dynamic"] text {
    fill: #80DEEA !important; /* 力度标记改为清新的浅蓝色/青色 */
  }

  /* 通用文本 */
  .at-main text, .at-main svg text,
  .at-main g[data-name] text {
    fill: #E0E0E0 !important; /* 通用文本改为柔和的浅灰色 */
    visibility: visible !important;
  }

  /* ========== 谱面元素 ========== */
  /* 五线谱线 */
  .at-main .at-staff-line, .at-main svg .at-staff-line,
  .at-main g[data-name="staff"] line {
    stroke: #607D8B !important; /* 五线谱线改为柔和的蓝灰色 */
  }

  /* ========== 交互元素 ========== */
  /* 选择区域 */
  .at-main .at-selection, .at-main svg .at-selection,
  .at-main g[data-name="selection"] rect {
    fill: rgba(15, 26, 45, 0.5) !important; /* 选择区域填充为半透明的背景色 */
    stroke: #FFC107 !important; /* 选择区域描边改为暖黄色，作为强调色 */
    stroke-width: 1px !important;
    stroke-dasharray: none !important;
  }

  .at-selection div {
    background: rgba(255, 193, 7, 0.1) !important; /* 选择区域的 div 背景改为半透明强调色 */
  }

  /* 光标 - 小节 */
  .at-cursor-bar {
    background-color: rgba(255, 193, 7, 0.15) !important; /* 光标背景改为半透明的强调色 */
    border-left: 2px solid #FFC107 !important; /* 光标左边框改为强调色 */
    box-shadow: 0 0 10px rgba(255, 193, 7, 0.4) !important; /* 光标阴影改为强调色 */
  }

  /* 光标 - 节拍 - 更新宽度 */
  .at-cursor-beat {
    background-color: #FFC107 !important; /* 节拍光标改为强调色 */
    box-shadow: 0 0 4px rgba(255, 193, 7, 0.8) !important; /* 节拍光标阴影改为强调色 */
    width: 5px !important; /* 增加宽度从3px到5px */
  }

  /* 高亮 - 播放中的元素 */
  .at-highlight * {
    fill: #80DEEA !important; /* 播放中的高亮元素改为清新的浅蓝色/青色，与力度标记颜色呼应 */
    stroke: #80DEEA !important;
  }
`;
