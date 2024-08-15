import { Editor } from "@monaco-editor/react";

const CodeEditor = ({code, theme, lang, onChange}) => {

  const handleChange=(values)=>{
    if(values){
      onChange('code',values)
    }
  }

  return (
    <Editor
    onChange={handleChange}
      language={lang}
      value={code}
      theme={theme}
      height="85vh"
      defaultLanguage="javascript"
    />
  );
};

export default CodeEditor;
