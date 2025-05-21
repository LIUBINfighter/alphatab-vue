// 声明 alphaTab 全局变量，或者如果 AlphaTab 提供类型定义，请导入它们
declare const alphaTab: any;

// 新增：验证颜色格式的函数
function isValidColorFormat(color: string): boolean {
  // 验证常见的颜色格式：#RGB, #RRGGBB, rgb(r,g,b), rgba(r,g,b,a)
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
  const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const rgbaRegex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]|0\.\d+)\s*\)$/;
  
  return hexRegex.test(color) || rgbRegex.test(color) || rgbaRegex.test(color);
}

// 新增：创建安全的颜色对象
function createSafeColor(api: any, colorStr: string): any {
  if (!colorStr || typeof colorStr !== 'string') {
    console.warn(`尝试创建颜色时收到无效值: ${colorStr}`);
    return null;
  }
  
  if (!isValidColorFormat(colorStr)) {
    console.warn(`颜色格式无效: ${colorStr}`);
    return null;
  }
  
  try {
    const color = api.model.Color.fromJson(colorStr);
    if (!color) {
      console.warn(`颜色创建失败: ${colorStr}`);
      return null;
    }
    return color;
  } catch (e) {
    console.error(`颜色创建出错: ${colorStr}`, e);
    return null;
  }
}

export function applyDarkThemeViaApi(api: any) {
  if (!api) return;
  
  try {
    // 记录初始状态，帮助调试
    console.log("应用深色主题 - 初始resources:", {...api.settings.display.resources});
    
    // 更新API的资源配置 - 使用更安全的方式
    const defaultResources = api.settings.display.resources || {};
    const darkThemeResources = {
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
      
      // 休止符和连音线颜色
      restColor: "#FFFFFF",
      slurColor: "#E0E0E0",
      tieColor: "#E0E0E0",
      
      // 特殊音符标记颜色
      tabGhostNoteColor: "#FF9E80",
      effectFontColor: "#B3E5FC",
      
      // 高亮和选中颜色
      selectionColor: "rgba(105, 240, 174, 0.2)",
      selectionBorderColor: "#69F0AE",
    };
    
    // 检查所有颜色格式
    Object.entries(darkThemeResources).forEach(([key, value]) => {
      if (typeof value === 'string' && !isValidColorFormat(value as string)) {
        console.warn(`颜色格式可能有问题: ${key} = ${value}`);
      }
    });
    
    // 直接替换而不是合并，避免可能的格式冲突
    api.settings.display.resources = darkThemeResources;
    
    // 记录最终设置的资源
    console.log("应用深色主题 - 最终resources:", {...api.settings.display.resources});
    
    try {
      // 应用更新的设置
      api.updateSettings();
    } catch (e) {
      console.error("应用资源设置时出错:", e);
      // 尝试恢复到默认资源
      api.settings.display.resources = defaultResources;
      api.updateSettings();
      return; // 如果基本设置都失败，不要继续执行高级样式设置
    }
  } catch (e) {
    console.error("设置深色主题资源时出错:", e);
    return; // 如果出错，不继续执行后面的高级样式设置
  }
  
  // 对于AlphaTab 1.5.0+，尝试使用更强大的样式系统
  if (api.score && typeof api.model !== 'undefined') {
    try {
      console.log("开始设置高级样式...");
      
      // 创建样式对象
      api.score.style = new api.model.ScoreStyle();
      
      // 创建主要颜色对象 - 使用安全函数
      const mainColor = createSafeColor(api, "#FFFFFF");
      if (mainColor) {
        api.score.style.colors.set(
          api.model.ScoreSubElement.MainGlyph, 
          mainColor
        );
        
        // 仅当主要颜色设置成功时，尝试设置其他颜色
        // 休止符颜色
        const restColor = createSafeColor(api, "#FFFFFF");
        if (restColor && api.model.ScoreSubElement.Rest) {
          api.score.style.colors.set(
            api.model.ScoreSubElement.Rest,
            restColor
          );
        }
        
        // 小节号颜色
        const barNumberColor = createSafeColor(api, "#FFFFFF");
        if (barNumberColor && api.model.ScoreSubElement.BarNumber) {
          api.score.style.colors.set(
            api.model.ScoreSubElement.BarNumber,
            barNumberColor
          );
        }
        
        // 简化符干、符尾、符杠的设置 - 暂时注释掉这部分复杂逻辑
        // 如果基本样式能正常工作，后续可以逐步添加回来
        
        // 应用样式变更
        try {
          api.render();
        } catch (e) {
          console.error("渲染样式时出错:", e);
        }
      } else {
        console.error("无法创建主要颜色对象，跳过高级样式设置");
      }
    } catch (e) {
      console.warn('高级样式API不可用或版本不匹配:', e);
    }
  }
}

export function resetToDefaultTheme(api: any) {
  if (!api) return;
  
  // 不再尝试创建新实例，直接使用一个空对象作为默认资源
  const defaultResources = {};
  
  try {
    // 重置为默认资源
    api.settings.display.resources = defaultResources;
    api.updateSettings();
  } catch (e) {
    console.error("重置到默认主题时出错:", e);
  }
  
  // 如果存在高级样式对象，也尝试清除它
  if (api.score && api.score.style) {
    try {
      api.score.style = null; // 或新建一个空的样式对象
      api.render();
    } catch (e) {
      console.error("重置高级样式时出错:", e);
    }
  }
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