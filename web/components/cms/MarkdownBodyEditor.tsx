"use client";

import { useMemo, useRef, useState } from "react";

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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inlineMarkdown(value: string) {
  let text = escapeHtml(value);
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return text;
}

/** Lightweight preview only — storage stays Markdown as before. */
function markdownToPreviewHtml(source: string) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (!listItems.length) return;
    html.push(`<ul>${listItems.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
    listItems = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
      continue;
    }
    flushList();
    if (line.startsWith("### ")) {
      html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
    } else {
      html.push(`<p>${inlineMarkdown(line)}</p>`);
    }
  }
  flushList();
  return html.join("") || "<p class='crm-cms-md-preview-empty'>ยังไม่มีเนื้อหาให้ดูตัวอย่าง</p>";
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
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [draft, setDraft] = useState(defaultValue ?? "");
  const previewHtml = useMemo(() => markdownToPreviewHtml(draft), [draft]);

  function run(action: (el: HTMLTextAreaElement) => void) {
    const el = ref.current;
    if (!el) return;
    action(el);
    setDraft(el.value);
  }

  return (
    <div className="crm-cms-md-editor">
      <div className="crm-cms-md-bar">
        <div className="crm-cms-md-modes" role="tablist" aria-label="โหมดแก้ไขเนื้อหา">
          <button
            type="button"
            className={`crm-cms-md-mode${mode === "write" ? " is-active" : ""}`}
            role="tab"
            aria-selected={mode === "write"}
            onClick={() => setMode("write")}
          >
            เขียน
          </button>
          <button
            type="button"
            className={`crm-cms-md-mode${mode === "preview" ? " is-active" : ""}`}
            role="tab"
            aria-selected={mode === "preview"}
            onClick={() => {
              if (ref.current) setDraft(ref.current.value);
              setMode("preview");
            }}
          >
            ดูตัวอย่าง
          </button>
        </div>
        {mode === "write" ? (
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
        ) : null}
      </div>

      {mode === "write" ? (
        <>
          <textarea
            ref={ref}
            className="crm-area crm-cms-editor-body"
            name={name}
            defaultValue={defaultValue}
            rows={rows}
            placeholder={placeholder}
            onChange={(event) => setDraft(event.target.value)}
          />
          <small className="crm-cms-md-hint">Markdown: # หัวข้อ · **หนา** · - รายการ · [ลิงก์](/path) · ![alt](/media/...)</small>
        </>
      ) : (
        <>
          <input type="hidden" name={name} value={draft} />
          <div
            className="crm-cms-md-preview"
            role="tabpanel"
            aria-label="ตัวอย่างเนื้อหา Markdown"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
          <small className="crm-cms-md-hint">ตัวอย่างอ่านง่ายเท่านั้น — ระบบยังบันทึกเป็น Markdown ตามเดิม</small>
        </>
      )}
    </div>
  );
}
