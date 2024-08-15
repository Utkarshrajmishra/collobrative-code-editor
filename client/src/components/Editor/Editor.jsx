import { Editor } from "@monaco-editor/react";

const CodeEditor = () => {
  return (
    <Editor
      language="javascript"
      theme="vs-dark"
      height="85vh"
      defaultLanguage="javascript"
    />
  );
};

export default CodeEditor;
