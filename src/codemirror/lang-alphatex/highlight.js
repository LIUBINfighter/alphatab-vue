// 此文件定义了 AlphaTex 语言的语法高亮规则。
// 它将 parser.js 中识别出的词法单元（tokens）映射到 Lezer 风格标签（tags），
// 并为这些标签指定具体的显示样式（如颜色、字体粗细等）。
// src/codemirror/lang-alphatex/highlight.js
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight'; // Standard Lezer tags

// V1 词法单元名称到 Lezer 标签的映射表
export const tokenTable = {
  "comment": t.lineComment,
  "metaCommand": t.keyword,             // For \title, \artist
  "metaCommand.other": t.keyword,     // For other \commands in V1 (can be styled differently if needed)
  "string": t.string,                 // For "quoted strings" in meta commands
  "metaCommand.end": t.punctuation,   // For the . after a meta command block

  "durationContextMarker": t.operator, // For : in :4
  "durationContextValue": t.number,   // For the 4 in :4

  "rest": t.atom,                     // For 'r'
  "noteFret": t.number,               // For the fret number in 0.1
  "noteStringPart": t.number,         // For the string number in 0.1
  "noteSeparator": t.separator,       // For the . in 0.1 or 0.1.4 or r.4
  "noteDuration": t.number,           // For the duration part like 4 in 0.1.4 or r.4

  "number": t.number,                 // For standalone numbers not covered by more specific rules
  "operator": t.operator,             // For standalone dots or other operators if any in future

  "barLine": t.strong,                // For |

  "effectBrace": t.bracket,           // For { and }
  "effectKeyword": t.keyword,         // For pm, lr
  "effectContent.unknown": t.invalid, // For any unexpected content within V1 effect blocks

  "invalid": t.invalid                // For any characters not matched by other rules
};

// V1 高亮样式定义
// (这部分你已经有了，保持不变)
export const alphaTexHighlightStyle = HighlightStyle.define([
  { tag: t.lineComment, color: '#6A9955', fontStyle: 'italic' },
  { tag: t.processingInstruction, /* For \ in commands (metaCommand will be keyword, this is if you had a specific token for just '\') */ color: '#C586C0' }, // Note: metaCommand is keyword, if you want just '\' to have a style, you'd need a token for it.
  { tag: t.keyword, /* For \title, \artist, {pm}, {lr}, etc. */ color: '#C586C0' },
  { tag: t.string, /* For "quoted strings" */ color: '#CE9178' },
  { tag: t.strong, /* For | bar lines */ color: '#A0A0A0', fontWeight: 'bold' },
  { tag: t.operator, /* For : in duration context */ color: '#D4D4D4' },
  { tag: t.punctuation, /* For . at end of meta blocks */ color: '#D4D4D4'},
  { tag: t.number, /* For fret, string, duration numbers */ color: '#B5CEA8' },
  { tag: t.separator, /* For . in notes like 0.1 */ color: '#FF6347', fontWeight: 'bold' },
  { tag: t.atom, /* For r (rest marker) */ color: '#569CD6' },
  { tag: t.bracket, /* For { } */ color: '#569CD6', fontWeight: 'bold' },
  { tag: t.name, /* For general identifiers (fallback, if you add an Identifier token) */ color: '#9CDCFE' }, // Currently parser.js doesn't explicitly output "identifier"
  { tag: t.invalid, /* For ErrorToken and unknown effect content */ color: '#FF0000', textDecoration: 'underline wavy red 1px' },
]);

export const alphaTexSyntaxHighlighting = syntaxHighlighting(alphaTexHighlightStyle);