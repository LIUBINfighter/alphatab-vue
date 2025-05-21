// alphaTabStyleUtils.ts
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
  
  console.log("=== 深色主题设置开始 ===");
  console.log("使用 AlphaTab API 进行主题设置");
  
  try {
    // 记录初始状态，帮助调试
    console.log("应用深色主题 - 初始resources:", {...api.settings.display.resources});
    
    // 获取现有资源配置
    const currentResources = api.settings.display.resources || {};
    
    // 创建深色主题颜色配置
    const darkThemeColors = {
      // 配置深色主题颜色
      mainGlyphColor: "#FFFFFF",
      secondaryGlyphColor: "#FFFFFF",
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
      selectionColor: "#FFFFFF",
      selectionBorderColor: "#69F0AE",
    };
    
    // 检查所有颜色格式
    Object.entries(darkThemeColors).forEach(([key, value]) => {
      if (typeof value === 'string' && !isValidColorFormat(value as string)) {
        console.warn(`颜色格式可能有问题: ${key} = ${value}`);
      }
    });
    
    // 不替换整个对象，而是只更新颜色属性
    // 保留原始对象中的字体和其他配置
    for (const [key, value] of Object.entries(darkThemeColors)) {
      currentResources[key] = value;
    }
    
    // 记录最终设置的资源
    console.log("应用深色主题 - 最终resources:", {...currentResources});
    
    try {
      // 应用更新的设置
      api.updateSettings();
      console.log("✓ API 基础样式设置成功");
    } catch (e) {
      console.error("✗ API 基础样式设置失败:", e);
      return;
    }
  } catch (e) {
    console.error("✗ 设置深色主题资源时出错:", e);
    return;
  }
  
  // 对于AlphaTab 1.5.0+，尝试使用更强大的样式系统
  if (api.score && typeof api.model !== 'undefined') {
    console.log("正在尝试使用高级样式 API...");
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
  
  console.log("=== 深色主题设置完成 ===");
}

export function resetToDefaultTheme(api: any) {
  if (!api) return;
  
  try {
    // 不要尝试重置为空对象，而是使用内置的重置机制
    api.settings.core.fontFamily = 'Arial';  // 重置为默认字体
    
    // 重置所有我们可能更改过的资源颜色
    const defaultColors = {
      mainGlyphColor: "#000000",
      secondaryGlyphColor: "#FFFFFF",
      backgroundColor: "#FFFFFF",
      barNumberColor: "#000000",
      tabNoteColor: "#000000",
      scoreInfoColor: "#000000",
      titleColor: "#000000",
      subTitleColor: "#000000",
      wordsColor: "#000000",
      copyrightColor: "#000000",
      staffLineColor: "#000000",
      barSeparatorColor: "#000000",
      restColor: "#000000",
      slurColor: "#000000",
      tieColor: "#000000",
    };
    
    // 更新资源颜色
    for (const [key, value] of Object.entries(defaultColors)) {
      if (api.settings.display.resources[key] !== undefined) {
        api.settings.display.resources[key] = value;
      }
    }
    
    api.updateSettings();
  } catch (e) {
    console.error("重置到默认主题时出错:", e);
  }
  
  // 如果存在高级样式对象，也尝试清除它
  if (api.score && api.score.style) {
    try {
      api.score.style = null; // 清除样式对象
      api.render();
    } catch (e) {
      console.error("重置高级样式时出错:", e);
    }
  }
}

import { DARK_THEME_CSS } from './darkTheme';

export function injectAlphaTabStyle(customStyleEnabled: boolean) {
  // 如果自定义样式未启用，直接返回
  if (!customStyleEnabled) {
    console.log("CSS 回退样式已禁用");
    return;
  }

  console.log("正在应用 CSS 回退样式...");
  
  const styleId = 'alphatab-custom-style';
  // 确保在浏览器环境中执行
  if (typeof document === 'undefined') {
    console.log("✗ 未检测到浏览器环境，CSS 回退样式未应用");
    return;
  }
  
  if (document.getElementById(styleId)) {
    console.log("CSS 回退样式已存在，跳过注入");
    return;
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = DARK_THEME_CSS;
  document.head.appendChild(style);
  console.log("✓ CSS 回退样式已成功注入");
}