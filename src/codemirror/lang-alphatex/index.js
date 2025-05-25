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
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete"; // Corrected to @codemirror/commands for v0.20+
// For CM6 v0.20+ closeBracketsKeymap might be in @codemirror/commands
// import {closeBracketsKeymap} from "@codemirror/view" // Or view, check your version
// Actually, closeBrackets itself is an extension, and its keymap comes from defaultKeymap or specific imports.
// Let's use the closeBrackets extension and assume the keymap handles it or can be added.

const alphaTexLanguage = StreamLanguage.define({
  ...alphaTexStreamParser,
  languageData: {
    commentTokens: { line: "//" },
    closeBrackets: { brackets: ["(", "{", '"', "'"] } // For auto-pairing
    // You might also want `indentation markers` or other language-specifics here
  },
  tokenTable
});

export function alphaTex() {
  return new LanguageSupport(
    alphaTexLanguage,
    [
      alphaTexSyntaxHighlighting,
      closeBrackets() // Add the closeBrackets extension
      // For the keymap, ensure defaultKeymap is included in your EditorView setup,
      // or add closeBracketsKeymap specifically if needed.
      // e.g., import {defaultKeymap} from "@codemirror/commands"
      // and add defaultKeymap to your main editor extensions.
    ]
  );
}