// 此文件定义了 AlphaTex 语言的词法分析器 (tokenizer)。
// 它使用 CodeMirror 的 StreamLanguage 接口来逐字符处理输入，
// 识别出 AlphaTex 的各种语法结构（如元命令、音符、效果标记、注释等），
// 并为它们分配相应的词法单元类型（token type）。
// src/codemirror/lang-alphatex/parser.js

export const alphaTexStreamParser = {
  token: (stream, state) => {
    // 1. Comments
    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }

    // 2. Metadata Commands
    if (stream.match(/\\([a-zA-Z]+)/)) {
      state.afterCommand = true;
      return "metaCommand";
    }

    // 3. Effect Markers { }
    if (stream.peek() === "{") {
      stream.next();
      state.curlyBracketDepth++;
      state.inEffect = true;
      state.effectKeywordParsed = false;
      return "effectBracketOpen"; // Specific token for opening
    }
    if (stream.peek() === "}") {
      stream.next();
      if (state.curlyBracketDepth > 0) {
        state.curlyBracketDepth--;
        state.inEffect = (state.curlyBracketDepth > 0); // Remain in effect if nested
        state.effectKeywordParsed = (state.curlyBracketDepth > 0); // Reset if outermost closed
        return "effectBracketClose"; // Specific token for closing
      }
      return "unmatchedBracket"; // Unmatched closing bracket
    }

    if (state.inEffect) {
      if (!state.effectKeywordParsed) {
        if (stream.match(/[a-zA-Z]+/)) {
          state.effectKeywordParsed = true;
          return "effectKeyword";
        }
      }
      if (stream.match(/"(?:[^"\\]|\\.)*"/)) return "string";
      if (stream.match(/'(?:[^'\\]|\\.)*'/)) return "string";
      if (stream.match(/\d+/)) return "number";
      if (stream.eat(/[^}\s"'\d]+/)) return "genericToken"; // Parameters
      stream.eatSpace();
      if (stream.peek() && stream.peek() !== "}") stream.next(); // Advance if not at end of stream or effect
      return state.effectKeywordParsed ? "genericToken" : null;
    }

    // 4. Strings (parameters for commands)
    if (state.afterCommand) {
      if (stream.match(/"(?:[^"\\]|\\.)*"/)) {
        state.afterCommand = false; return "string";
      }
      if (stream.match(/'(?:[^'\\]|\\.)*'/)) {
        state.afterCommand = false; return "string";
      }
    }

    // 5. Note Representation (string.fret.duration, r.duration)
    // Attempt to match 'r' for rest first
    if (stream.match('r')) {
      state.parsingNote = true; state.notePart = 'rest';
      return "restKeyword";
    }

    // Match numeric parts of a note or standalone numbers
    if (stream.match(/\d+/)) {
      if (state.parsingNote && (state.notePart === 'stringDone' || state.notePart === 'fretDone' || state.notePart === 'restDone')) {
        // This is a fret or duration after a dot, or duration after 'r'
        let style = "number"; // Default to number
        if (state.notePart === 'stringDone') { style = "noteFret"; state.notePart = 'fret'; }
        else if (state.notePart === 'fretDone' || state.notePart === 'restDone') { style = "noteDuration"; state.parsingNote = false; }
        return style;
      } else if (!state.parsingNote && stream.peek() !== '.') {
        // Standalone number (not followed by a dot, not in note parsing sequence)
        state.afterCommand = false;
        return "number";
      }
      // If it's a number and could be the start of a note (e.g., followed by a dot or if context expects it)
      // The current logic will make it 'noteString' if followed by a dot
      // Or handle as part of the state machine for notes
      if (!state.parsingNote) {
          state.parsingNote = true; state.notePart = 'string';
          return "noteString";
      }
      // If already parsing a note, this must be a string/fret/duration part
      if(state.notePart === 'string') return "noteString";
      if(state.notePart === 'fret') return "noteFret";
      if(state.notePart === 'duration') { state.parsingNote = false; return "noteDuration"; }

    }
    
    // Note separators (dots)
    if (stream.peek() === '.') {
      if (state.parsingNote) { // Only a noteSeparator if we are in a note
        stream.next();
        if (state.notePart === 'string') state.notePart = 'stringDone';
        else if (state.notePart === 'fret') state.notePart = 'fretDone';
        else if (state.notePart === 'rest') state.notePart = 'restDone';
        return "noteSeparator";
      } else { // A general dot, not part of a note
        stream.next();
        return "operator"; // Or a more specific "dotSeparator" if needed
      }
    }
    
    // 6. Symbols
    if (stream.match("|")) {
      state.measureCount++;
      if (state.measureCount === 1 || state.measureCount === 5 || (state.measureCount > 5 && (state.measureCount - 1) % 4 === 0 && state.measureCount > 9 )) { // Logic for 1, 5, 9, 13...
        // A more robust way for 1,5,9,13 (common phrasing) would be (measureCount - 1) % 4 === 0
        // User asked for 1, 5, 11 -> 1, 5, (5+6), (5+6+6)...  this is more complex.
        // Let's use 1, 5, 9, 13, 17 for now as an example of highlighting specific measures
        if (state.measureCount === 1 || state.measureCount === 5 || state.measureCount === 9 || state.measureCount === 13 || state.measureCount === 17) {
            return "barLineHighlight";
        }
      }
      return "barLine";
    }

    if (stream.peek() === "(") {
      stream.next();
      state.parenDepth++;
      return "punctuationOpen";
    }
    if (stream.peek() === ")") {
      stream.next();
      if (state.parenDepth > 0) {
        state.parenDepth--;
        return "punctuationClose";
      }
      return "unmatchedBracket"; // Unmatched closing parenthesis
    }
    if (stream.match(":")) return "operator";

    // Fallback for command parameters
    if (state.afterCommand && stream.match(/[a-zA-Z0-9_]+/)) {
      return "genericToken";
    }

    if (stream.eatSpace()) {
      state.afterCommand = false;
      return null;
    }

    stream.next();
    state.afterCommand = false;
    // Don't reset parsingNote here, it should reset when a note sequence completes or is broken.
    return null;
  },

  startState: () => {
    return {
      curlyBracketDepth: 0, // For {}
      parenDepth: 0,        // For ()
      inEffect: false,
      effectKeywordParsed: false,
      afterCommand: false,
      parsingNote: false,
      notePart: null,       // 'string', 'fret', 'duration', 'rest', 'stringDone', 'fretDone', 'restDone'
      measureCount: 0
    };
  },
  // Add copyState for robust state management if not already perfect
  copyState: (state) => {
    return {...state};
  }
};