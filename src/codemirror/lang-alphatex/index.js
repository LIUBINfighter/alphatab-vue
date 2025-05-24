// src/codemirror/lang-alphatex/index.js
import { StreamLanguage } from '@codemirror/language';
import { alphaTexStreamParser } from './parser.js';
import { alphaTexSyntaxHighlighting, tokenTable } from './highlight.js'; // Import the highlighter extension and tokenTable
import { LanguageSupport } from "@codemirror/language";

// Define the language using StreamLanguage and the token mapping
const alphaTexLanguage = StreamLanguage.define({
  ...alphaTexStreamParser, // Spread the parser's token and startState methods
  languageData: { // Provide language-specific data
    commentTokens: { line: "//" }
    // You can add other language data here if needed, e.g., closeBrackets, indent
  },
  tokenTable // Map token names from parser to Lezer highlight tags
});


// Function to create the LanguageSupport instance
export function alphaTex() {
  return new LanguageSupport(
    alphaTexLanguage, // The language definition
    alphaTexSyntaxHighlighting // The syntax highlighting style extension
    // You could also add other language-specific extensions here if needed
  );
}