// customTheme.ts
// 要不要统一使用rgb或者16进制？


export const DARK_THEME_CSS = `
  /* ========== 背景 ========== */
  .at-main { background-color: #121212 !important; }

  /* ========== 音符相关元素 ========== */

  /* 新增：针对直接渲染为 <path> 的符干 (Stems) */
  /* 这些是那些 stroke="#000000" 且 style 属性中包含 "fill: none" 的 path 元素 */
  .at-main svg.at-surface-svg > path[stroke="#000000"][style*="fill: none"] {
    stroke: #FFFFFF !important; /* 将黑色符干的描边改为白色 */
  }
  /* 可选：如果 style 属性精确匹配 "fill: none" */
  .at-main svg.at-surface-svg > path[stroke="#000000"][style="fill: none"] {
    stroke: #FFFFFF !important;
  }

  /* 新增：针对直接渲染为 <path> 的符杠 (Beams) */
  /* 这些是那些 style 属性精确为 "stroke: none" 的 path 元素 */
  /* 它们默认填充为黑色，这里我们将其填充改为白色 */
  .at-main svg.at-surface-svg > path[style="stroke: none"] {
    fill: #FFFFFF !important;
  }

  // 针对小节线，诶诶似乎不起作用
  .at-main svg.at-surface-svg > rect[fill="#222211"] {
  fill: #FFFFFF !important; /* 改为纯白色 */
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

  /* 通用文本 */
  .at-main text, .at-main svg text, 
  .at-main g[data-name] text { 
    fill: #FFFFFF !important; 
    visibility: visible !important; 
  }

  /* ========== 谱面元素 ========== */
  /* 五线谱和节线 */
  .at-main .at-staff-line, .at-main .at-bar, 
  .at-main g[data-name="staff"] line, 
  .at-main g[data-name="bar"] * { 
    stroke: #bdbdbd !important; 
  }

  /* ========== 交互元素 ========== */
  /* 选择区域 */
  .at-main .at-selection, .at-main svg .at-selection, 
  .at-main g[data-name="selection"] rect { 
    fill: #FFFFFF !important; 
    stroke: #69F0AE !important; 
    stroke-width: 1px !important; 
    stroke-dasharray: none !important; 
  }

  /* 光标 - 小节 */
  .at-cursor-bar { 
    background-color: rgba(105, 240, 174, 0.15) !important; 
    border-left: 2px solid #69F0AE !important; 
    box-shadow: 0 0 10px rgba(105, 240, 174, 0.4) !important; 
  }

  /* 光标 - 节拍 */
  .at-cursor-beat { 
    background-color: #69F0AE !important; 
    box-shadow: 0 0 4px rgba(105, 240, 174, 0.8) !important; 
  }
`;
