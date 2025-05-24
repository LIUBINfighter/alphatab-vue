// src/codemirror/lang-alphatex/parser.js

// Note: For a StreamLanguage, we don't use StringStream directly from @codemirror/language.
// The 'stream' object passed to the token() method has the necessary API.

export const alphaTexStreamParser = {
  token: (stream, state) => {
    // 1. Comments
    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }

    // 2. Metadata Commands (e.g., \title, \tempo)
    if (stream.match(/\\([a-zA-Z]+)/)) {
      state.afterCommand = true; // State to help parse parameters
      return "metaCommand";
    }

    // 3. Effect Markers (e.g., {dy ppp}, {nh}, {tr 5 16}, {txt "Hello"})
    if (stream.peek() === "{") {
      stream.next(); // Consume '{'
      state.inEffect = true;
      state.effectKeywordParsed = false;
      return "effectBracket";
    }
    if (state.inEffect) {
      if (stream.peek() === "}") {
        stream.next(); // Consume '}'
        state.inEffect = false;
        state.effectKeywordParsed = false;
        return "effectBracket";
      }
      // Parse effect keyword (e.g., dy, nh, tr, txt, hide)
      if (!state.effectKeywordParsed) {
        if (stream.match(/[a-zA-Z]+/)) {
          state.effectKeywordParsed = true;
          return "effectKeyword";
        }
      }
      // Inside effect, parse parameters (strings, numbers, or generic)
      // Strings within effects
      if (stream.match(/"(?:[^"\\]|\\.)*"/)) return "string";
      if (stream.match(/'(?:[^'\\]|\\.)*'/)) return "string"; // if you support single quotes

      // Numbers within effects
      if (stream.match(/\d+/)) return "number";

      // Consume other characters within effect as generic parameters
      if (stream.eat(/[^}\s"'\d]+/)) return "genericToken"; // Consume other chars

      stream.eatSpace(); // Consume spaces
      if (stream.peek() !== "}") stream.next(); // advance if not at end
      return state.effectKeywordParsed ? "genericToken" : null; // Style as generic or let it be restyled if it's a new keyword
    }


    // 4. Strings (outside of commands/effects, if any specific direct string usage)
    // Typically strings are parameters to commands or effects, handled above/below.
    // If top-level strings are possible, add rule here.
    // For now, assuming strings are mainly within commands or effects.
    if (state.afterCommand || state.inEffect) {
        if (stream.match(/"(?:[^"\\]|\\.)*"/)) {
            state.afterCommand = false; // Consumed a string parameter
            return "string";
        }
        if (stream.match(/'(?:[^'\\]|\\.)*'/)) { // if you support single quotes
            state.afterCommand = false;
            return "string";
        }
    }


    // 5. Note Representation (e.g., 0.5.2, r.2)
    // This needs careful ordering and matching
    if (stream.match(/r(\.\d+)?/)) { // Rest: r or r.duration
        if (stream.current().includes('.')) {
            stream.backUp(stream.current().length); // Back up to parse components
            if (stream.match('r')) {
                state.parsingNote = true; state.notePart = 'rest';
                return "restKeyword";
            }
        } else { // just 'r'
            state.parsingNote = true; state.notePart = 'rest';
            return "restKeyword";
        }
    }

    // Match numeric parts of a note: string.fret.duration
    // This is a simplified approach for stream parsing.
    // It tries to identify numbers that could be part of a note.
    if (stream.match(/\d+(\.\d+(\.\d+)?)?/)) {
        // Check if it's a note or just a number.
        // This is tricky with stream parser. We'll assume numbers followed by dots are notes.
        // Or if we are in a state expecting notes.
        // For now, let's try a state-based approach or a more specific regex.
        stream.backUp(stream.current().length);

        if (stream.match(/\d+\.\d+\.\d+/)) { // Full note: string.fret.duration
            stream.backUp(stream.current().length);
            if (stream.match(/\d+/)) { state.parsingNote = true; state.notePart = 'string'; return "noteString"; }
        } else if (stream.match(/\d+\.\d+/)) { // Partial note: string.fret or fret.duration (if in state) or number.number
             stream.backUp(stream.current().length);
             if (state.parsingNote && state.notePart === 'stringDone') { // Expecting fret
                if (stream.match(/\d+/)) { state.notePart = 'fret'; return "noteFret"; }
             } else if (state.parsingNote && state.notePart === 'fretDone') { // Expecting duration
                if (stream.match(/\d+/)) { state.notePart = 'duration'; state.parsingNote = false; return "noteDuration"; }
             } else if (!state.parsingNote && stream.match(/\d+/)) { // Could be start of a note string, or just a number
                // If next is '.', assume it's a note string.
                if (stream.match(/\d+(?=\.)/)) {
                     state.parsingNote = true; state.notePart = 'string'; return "noteString";
                } else { // standalone number
                    stream.backUp(stream.current().length); // undo lookahead match
                    if(stream.match(/\d+/)) { state.afterCommand = false; return "number"; }
                }
             }
        } else if (state.parsingNote && (state.notePart === 'stringDone' || state.notePart === 'fretDone' || state.notePart === 'rest')) {
            // Expecting a duration after a rest or a fret
            if (stream.match(/\d+/)) {
                let style = (state.notePart === 'rest') ? "noteDuration" : "noteDuration";
                state.parsingNote = false;
                return style;
            }
        } else if (stream.match(/\d+/)) { // Could be a standalone number, or part of a \tempo or \capo
            state.afterCommand = false;
            return "number";
        }
    }
    
    // Note separators (dots) if we are parsing a note
    if (state.parsingNote && stream.peek() === '.') {
        stream.next();
        if (state.notePart === 'string') state.notePart = 'stringDone';
        else if (state.notePart === 'fret') state.notePart = 'fretDone';
        else if (state.notePart === 'rest') state.notePart = 'restDone'; // r. processed
        return "noteSeparator";
    }


    // 6. Symbols
    if (stream.match("|")) return "barLine";
    if (stream.match(/[()]/)) return "punctuation"; // Parentheses for grouping
    if (stream.match(":")) return "operator";   // Time prefix

    // Fallback for parameters after a command if not string/number
    if (state.afterCommand && stream.match(/[a-zA-Z0-9_]+/)) {
        // Example: \tuning E A D G B E -- these would be 'tuningToken'
        // This can be refined if specific commands have specific parameter syntax
        return "genericToken"; // or e.g. "tuningToken" if state.lastCommand === 'tuning'
    }


    // If we've consumed something that should reset afterCommand
    if (stream.current().trim() !== "" && !stream.match(/^\s+$/, false) && state.afterCommand && !['metaCommand'].includes(stream.lastToken())) {
        // If we matched something other than whitespace after a command, assume parameter consumed or new line
        // state.afterCommand = false; // This might be too aggressive, depends on how params are structured
    }


    // Handle spaces and advance
    if (stream.eatSpace()) {
      state.afterCommand = false; // Space usually separates command from value or ends its "immediacy"
      return null;
    }

    // If nothing else matches, consume one character and return null (no style)
    stream.next();
    state.afterCommand = false;
    state.parsingNote = false; // Reset note parsing state if unidentified char
    return null;
  },

  // Initial state
  startState: () => {
    return {
      inEffect: false,
      effectKeywordParsed: false,
      afterCommand: false, // True after a \command, expecting parameters
      parsingNote: false,  // True if currently parsing parts of a note
      notePart: null       // 'string', 'fret', 'duration', 'rest', 'stringDone', 'fretDone', 'restDone'
    };
  }
};