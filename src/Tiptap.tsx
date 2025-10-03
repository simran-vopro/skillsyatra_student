import './style.css'

import { TextStyle } from '@tiptap/extension-text-style'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { Level } from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image';

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: 'max-width: 100%; height: auto; display: block; margin: 0 auto;',
      },
    }
  },
});

import { Node, mergeAttributes } from '@tiptap/core'

const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      style: { default: 'max-width:100%; display:block; margin:0 auto;' },
    }
  },
  parseHTML() {
    return [{ tag: 'video' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes)]
  },
});

const Audio = Node.create({
  name: 'audio',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      style: { default: 'max-width:100%; display:block; margin:0 auto;' },
    }
  },
  parseHTML() {
    return [{ tag: 'audio' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['audio', mergeAttributes(HTMLAttributes)]
  },
});

const Columns = Node.create({
  name: 'columns',
  group: 'block',
  content: 'column+',
  parseHTML() {
    return [{ tag: 'div[data-type="columns"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'columns', style: 'display:flex; gap:10px;' }), 0]
  },
})

const Column = Node.create({
  name: 'column',
  group: 'block',
  content: 'block+',
  parseHTML() {
    return [{ tag: 'div[data-type="column"]' }]
  },
  renderHTML({ node, HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'column', style: 'flex:1;' }), 0]
  },
})


const extensions = [TextStyle, StarterKit, ImageResize.configure({ inline: false }), Video, Audio, Columns,
  Column,]

function MenuBar({ editor }: { editor: Editor }) {
  const addColumns = () => {
    editor.chain().focus().insertContent({
      type: 'columns',
      content: [
        { type: 'column', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Left content' }] }] },
        { type: 'column', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Right content' }] }] },
      ],
    }).run()
  }


  const editorState = useEditorState({
    editor,
    selector: ctx => ({
      isBold: ctx.editor.isActive('bold') ?? false,
      canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
      isItalic: ctx.editor.isActive('italic') ?? false,
      canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
      isStrike: ctx.editor.isActive('strike') ?? false,
      canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
      isCode: ctx.editor.isActive('code') ?? false,
      canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
      canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
      isParagraph: ctx.editor.isActive('paragraph') ?? false,
      isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
      isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
      isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
      isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
      isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
      isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
      isBulletList: ctx.editor.isActive('bulletList') ?? false,
      isOrderedList: ctx.editor.isActive('orderedList') ?? false,
      isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
      isBlockquote: ctx.editor.isActive('blockquote') ?? false,
      canUndo: ctx.editor.can().chain().undo().run() ?? false,
      canRedo: ctx.editor.can().chain().redo().run() ?? false,
    }),
  })

  return (
    <div className="control-group">
      <div className="button-group">
        <button onClick={addColumns}>Add 2-Column Layout</button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={editorState.isStrike ? 'is-active' : ''}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={editorState.isCode ? 'is-active' : ''}
        >
          Code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editorState.isParagraph ? 'is-active' : ''}
        >
          Paragraph
        </button>
        {[1, 2, 3, 4, 5, 6].map(level => (
          <button
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level: level as Level }).run()}
            className={editorState[`isHeading${level}` as keyof typeof editorState] ? 'is-active' : ''}
          >
            H{level}
          </button>
        ))}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? 'is-active' : ''}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? 'is-active' : ''}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? 'is-active' : ''}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? 'is-active' : ''}
        >
          Blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          Hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          Redo
        </button>

        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/*';

            input.onchange = () => {
              const files = input.files;
              if (!files) return;

              Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                  editor
                    .chain()
                    .focus()
                    .setImage({ src: reader.result as string })
                    .run();
                };
                reader.readAsDataURL(file);
              });
            };

            input.click();
          }}
        >
          Upload Images
        </button>

        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'video/*'; // Only videos

            input.onchange = () => {
              const files = input.files;
              if (!files) return;

              Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                  editor.chain().focus().insertContent({
                    type: 'video',
                    attrs: { src: reader.result, controls: true },
                  }).run()

                };
                reader.readAsDataURL(file);
              });
            };

            input.click();
          }}
        >
          Upload Video
        </button>

        <button
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'audio/*'

            input.onchange = () => {
              const file = input.files?.[0]
              if (!file) return

              const reader = new FileReader()
              reader.onload = () => {
                editor.chain().focus().insertContent({
                  type: 'audio',
                  attrs: { src: reader.result as string, controls: true },
                }).run()
              }
              reader.readAsDataURL(file);
            }

            input.click();
          }}
        >
          Upload Audio
        </button>

      </div>
    </div>
  )
}

function Tiptap() {
  const editor = useEditor({
    extensions,
    content: `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYTRzLea_0zPoz0O7aO_fsZNjo8V5g5FEEpA&s" />`,
    onUpdate({ editor }) {
      const html = editor.getHTML()
      console.log('Current HTML:', html)
    },
  });



  return (
    <div style={{ padding: 20 }}>
      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} className="tiptap" />
    </div>
  )
}

export default Tiptap
