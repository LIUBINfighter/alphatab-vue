// 声明 alphaTab 全局变量，或者如果 AlphaTab 提供类型定义，请导入它们
declare const alphaTab: any;

export function applyDarkThemeViaApi(api: any) {
  if (!api) return;
  
  // 更新API的资源配置
  api.settings.display.resources = {
    ...api.settings.display.resources,
    // 配置深色主题颜色
    mainGlyphColor: "#FFFFFF",
    secondaryGlyphColor: "rgba(255,255,255,0.60)",
    backgroundColor: "#121212",
    
    // 文本颜色
    barNumberColor: "#FFFFFF",
    tabNoteColor: "#80d8ff",
    scoreInfoColor: "#FFFFFF",
    titleColor: "#FFFFFF",
    subTitleColor: "#e0e0e0",
    wordsColor: "#ffcc80",
    copyrightColor: "#BBBBBB",
    
    // 线条颜色
    staffLineColor: "#bdbdbd",
    barSeparatorColor: "#bdbdbd",
    
    // 新增: 补充休止符和连音线颜色
    restColor: "#FFFFFF", // 休止符颜色
    slurColor: "#E0E0E0", // 连音线颜色（浅灰色）
    tieColor: "#E0E0E0",  // 延音线颜色（浅灰色）
    
    // 新增: 特殊音符标记颜色
    tabGhostNoteColor: "#FF9E80", // 哑音符号（淡橙色）
    effectFontColor: "#B3E5FC",   // 效果文本颜色（淡蓝色）
    
    // 高亮和选中颜色
    selectionColor: "rgba(105, 240, 174, 0.2)", // 选中区域背景色
    selectionBorderColor: "#69F0AE", // 新增: 选中区域边框色
  };
  
  // 应用更新的设置
  api.updateSettings();
  
  // 对于AlphaTab 1.5.0+，还可以使用更强大的样式系统
  if (api.score && typeof api.score.style !== 'undefined') {
    try {
      // 创建样式对象并配置颜色
      api.score.style = new alphaTab.model.ScoreStyle();
      api.score.style.colors.set(
        alphaTab.model.ScoreSubElement.MainGlyph, 
        alphaTab.model.Color.fromJson("#FFFFFF")
      );
      
      // 新增: 尝试设置更多的子元素颜色
      if (alphaTab.model.ScoreSubElement.Rest) {
        api.score.style.colors.set(
          alphaTab.model.ScoreSubElement.Rest,
          alphaTab.model.Color.fromJson("#FFFFFF")
        );
      }
      if (alphaTab.model.ScoreSubElement.BarNumber) {
        api.score.style.colors.set(
          alphaTab.model.ScoreSubElement.BarNumber,
          alphaTab.model.Color.fromJson("#FFFFFF")
        );
      }
      // --- 为符干、符尾、符杠设置特定颜色 ---
      const stemColor = alphaTab.model.Color.fromJson("#FFFFFF");
      const flagColor = alphaTab.model.Color.fromJson("#FFFFFF");
      const beamColor = alphaTab.model.Color.fromJson("#FFFFFF");

      for (const track of api.score.tracks) {
        for (const staff of track.staves) {
          for (const bar of staff.bars) {
            for (const voice of bar.voices) {
              for (const beat of voice.beats) {
                if (!beat.style) {
                  beat.style = new alphaTab.model.BeatStyle();
                }
                if (alphaTab.model.BeatSubElement.StandardNotationStem) {
                  beat.style.colors.set(
                    alphaTab.model.BeatSubElement.StandardNotationStem,
                    stemColor
                  );
                }
                if (alphaTab.model.BeatSubElement.StandardNotationFlags) {
                  beat.style.colors.set(
                    alphaTab.model.BeatSubElement.StandardNotationFlags,
                    flagColor
                  );
                }
                if (alphaTab.model.BeatSubElement.StandardNotationBeams) {
                  beat.style.colors.set(
                    alphaTab.model.BeatSubElement.StandardNotationBeams,
                    beamColor
                  );
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('高级样式API不可用或版本不匹配:', e);
    }
  }
}

export function resetToDefaultTheme(api: any) {
  if (!api) return;
  
  // 创建一个新的AlphaTab实例，获取默认设置
  // 注意：在浏览器环境之外（例如Node.js测试环境）直接创建DOM元素可能会失败
  // 这里假设代码在浏览器环境中运行
  let defaultSettings;
  try {
    defaultSettings = new alphaTab.AlphaTabApi(document.createElement('div')).settings;
  } catch (e) {
    console.error("无法创建临时的 AlphaTabApi 实例来获取默认设置:", e);
    // 提供一个备用的最小化资源对象，以避免在 document 不可用时完全失败
    api.settings.display.resources = {}; 
    api.updateSettings();
    return;
  }
  
  // 复制默认资源设置
  api.settings.display.resources = {
    ...defaultSettings.display.resources
  };
  
  // 应用设置
  api.updateSettings();
}

export function injectAlphaTabStyle(customStyleEnabled: boolean) {
  // 如果自定义样式未启用，直接返回
  if (!customStyleEnabled) return;

  const styleId = 'alphatab-custom-style';
  // 确保在浏览器环境中执行
  if (typeof document === 'undefined' || document.getElementById(styleId)) return; 

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
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
  document.head.appendChild(style);
}