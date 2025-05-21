export const DARK_THEME_CSS = `
  /* 自定义深色主题 - 作为API配置的补充备份 */
  .at-main { background-color: #121212 !important; }
  .at-main .at-notehead, .at-main svg .at-notehead, .at-main g[data-name="notehead"] *, .at-main .at-stem, .at-main svg .at-stem, .at-main g[data-name="stem"] * { fill: #80d8ff !important; stroke: #40c4ff !important; }
  .at-main .at-rest, .at-main svg .at-rest, .at-main g[data-name="rest"] *, .at-main .at-multirest, .at-main svg .at-multirest, .at-main g[data-name="multirest"] * { fill: #FFFFFF !important; stroke: #E0E0E0 !important; visibility: visible !important; }
  .at-main .at-tie, .at-main .at-slur, .at-main svg .at-tie, .at-main svg .at-slur, .at-main path[data-name="tie"], .at-main path[data-name="slur"] { stroke: #E0E0E0 !important; stroke-width: 1.5px !important; fill: none !important; visibility: visible !important; }
  .at-main .at-dead-note, .at-main svg .at-dead-note, .at-main g[data-name="dead-note"] *, .at-main text.at-dead-note { fill: #FF9E80 !important; font-weight: bold !important; }
  .at-main .at-note[data-note-type="grace"], .at-main .at-parenthesis, .at-main g[data-name="grace-note"] *, .at-main g[data-name="parenthesis"] * { fill-opacity: 0.7 !important; stroke-opacity: 0.7 !important; }
  .at-main .at-bar-number, .at-main svg .at-bar-number, .at-main g[data-name="bar-number"] text { fill: #FFFFFF !important; font-weight: bold !important; font-size: 12px !important; stroke: none !important; }
  .at-main .at-selection, .at-main svg .at-selection, .at-main g[data-name="selection"] rect { fill: rgba(105, 240, 174, 0.2) !important; stroke: #69F0AE !important; stroke-width: 1px !important; stroke-dasharray: none !important; }
  .at-main text, .at-main svg text, .at-main g[data-name] text { fill: #FFFFFF !important; visibility: visible !important; }
  .at-main .at-lyrics *, .at-main g[data-name="lyrics"] text { fill: #ffcc80 !important; }
  .at-main g[data-name="dynamic"] text { fill: #f48fb1 !important; }
  .at-main .at-staff-line, .at-main .at-bar, .at-main g[data-name="staff"] line, .at-main g[data-name="bar"] * { stroke: #bdbdbd !important; }
  .at-cursor-bar { background-color: rgba(105, 240, 174, 0.15) !important; border-left: 2px solid #69F0AE !important; box-shadow: 0 0 10px rgba(105, 240, 174, 0.4) !important; }
  .at-cursor-beat { background-color: #69F0AE !important; box-shadow: 0 0 4px rgba(105, 240, 174, 0.8) !important; }
`;
