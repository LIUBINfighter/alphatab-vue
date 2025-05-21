/* customTheme.ts */
// 统一使用16进制

export const DARK_THEME_CSS = `
  /* ========== 背景 ========== */
  .at-main { 
    background-color: #0F1A2D !important; /* 深海军蓝背景，比纯黑更柔和 */
  }

  /* ========== 音符相关元素 ========== */

  /* 针对直接渲染为 <path> 的符干 (Stems) */
  /* 这些是那些 stroke="#000000" 且 style 属性中包含 "fill: none" 的 path 元素 */
  .at-main svg.at-surface-svg > path[stroke="#000000"][style*="fill: none"] {
    stroke: #E0E0E0 !important; /* 将黑色符干的描边改为柔和的浅灰色 */
  }
  /* 可选：如果 style 属性精确匹配 "fill: none" */
  .at-main svg.at-surface-svg > path[stroke="#000000"][style="fill: none"] {
    stroke: #E0E0E0 !important;
  }

  /* 针对直接渲染为 <path> 的符杠 (Beams) */
  /* 这些是那些 style 属性精确为 "stroke: none" 的 path 元素 */
  /* 它们默认填充为黑色，这里我们将其填充改为柔和的浅灰色 */
  .at-main svg.at-surface-svg > path[style="stroke: none"] {
    fill: #E0E0E0 !important;
  }

  // 针对小节线，诶诶似乎不起作用
  // 如果这个选择器有效，可以尝试修改颜色
  .at-main svg.at-surface-svg > rect[fill="#222211"] {
    fill: #607D8B !important; /* 与五线谱颜色保持一致，柔和的蓝灰色 */
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

  /* 连音线/延音线 */  
  .at-main path[data-name="tie"], .at-main path[data-name="slur"] {  
    stroke: #E0E0E0 !important;  /* 连音线/延音线改为柔和的浅灰色 */
    stroke-width: 1.5px !important;  
    fill: none !important;  
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
  /* 五线谱和节线 */
  .at-main .at-staff-line, .at-main .at-bar, 
  .at-main g[data-name="staff"] line, 
  .at-main g[data-name="bar"] * { 
    stroke: #607D8B !important; /* 五线谱和节线改为柔和的蓝灰色，与背景协调 */
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

  /* 光标 - 小节 */
  .at-cursor-bar { 
    background-color: rgba(255, 193, 7, 0.15) !important; /* 光标背景改为半透明的强调色 */
    border-left: 2px solid #FFC107 !important; /* 光标左边框改为强调色 */
    box-shadow: 0 0 10px rgba(255, 193, 7, 0.4) !important; /* 光标阴影改为强调色 */
  }

  /* 光标 - 节拍 */
  .at-cursor-beat { 
    background-color: #FFC107 !important; /* 节拍光标改为强调色 */
    box-shadow: 0 0 4px rgba(255, 193, 7, 0.8) !important; /* 节拍光标阴影改为强调色 */
  }
`;
