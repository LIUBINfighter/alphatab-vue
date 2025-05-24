// 此文件定义了 AlphaTex 语言的语法高亮规则。
// 它将 parser.js 中识别出的词法单元（tokens）映射到 Lezer 风格标签（tags），
// 并为这些标签指定具体的显示样式（如颜色、字体粗细等）。
// src/codemirror/lang-alphatex/highlight.js
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight'; // Standard tags
import { styleTags } from '@lezer/highlight'; // For styleTags mapping

// Define the styles for our AlphaTex language
export const alphaTexHighlightStyle = HighlightStyle.define([
  { tag: tags.comment, color: '#6A9955', fontStyle: 'italic' },
  { tag: tags.keyword, /* For \metaCommands */ color: '#C586C0', fontWeight: 'bold' },
  { tag: tags.string, color: '#CE9178' },
  { tag: tags.number, color: '#B5CEA8' },
  { tag: tags.operator, /* For : and general . */ color: '#D4D4D4' },
  
  // Effect markers
  { tag: tags.bracket, /* For { ( ) } */ color: '#569CD6', fontWeight: 'bold' }, // Using bracket for all pairs now
  { tag: tags.labelName, /* For effect keywords like dy, nh, tr, txt, hide */ color: '#4EC9B0', fontWeight: 'bold' },
  
  // Notes
  { tag: tags.atom, /* For r (rest marker) and generic tokens */ color: '#569CD6' },
  { tag: tags.propertyName, /* For Note string part */ color: '#9CDCFE', fontStyle: 'italic' }, // Made italic for distinction
  { tag: tags.attributeValue, /* For Note fret part */ color: '#D7BA7D', fontWeight: 'bold' }, // Made bold
  { tag: tags.unit, /* For Note duration part */ color: '#82D0F0' }, // Slightly different color
  { tag: tags.separator, /* For . in notes */ color: '#FF6347', fontWeight: 'bold', fontSize: '1.1em'}, // Tomato red, bold, slightly larger

  // Bar lines
  { tag: tags.strong, /* For regular | barLine */ color: '#A0A0A0', fontWeight: 'bold', borderRight: '1px solid #888' }, // Darker grey, bold, with a subtle border
  { tag: tags.heading1, /* For highlighted bar lines (1,5,9,13) */ color: '#4A90E2', fontWeight: 'bolder', borderRight: '2px solid #4A90E2' }, // Blue, bolder, thicker border

  // Errors / Unmatched
  { tag: tags.invalid, color: '#FF0000', textDecoration: 'underline wavy red 1px' } // Red color, and attempt wavy (browser dependent)
]);

export const alphaTexSyntaxHighlighting = syntaxHighlighting(alphaTexHighlightStyle);

// Mapping our parser's token style names to the Lezer tags
export const tokenTable = {
  "comment": tags.comment,
  "metaCommand": tags.keyword,
  "string": tags.string,
  "number": tags.number,
  "operator": tags.operator,

  "effectBracketOpen": tags.bracket, // Map to general bracket
  "effectBracketClose": tags.bracket,
  "punctuationOpen": tags.bracket,
  "punctuationClose": tags.bracket,
  "unmatchedBracket": tags.invalid, // For unmatched } and )

  "effectKeyword": tags.labelName,
  "genericToken": tags.atom,

  "restKeyword": tags.atom,
  "noteString": tags.propertyName,
  "noteFret": tags.attributeValue,
  "noteDuration": tags.unit,
  "noteSeparator": tags.separator,

  "barLine": tags.strong,
  "barLineHighlight": tags.heading1, // Using heading1 as a distinct, strong tag
};