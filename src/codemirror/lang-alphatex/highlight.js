// 此文件定义了 AlphaTex 语言的语法高亮规则。
// 它将 parser.js 中识别出的词法单元（tokens）映射到 Lezer 风格标签（tags），
// 并为这些标签指定具体的显示样式（如颜色、字体粗细等）。
// src/codemirror/lang-alphatex/highlight.js
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight'; // Standard tags

// 定义简化后的 AlphaTex 语言样式
export const alphaTexHighlightStyle = HighlightStyle.define([
  // 保留的样式
  { tag: tags.comment, color: '#6A9955', fontStyle: 'italic' }, // 注释
  { tag: tags.keyword, color: '#C586C0', fontWeight: 'bold' },   // 元命令 (e.g., \title)
  { tag: tags.string, color: '#CE9178' },                       // 字符串
  { tag: tags.bracket, color: '#569CD6', fontWeight: 'bold' },   // 所有括号: { } ( )
  { tag: tags.labelName, color: '#4EC9B0', fontWeight: 'bold' }, // 效果关键词 (dy, nh, etc.)
  { tag: tags.operator, color: '#D4D4D4' },                     // 操作符 (目前主要是 : )
  { tag: tags.invalid, color: '#FF0000', textDecoration: 'underline wavy red 1px' }, // 无效/未匹配

  // 数字 (所有数字统一颜色)
  { tag: tags.number, color: '#B5CEA8' }, // 例如独立数字, 以及音符中的数字部分

  // 小节线 - 普通 (保持之前的宽块样式)
  {
    tag: tags.strong, // 用于 barLine
    display: 'inline-block',
    width: '5px',
    height: '1.1em',
    backgroundColor: '#A0A0A0', // 普通小节线颜色
    color: 'transparent',
    verticalAlign: 'middle',
    margin: '0 2px',
  },
  // 小节线 - 高亮 (1, 6, 11...)
  {
    tag: tags.heading1, // 用于 barLineHighlight
    display: 'inline-block',
    width: '7px', // 高亮小节线稍宽一些
    height: '1.15em',
    backgroundColor: '#4A90E2', // 高亮小节线颜色
    color: 'transparent',
    verticalAlign: 'middle',
    margin: '0 2px',
  },

  // 以下标签的特定样式被移除，它们将显示为默认文本颜色:
  // tags.atom (曾用于 r, genericToken)
  // tags.propertyName (曾用于 noteString)
  // tags.attributeValue (曾用于 noteFret)
  // tags.unit (曾用于 noteDuration)
  // tags.separator (曾用于 noteSeparator, genericDot)
  // tags.punctuation (如果之前有为它定义样式的话)
]);

export const alphaTexSyntaxHighlighting = syntaxHighlighting(alphaTexHighlightStyle);

// 更新 tokenTable 以匹配新的简化样式
export const tokenTable = {
  "comment": tags.comment,
  "metaCommand": tags.keyword,
  "string": tags.string,
  "operator": tags.operator,        // 主要用于 :

  "effectBracketOpen": tags.bracket,
  "effectBracketClose": tags.bracket,
  "punctuationOpen": tags.bracket,
  "punctuationClose": tags.bracket,
  "unmatchedBracket": tags.invalid,

  "effectKeyword": tags.labelName,

  // 数字统一映射到 tags.number
  "number": tags.number,            // 独立数字
  "noteString": tags.number,        // 音符中的弦号部分
  "noteFret": tags.number,          // 音符中的品号部分
  "noteDuration": tags.number,      // 音符中的时长部分

  // 以下token将使用默认文本样式，因为它们映射到的tag不再有自定义style
  "restKeyword": tags.atom,         // 'r' (休止符) -> tags.atom (无特定样式)
  "genericToken": tags.atom,        // 通用词元 -> tags.atom (无特定样式)
  "noteSeparator": tags.punctuation, // 音符中的 '.' -> tags.punctuation (无特定样式)
  "genericDot": tags.punctuation,   // 通用 '.' -> tags.punctuation (无特定样式)

  "barLine": tags.strong,
  "barLineHighlight": tags.heading1,
};