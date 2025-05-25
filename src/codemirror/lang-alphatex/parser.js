// 此文件定义了 AlphaTex 语言的词法分析器 (tokenizer)。
// 它使用 CodeMirror 的 StreamLanguage 接口来逐字符处理输入，
// 识别出 AlphaTex 的各种语法结构（如元命令、音符、效果标记、注释等），
// 并为它们分配相应的词法单元类型（token type）。
// src/codemirror/lang-alphatex/parser.js

// 此文件定义了 AlphaTex 语言的词法分析器 (tokenizer) 的 V1 版本。
// 它使用 CodeMirror 的 StreamLanguage 接口来逐字符处理输入，
// 识别出 AlphaTex 的核心语法结构（如元命令、音符、效果标记、注释等），
// 并为它们分配相应的词法单元类型（token type）。
// 这个 V1 版本专注于最基本的功能，以便快速迭代。

export const alphaTexStreamParser = {
  // token 函数是核心，它接收一个字符流 (stream) 和一个状态对象 (state)
  // 每次调用，它应该消耗流中的一个或多个字符，并返回一个表示这些字符类型的字符串 (token type)
  // 如果字符不属于任何特定类型，可以返回 null
  token: (stream, state) => {
    // 1. 处理行注释 (Line Comments)
    if (stream.match("//")) {
      stream.skipToEnd(); // 跳过到行尾
      return "comment";   // 返回 "comment" 词法单元类型
    }

    // 2. 处理元命令 (Meta Commands) - V1 仅支持 \title 和 \artist
    if (stream.peek() === "\\") {
      if (stream.match(/\\title|\\artist/)) {
        state.afterMetaCommand = true; // 设置状态，表示接下来可能是参数
        return "metaCommand";        // 返回 "metaCommand" 类型
      }
      // 对于 V1 不支持的其他元命令，简单消耗掉，避免卡住
      if (stream.match(/\\.*/)) {
          stream.eatWhile(/[^ \t\n\r]/); // 消耗命令名
          state.afterMetaCommand = true; // 假设它也可能有参数
          return "metaCommand.other"; // 标记为其他元命令，方便后续区分或忽略
      }
    }

    // 如果在元命令之后，尝试匹配参数（V1 中主要是字符串）
    if (state.afterMetaCommand) {
      // 匹配双引号字符串
      if (stream.match(/"(?:[^"\\]|\\.)*"/)) {
        // state.afterMetaCommand = false; // 通常参数后命令结束，但可能有多个参数或结尾的点
        return "string";
      }
      // 匹配单引号字符串 (如果AlphaTex支持)
      if (stream.match(/'(?:[^'\\]|\\.)*'/)) {
        // state.afterMetaCommand = false;
        return "string";
      }
      // 匹配元命令结尾的点
      if (stream.eat(".")) {
        state.afterMetaCommand = false; // 点之后元命令块明确结束
        return "metaCommand.end"; // 标记为元命令结束点
      }
      // 如果遇到空格，则认为参数可能结束了，但元命令块可能还没结束（等待点）
      if (stream.eatSpace()) {
        return null; // 空格本身不产生token，但消耗了它
      }
      // 如果是其他字符，并且前面是命令，则可能是未加引号的参数或错误
      // V1 简化处理：如果不是点或字符串，且不是空格，则认为元命令的参数部分结束
      if (!stream.peek() || stream.eol()) { // 如果是行尾或流尾
          state.afterMetaCommand = false;
      } else if (stream.peek() !== '"' && stream.peek() !== "'" && stream.peek() !== '.') {
          // 消耗一个非预期的字符，标记为错误或普通文本，然后结束 afterMetaCommand 状态
          // stream.next();
          // state.afterMetaCommand = false;
          // return "invalid";
          // 或者更宽容一点，认为元命令参数结束了
          state.afterMetaCommand = false;
          // 不消耗字符，让下一轮循环处理
      }
    }


    // 3. 处理时值上下文声明 (e.g., :4)
    if (stream.peek() === ":") {
      if (stream.match(/:\d+/)) {
        // 拆分 : 和 数字
        stream.backUp(stream.current().length - 1); // 回退到 : 之后
        stream.next(); // 消耗 :
        state.parsingDurationContext = true;
        return "durationContextMarker";
      }
    }
    if (state.parsingDurationContext) {
        if (stream.match(/\d+/)) {
            state.parsingDurationContext = false;
            return "durationContextValue";
        }
        // 如果 : 后面不是数字，则重置状态
        state.parsingDurationContext = false;
    }


    // 4. 处理音符 (Notes) 和 休止符 (Rests) - V1 简化版
    // 尝试匹配休止符 'r'
    if (stream.match("r", true, true)) { // 参数：匹配内容, 是否消耗, 是否不区分大小写
      state.afterRest = true;
      return "rest";
    }

    // 尝试匹配数字 (可能是品位或音符时值后缀)
    if (stream.match(/\d+/)) {
      if (stream.peek() === ".") { // 看起来像品位或带时值的音符/休止符的数字部分
        if (state.afterRest) { // r.4 中的 4
            // stream.backUp(stream.current().length); // 数字已经匹配，不需要回退
            // state.afterRest = false; // 将在匹配点后重置
            return "number"; // 暂时标记为通用number, highlight.js 中可以根据上下文细化
        } else { // 0.1 或 0.1.4 中的第一个 0
            // stream.backUp(stream.current().length);
            state.parsingNote = true;
            state.notePart = "fret";
            return "noteFret";
        }
      } else { // 单独的数字，V1 中不特意处理，除非是时值上下文
        return "number"; // 可能是独立的数字，或者时值（如果前面没有点）
      }
    }

    // 处理音符中的点和后续部分
    if (state.parsingNote && stream.eat(".")) {
      if (state.notePart === "fret") {
        state.notePart = "string";
        return "noteSeparator";
      } else if (state.notePart === "string") { // 0.1.4 中的第二个点
        state.notePart = "duration";
        return "noteSeparator"; // 也可以是 "durationSeparator"
      }
    }
    // 处理休止符后的点
    if (state.afterRest && stream.eat(".")) {
        state.notePart = "duration"; // 标记为解析时值
        return "noteSeparator"; // 或 "durationSeparator"
    }


    if (state.parsingNote || state.afterRest) {
      if (state.notePart === "string" && stream.match(/\d+/)) {
        state.notePart = "string_done"; // 准备好接收可能的时值
        return "noteStringPart";
      }
      if (state.notePart === "duration" && stream.match(/\d+/)) {
        state.parsingNote = false; // 音符/休止符解析完毕
        state.afterRest = false;
        state.notePart = null;
        return "noteDuration";
      }
      // 如果在解析音符/休止符过程中遇到空格或行尾，则认为当前音符/休止符结束
      if (stream.eol() || stream.eatSpace()) {
        state.parsingNote = false;
        state.afterRest = false;
        state.notePart = null;
        return null;
      }
    }


    // 5. 处理小节线 (Bar Lines)
    if (stream.eat("|")) {
      return "barLine";
    }

    // 6. 处理简单效果块 (Effect Blocks) - V1 仅支持 {pm} 和 {lr}
    if (stream.eat("{")) {
      state.inEffectBlock = true;
      return "effectBrace";
    }
    if (state.inEffectBlock) {
      if (stream.match("pm") || stream.match("lr")) {
        // 假设效果关键字后紧跟右括号
        if (stream.peek() === "}") {
          return "effectKeyword";
        } else {
          // 如果不是右括号，可能格式不对，或者有参数（V1不支持）
          // 为了V1简单，我们先假设关键字后就是右括号
          // stream.skipTo("}"); // 或者更安全地逐个匹配
          return "effectKeyword"; // 即使后面不是 '}' 也先标记，让 '}' 单独匹配
        }
      }
      if (stream.eat("}")) {
        state.inEffectBlock = false;
        return "effectBrace";
      }
      // 如果在效果块内，但不是 pm, lr 或 }, 则消耗一个字符并标记为效果块内容 (或错误)
      if (state.inEffectBlock) { // 再次检查，因为上面可能已经匹配了关键字
        stream.next();
        return "effectContent.unknown"; // V1 中效果块内不应有其他内容
      }
    }

    // 如果没有任何匹配，消耗一个字符，避免死循环
    // 这也充当了基本的错误处理，未识别的字符会被简单跳过
    if (stream.next()) {
        // 如果前面有未完成的解析状态，这里可能需要重置
        if (state.afterMetaCommand && !stream.match(/"(?:[^"\\]|\\.)*"/, false) && !stream.match(/'(?:[^'\\]|\\.)*'/, false) && !stream.match(/\./, false)) {
            state.afterMetaCommand = false; // 如果不是引号或点，认为元命令参数结束
        }
        if ((state.parsingNote || state.afterRest) && !stream.match(/\d|\./, false) ) { // 如果不是数字或点
            state.parsingNote = false;
            state.afterRest = false;
            state.notePart = null;
        }
        return "invalid"; // 标记为无效字符
    }

    // 如果流已结束
    return null;
  },

  // startState 返回解析器的初始状态对象
  startState: () => {
    return {
      afterMetaCommand: false,   // 是否在元命令 (\title, \artist) 之后，期待参数
      parsingDurationContext: false, // 是否在解析时值上下文 (如 :4)
      parsingNote: false,        // 是否正在解析音符 (如 0.1 or 0.1.4)
      notePart: null,            // 当前正在解析音符的哪个部分 ('fret', 'string', 'duration')
      afterRest: false,          // 是否在休止符 'r' 之后，期待可能的时值
      inEffectBlock: false       // 是否在效果块 {} 内部
    };
  },

  // (可选) copyState 用于复制状态对象，在需要回溯或复杂状态管理时重要
  // 对于 V1 的简单状态，浅拷贝通常足够
  copyState: (state) => {
    return {...state};
  },

  // (可选) indent 函数用于定义缩进逻辑，V1 暂时不实现
  // indent: (state, textAfter) => {
  //   return 0; // 或根据 state 和 textAfter 计算缩进
  // }
};