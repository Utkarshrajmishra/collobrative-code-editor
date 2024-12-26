import { Editor } from "@monaco-editor/react";

const CodeEditor = ({ code, theme, lang, onChange }) => {
  const handleChange = (values) => {
    if (values) {
      onChange("code", values);
    }
  };

  return (
    <div className="rounded-md">
      <Editor
        onChange={handleChange}
        language={lang}
        value={code}
        theme={theme}
        height="65vh"
        defaultLanguage="javascript"
      />
    </div>
  );
};

export default CodeEditor;
