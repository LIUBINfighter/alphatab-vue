# AlphaTab 自定义样式实现文档

本文档描述了 AlphaTab-Vue 组件中自定义样式的实现原理和可自定义的CSS选择器列表。

## 实现原理

自定义样式机制通过以下几个步骤实现：

1. **样式状态管理**：使用Vue的响应式系统管理样式状态
   ```js
   const customStyleEnabled = ref(false);  // 默认不启用自定义样式
   provide('customStyleEnabled', customStyleEnabled);  // 提供给样式控制组件
   provide('toggleCustomStyle', toggleCustomStyle);  // 提供切换方法
   ```

2. **样式切换按钮**：通过StyleControl组件实现UI交互
   - 使用Lucide图标库中的Sun/Moon组件表示日/夜间模式
   - 当用户点击按钮时调用toggleCustomStyle函数

3. **样式注入与移除**：通过DOM操作实现样式的动态添加和删除
   ```js
   // 移除现有样式
   const existingStyle = document.getElementById('alphatab-custom-style');
   if (existingStyle) {
     document.head.removeChild(existingStyle);
   }
   
   // 注入新样式
   const style = document.createElement('style');
   style.id = 'alphatab-custom-style';
   style.innerHTML = `/* CSS样式定义 */`;
   document.head.appendChild(style);
   ```

4. **触发重新渲染**：样式变更后触发AlphaTab重新渲染
   ```js
   alphaTabApi.value.render();  // 关键步骤：触发重新渲染
   ```

## 可自定义的CSS选择器

AlphaTab渲染的乐谱包含许多可自定义的元素，以下是主要的CSS选择器列表：

### 1. 全局容器

```css
.at-main { /* 主渲染区域 */ }
```

### 2. 音符相关

```css
/* 音符头部 */
.at-main .at-notehead,
.at-main svg .at-notehead,
.at-main g[data-name="notehead"] * { }

/* 音符整体 */
.at-main .at-note * { }

/* 符干 */
.at-main .at-stem,
.at-main svg .at-stem,
.at-main g[data-name="stem"] * { }
```

### 3. 五线谱和标记

```css
/* 五线谱线条 */
.at-main .at-staff-line,
.at-main svg .at-staff-line,
.at-main g[data-name="staff"] line { }

/* 小节线 */
.at-main .at-bar,
.at-main svg .at-bar,
.at-main g[data-name="bar"] * { }

/* 小节尾部双线 */
.at-main .at-bar[data-bar-type="double"],
.at-main svg .at-bar[data-bar-type="double"],
.at-main g[data-bar-type="double"] * { }

/* 连音线和延音线 */
.at-main .at-tie, 
.at-main .at-slur,
.at-main svg .at-tie,
.at-main svg .at-slur { }
```

### 4. 播放与交互

```css
/* 播放光标 */
.at-main .at-cursor,
.at-main svg .at-cursor,
.at-main g[data-name="cursor"] * { }

/* 播放高亮区域 */
.at-main .at-highlight,
.at-main svg .at-highlight,
.at-main g[data-name="highlight"] * { }

/* 小节高亮 */
.at-cursor-bar { }

/* 节拍高亮 */
.at-cursor-beat { }
```

### 5. 文本与标记

```css
/* 歌词和注释 */
.at-main .at-lyrics *,
.at-main .at-annotation * { }

/* 标题和备注等 */
.at-main .at-text * { }

/* 节拍器记号 */
.at-main .at-beat-text * { }
```

### 6. 吉他谱特有元素

```css
/* 吉他谱线 */
.at-main .at-string-line,
.at-main svg .at-string-line,
.at-main g[data-name="tab"] line { }

/* 吉他谱品格数字 */
.at-main .at-tab-note text,
.at-main g[data-name="tab-note"] text { }
```

## 样式属性示例

以下是一些常用的样式属性，可应用于上述选择器：

### 颜色与填充

```css
fill: #6a0dad;        /* SVG元素填充颜色 */
stroke: #3c4e7a;      /* SVG元素边框颜色 */
stroke-width: 1.5px;  /* SVG元素边框宽度 */
background-color: rgba(255, 242, 0, 0.25);  /* 背景色（用于非SVG元素） */
```

### 特效

```css
filter: drop-shadow(0 0 2px rgba(231, 76, 60, 0.7));  /* 添加阴影效果 */
box-shadow: 0 0 8px rgba(106, 13, 173, 0.3);          /* 盒阴影效果 */
```

### 文本样式

```css
font-weight: bold;    /* 字体粗细 */
```

## 示例主题：紫色主题

```css
/* 全局背景色 */
.at-main {
  background-color: #f8f4ff !important;
}

/* 音符颜色 */
.at-main .at-notehead {
  fill: #6a0dad !important; /* 紫色音符 */
}

/* 五线谱线条颜色 */
.at-main .at-staff-line {
  stroke: #1e2840 !important; /* 深蓝色线条 */
}

/* 播放光标颜色 */
.at-main .at-cursor {
  stroke: #e74c3c !important; /* 红色光标 */
  stroke-width: 3px !important; /* 更粗的光标 */
}
```

## 注意事项

1. 使用 `!important` 标志确保自定义样式覆盖 AlphaTab 默认样式
2. 提供多个选择器变体以确保样式适用于不同渲染模式
3. 修改样式后需要触发重新渲染以应用变更
4. 减少对内部结构高度依赖的样式，以适应 AlphaTab 版本更新
