// src/codemirror/lang-alphatex/highlight.js
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight'; // Standard tags

// Define the styles for our AlphaTex language
export const alphaTexHighlightStyle = HighlightStyle.define([
  { tag: tags.comment, color: '#6A9955', fontStyle: 'italic' },
  { tag: tags.keyword, /* For \metaCommands */ color: '#C586C0', fontWeight: 'bold' },
  { tag: tags.string, color: '#CE9178' },
  { tag: tags.number, color: '#B5CEA8' },
  { tag: tags.operator, /* For : and potentially . outside notes */ color: '#D4D4D4' },
  
  { tag: tags.meta, /* For { } effect brackets */ color: '#569CD6', fontWeight: 'bold' },
  { tag: tags.labelName, /* For effect keywords like dy, nh, tr, txt, hide */ color: '#4EC9B0', fontWeight: 'bold' },
  
  { tag: tags.atom, /* For r (rest marker) and generic tokens */ color: '#569CD6' }, 
  { tag: tags.propertyName, /* For Note string part */ color: '#9CDCFE' },
  { tag: tags.attributeValue, /* For Note fret part */ color: '#D7BA7D' },
  { tag: tags.unit, /* For Note duration part */ color: '#4EC9B0' },
  { tag: tags.separator, /* For . in notes */ color: '#808080' }, // Slightly different color for note separator
  
  { tag: tags.strong, /* For | barLine */ color: '#D4D4D4', fontWeight: 'bold' },
  { tag: tags.punctuation, /* For () */ color: '#D4D4D4' },
  // Note: genericToken is mapped to tags.atom above
]);

// This is the extension that gets passed to LanguageSupport
export const alphaTexSyntaxHighlighting = syntaxHighlighting(alphaTexHighlightStyle);

// This table maps the string token types returned by your StreamParser
// to the Lezer highlight tags.
export const tokenTable = {
  "comment": tags.comment,
  "metaCommand": tags.keyword,
  "string": tags.string,
  "number": tags.number,
  "operator": tags.operator, // For general operators like ':'

  "effectBracket": tags.meta,
  "effectKeyword": tags.labelName, // Corrected: maps to a valid tag
  "genericToken": tags.atom, // For parameters in effects or commands not otherwise classified

  "restKeyword": tags.atom, // 'r' for rest, using atom as it's a special literal
  "noteString": tags.propertyName,
  "noteFret": tags.attributeValue,
  "noteDuration": tags.unit,
  "noteSeparator": tags.separator, // For '.' within notes

  "barLine": tags.strong, // For '|'
  "punctuation": tags.punctuation, // For '()'
};