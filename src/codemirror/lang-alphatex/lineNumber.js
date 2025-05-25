// src/codemirror/lang-alphatex/lineNumbers.js
import { EditorView, Decoration, WidgetType } from "@codemirror/view";
import { StateField } from "@codemirror/state";

class MeasureNumberWidget extends WidgetType {
  constructor(number, isHighlighted) {
    super();
    this.number = number;
    this.isHighlighted = isHighlighted;
  }
  toDOM() {
    let span = document.createElement("span");
    span.textContent = String(this.number);
    // ... (完整的样式和逻辑如前例所示) ...
    span.style.marginLeft = "3px";
    span.style.padding = "1px 4px";
    span.style.fontSize = "0.75em";
    span.style.borderRadius = "3px";
    span.style.userSelect = "none";
    if (this.isHighlighted) {
      span.style.backgroundColor = "#4A90E2";
      span.style.color = "white";
    } else {
      span.style.backgroundColor = "#f0f0f0";
      span.style.color = "#555";
    }
    return span;
  }
  ignoreEvent() { return true; }
}

function computeDecorations(state) {
  let decorations = [];
  let measureCount = 0;
  for (let pos = 0; pos < state.doc.length; ) {
    let char = state.doc.sliceString(pos, pos + 1);
    if (char === '|') {
      measureCount++;
      let isHighlighted = (measureCount === 1 || (measureCount > 1 && (measureCount - 1) % 5 === 0));
      let widget = new MeasureNumberWidget(measureCount, isHighlighted);
      decorations.push(Decoration.widget({
        widget: widget,
        side: 1,
      }).range(pos + 1));
    }
    pos++;
  }
  return Decoration.set(decorations, true);
}

export const measureNumberDecorations = StateField.define({
  create(state) {
    return computeDecorations(state);
  },
  update(decorations, transaction) {
    if (transaction.docChanged) {
      return computeDecorations(transaction.state);
    }
    return decorations;
  },
  provide: f => EditorView.decorations.from(f)
});