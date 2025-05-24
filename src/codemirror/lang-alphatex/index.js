// 此文件是 AlphaTex 语言支持包的入口点。
// 它导入了 parser.js 中定义的词法分析器和 highlight.js 中定义的语法高亮规则，
// 并将它们组合成一个 CodeMirror LanguageSupport 实例。
// 这个实例使得 CodeMirror 编辑器能够理解和正确显示 AlphaTex 代码，
// 同时还提供了诸如括号自动匹配等编辑辅助功能。
// src/codemirror/lang-alphatex/index.js
import { StreamLanguage } from '@codemirror/language';
import { alphaTexStreamParser } from './parser.js';
import { alphaTexSyntaxHighlighting, tokenTable } from './highlight.js';
import { LanguageSupport } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";

const alphaTexLanguage = StreamLanguage.define({
  ...alphaTexStreamParser,
  languageData: {
    commentTokens: { line: "//" },
    closeBrackets: { brackets: ["(", "{", '"', "'"] } // For auto-pairing
  },
  tokenTable
});

export function alphaTex() {
  return new LanguageSupport(
    alphaTexLanguage,
    [
      alphaTexSyntaxHighlighting,
      closeBrackets() // Add the closeBrackets extension
    ]
  );
}