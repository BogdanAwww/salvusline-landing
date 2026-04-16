import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { uploadMedia } from "../lib/uploadMedia";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

function MenuBar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith("image/")) return;

    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1400,
      useWebWorker: true,
      fileType: "image/webp",
    }).catch(() => file);

    try {
      const publicUrl = await uploadMedia(compressed, "blog");
      editor.chain().focus().setImage({ src: publicUrl }).run();
    } catch {
      // silently fail — user can retry
    }
  }

  function handleAddLink() {
    const url = prompt("Enter URL:");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  }

  const btnStyle = (active?: boolean): React.CSSProperties => ({
    padding: "0.35rem 0.55rem",
    background: active ? "#EC6B15" : "#2a2a2a",
    color: active ? "#fff" : "#aaa",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: active ? 700 : 400,
    lineHeight: 1,
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.25rem",
        padding: "0.5rem",
        background: "#1a1a1a",
        border: "1px solid #333",
        borderBottom: "none",
        borderRadius: "8px 8px 0 0",
      }}
    >
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBold().run()} style={btnStyle(editor.isActive("bold"))} title="Bold">
        <strong>B</strong>
      </button>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleItalic().run()} style={btnStyle(editor.isActive("italic"))} title="Italic">
        <em>I</em>
      </button>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={btnStyle(editor.isActive("heading", { level: 2 }))} title="Heading 2">
        H2
      </button>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={btnStyle(editor.isActive("heading", { level: 3 }))} title="Heading 3">
        H3
      </button>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBulletList().run()} style={btnStyle(editor.isActive("bulletList"))} title="Bullet List">
        &bull; List
      </button>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleOrderedList().run()} style={btnStyle(editor.isActive("orderedList"))} title="Ordered List">
        1. List
      </button>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBlockquote().run()} style={btnStyle(editor.isActive("blockquote"))} title="Quote">
        &ldquo; Quote
      </button>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={handleAddLink} style={btnStyle(editor.isActive("link"))} title="Add Link">
        Link
      </button>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => fileInputRef.current?.click()} style={btnStyle()} title="Insert Image">
        Image
      </button>
      <div style={{ flex: 1 }} />
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().undo().run()} style={btnStyle()} title="Undo">
        Undo
      </button>
      <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().redo().run()} style={btnStyle()} title="Redo">
        Redo
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  // Capture initial value once — never feed changing state back into useEditor
  const initialContent = useRef(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleUpdate = useCallback(({ editor }: { editor: { getHTML: () => string } }) => {
    onChangeRef.current(editor.getHTML());
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing your blog post..." }),
    ],
    content: initialContent.current,
    onUpdate: handleUpdate,
  });

  return (
    <div>
      <MenuBar editor={editor} />

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "0 0 8px 8px",
          background: "#111",
          minHeight: 300,
        }}
      >
        <style>{`
          .tiptap-editor .tiptap {
            padding: 1rem;
            color: #fff;
            font-size: 0.95rem;
            line-height: 1.7;
            outline: none;
            min-height: 280px;
          }
          .tiptap-editor .tiptap p.is-editor-empty:first-child::before {
            color: #555;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
          }
          .tiptap-editor .tiptap h2 { font-size: 1.4rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
          .tiptap-editor .tiptap h3 { font-size: 1.15rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
          .tiptap-editor .tiptap p { margin: 0.5rem 0; }
          .tiptap-editor .tiptap ul, .tiptap-editor .tiptap ol { padding-left: 1.5rem; margin: 0.5rem 0; }
          .tiptap-editor .tiptap li { margin: 0.25rem 0; }
          .tiptap-editor .tiptap blockquote { border-left: 3px solid #EC6B15; padding-left: 1rem; margin: 1rem 0; color: #aaa; font-style: italic; }
          .tiptap-editor .tiptap a { color: #EC6B15; text-decoration: underline; }
          .tiptap-editor .tiptap img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }
          .tiptap-editor .tiptap hr { border: none; border-top: 1px solid #333; margin: 1.5rem 0; }
        `}</style>
        <div className="tiptap-editor">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
