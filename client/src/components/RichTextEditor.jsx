import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Heading from '@tiptap/extension-heading';
import './editor.css'; // if you have custom styling

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const setHeading = (level) => {
    if (level === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return '1';
    if (editor.isActive('heading', { level: 2 })) return '2';
    if (editor.isActive('heading', { level: 3 })) return '3';
    return 'paragraph';
  };

  return (
    <div className="menu-bar">
      <select
        value={getCurrentHeading()}
        onChange={(e) => {
          const val = e.target.value;
          setHeading(val === 'paragraph' ? 'paragraph' : parseInt(val));
        }}
      >
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="paragraph">Normal</option>
      </select>

      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
        <b>B</b>
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
        <i>I</i>
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'is-active' : ''}>
        <u>U</u>
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
        <s>S</s>
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • Bullets
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. List
      </button>
      <button
        onClick={() =>
          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: prompt('Enter URL') })
            .run()
        }
      >
        🔗 Link
      </button>
    </div>
  );
};

const RichTextEditor = ({ input, setInput }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      Link,
      TextStyle,
      Heading.configure({ levels: [1, 2, 3] }),
    ],
    content: input.description || '', // initial value like `value={input.description}`
    onUpdate: ({ editor }) => {
      setInput({ ...input, description: editor.getHTML() }); // like `onChange`
    },
  });

  return (
    <div className="editor-wrapper">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="editor" />
    </div>
  );
};

export default RichTextEditor;
