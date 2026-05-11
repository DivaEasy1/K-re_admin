"use client";

import { useEffect } from "react";
import type { ComponentType } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Eraser,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  Underline as UnderlineIcon,
  Undo2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: string;
  onChange: (content: string) => void;
  label?: string;
}

interface ToolbarButtonProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  title: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const HTML_ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  "#039": "'",
  nbsp: " "
};

function decodeHtmlEntities(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    const normalizedEntity = String(entity).toLowerCase();

    if (normalizedEntity.startsWith("#x")) {
      const codePoint = Number.parseInt(normalizedEntity.slice(2), 16);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    if (normalizedEntity.startsWith("#")) {
      const codePoint = Number.parseInt(normalizedEntity.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    return HTML_ENTITY_MAP[normalizedEntity] ?? match;
  });
}

function normalizeEditorValue(value?: string | null) {
  return decodeHtmlEntities(value).trim();
}

function ToolbarButton({ icon: Icon, label, title, isActive, disabled, onClick }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-9 min-w-9 rounded-xl border border-transparent px-2.5 text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900",
        isActive && "border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
      )}
      title={title}
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export function RichTextEditor({ value, onChange, label }: RichTextEditorProps) {
  const normalizedValue = normalizeEditorValue(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2]
        },
        bulletList: {
          keepMarks: true
        },
        orderedList: {
          keepMarks: true
        },
        paragraph: {
          HTMLAttributes: {
            class: "rich-text-paragraph"
          }
        }
      }),
      Underline
    ],
    content: normalizedValue,
    editorProps: {
      attributes: {
        class:
          "min-h-[380px] px-5 py-4 text-base leading-7 text-slate-700 outline-none focus:ring-0"
      }
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.isEmpty ? "" : currentEditor.getHTML());
    }
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextValue = normalizeEditorValue(value);

    if (!nextValue) {
      if (!editor.isEmpty) {
        editor.commands.clearContent(false);
      }

      return;
    }

    if (editor.getHTML() !== nextValue) {
      editor.commands.setContent(nextValue, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const text = editor.getText().trim();
  const wordCount = text ? text.split(/\s+/).length : 0;

  return (
    <div className="space-y-3">
      {label ? <label className="block text-sm font-medium text-slate-700">{label}</label> : null}

      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-md">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/50 px-4 py-4">
          <ToolbarButton
            icon={Bold}
            label="Gras"
            title="Gras"
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            icon={Italic}
            label="Italique"
            title="Italique"
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            icon={UnderlineIcon}
            label="Souligne"
            title="Souligne"
            isActive={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />

          <div className="mx-1 h-8 w-px bg-slate-300" />

          <ToolbarButton
            icon={Pilcrow}
            label="Paragraphe"
            title="Paragraphe"
            isActive={editor.isActive("paragraph")}
            onClick={() => editor.chain().focus().setParagraph().run()}
          />
          <ToolbarButton
            icon={Heading1}
            label="Titre 1"
            title="Titre 1"
            isActive={editor.isActive("heading", { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          />
          <ToolbarButton
            icon={Heading2}
            label="Titre 2"
            title="Titre 2"
            isActive={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          />

          <div className="mx-1 h-8 w-px bg-slate-300" />

          <ToolbarButton
            icon={List}
            label="Liste a puces"
            title="Liste a puces"
            isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            icon={ListOrdered}
            label="Liste numerotee"
            title="Liste numerotee"
            isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            icon={Quote}
            label="Citation"
            title="Citation"
            isActive={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            icon={Eraser}
            label="Nettoyer"
            title="Effacer la mise en forme"
            disabled={editor.isEmpty}
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          />

          <div className="mx-1 h-8 w-px bg-slate-300" />

          <ToolbarButton
            icon={Undo2}
            label="Annuler"
            title="Annuler"
            disabled={!editor.can().chain().focus().undo().run()}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolbarButton
            icon={Redo2}
            label="Retablir"
            title="Retablir"
            disabled={!editor.can().chain().focus().redo().run()}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </div>

        <div className="relative bg-white">
          {editor.isEmpty ? (
            <p className="pointer-events-none absolute left-5 top-4 max-w-lg text-sm leading-7 text-slate-400">
              Ajoutez une presentation detaillee, des points forts, des conseils pratiques ou une mise en contexte pour la station.
            </p>
          ) : null}

          <EditorContent editor={editor} className="rich-text-editor" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/50 px-4 py-3 text-xs text-slate-500">
          <p>Astuce: utilisez les titres, les citations et les listes pour rendre la page plus lisible.</p>
          <p className="font-medium text-slate-600">{wordCount} mot{wordCount > 1 ? "s" : ""}</p>
        </div>
      </div>
    </div>
  );
}
