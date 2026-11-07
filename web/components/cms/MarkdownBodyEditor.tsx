"use client";

import { useRef } from "react";

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after = "",
  placeholder = "ข้อความ",
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end) || placeholder;
  const next = value.slice(0, start) + before + selected + after + value.slice(end);
  textarea.value = next;
  textarea.focus();
  const cursor = start + before.length;
  textarea.setSelectionRange(cursor, cursor + selected.length);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function prefixLines(textarea: HTMLTextAreaElement, prefix: string) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const blockStart = value.lastIndexOf("\n", start - 1) + 1;
  const blockEnd = (() => {
    const index = value.indexOf("\n", end);
    return index === -1 ? value.length : index;
  })();
  const block = value.slice(blockStart, blockEnd);
  const nextBlock = block
    .split("\n")
    .map((line) => (line.startsWith(prefix) ? line : `${prefix}${line || "รายการ"}`))
    .join("\n");
  textarea.value = value.slice(0, blockStart) + nextBlock + value.slice(blockEnd);
  textarea.focus();
  textarea.setSelectionRange(blockStart, blockStart + nextBlock.length);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

export function MarkdownBodyEditor({
  name,
  defaultValue,
  placeholder,
  rows = 18,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function run(action: (el: HTMLTextAreaElement) => void) {
    const el = ref.current;
    if (!el) return;
    action(el);
  }

  return (
    <div className="crm-cms-md-editor">
      <div className="crm-cms-md-toolbar" role="toolbar" aria-label="เครื่องมือแก้ไขข้อความ">
        <button type="button" className="crm-users-secondary" onClick={() => run((el) => wrapSelection(el, "# ", "", "หัวข้อใหญ่"))}>
          H1
        </button>
        <button type="button" className="crm-users-secondary" onClick={() => run((el) => wrapSelection(el, "## ", "", "หัวข้อ"))}>
          H2
        </button>
        <button type="button" className="crm-users-secondary" onClick={() => run((el) => wrapSelection(el, "**", "**", "ตัวหนา"))}>
          หนา
        </button>
        <button type="button" className="crm-users-secondary" onClick={() => run((el) => wrapSelection(el, "*", "*", "ตัวเอียง"))}>
          เอียง
        </button>
        <button type="button" className="crm-users-secondary" onClick={() => run((el) => prefixLines(el, "- "))}>
          รายการ
        </button>
        <button
          type="button"
          className="crm-users-secondary"
          onClick={() => run((el) => wrapSelection(el, "[", "](/path)", "ข้อความลิงก์"))}
        >
          ลิงก์
        </button>
        <button
          type="button"
          className="crm-users-secondary"
          onClick={() => run((el) => wrapSelection(el, "![", "](/media/cms/example.jpg)", "คำอธิบายรูป"))}
        >
          รูป
        </button>
      </div>
      <textarea
        ref={ref}
        className="crm-area crm-cms-editor-body"
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
      />
      <small># หัวข้อใหญ่ · ## หัวข้อ · **หนา** · - รายการ · [ลิงก์](/path) · ![alt](/media/...)</small>
    </div>
  );
}
