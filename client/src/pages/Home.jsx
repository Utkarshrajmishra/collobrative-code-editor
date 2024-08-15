import { useState } from "react";
import OutputDetails from "../components/OutputWindow/OutputDetail";
import ThemeDropDown from "../components/DropDown/ThemeDropDown";
import LanguageDropDown from "../components/DropDown/LanguageDropDown";
import CodeEditor from "../components/Editor/Editor";
import InputWindow from "../components/InputWindow/InputWindow";
import OutputWindow from "../components/OutputWindow/OutputWindow";
import axios from "axios";

const Home = () => {
  const [theme, setTheme] = useState("vs-dark");
  const [langID, setLangID] = useState(63);
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleChange = (newTheme) => {
    setTheme(newTheme);
    console.log(import.meta.env.VITE_REACT_JUDGE_URL);
  };

  const handleChangeLang = (newLanguage) => {
    setLangID(newLanguage.id);
    setLanguage(newLanguage.value);
  };

  const onChange = (codeType, code) => {
    if (codeType == "code") setCode(code);
  };

  const handleCompile = () => {
    //console.log(import.meta.env.VITE_API_HOST);

    setProcessing(true);
    const Data = {
      language_id: langID,
      source_code: btoa(code),
      stdin: btoa(input),
    };

    const options = {
      method: "POST",
      url: import.meta.env.VITE_JUDGE_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": import.meta.env.VITE_JUDGE_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_JUDGE_KEY,
      },
      data: Data,
    };

    axios
      .request(options)
      .then((res) => {
        const token = res.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        console.log(err);

        // get error status
        let status = err.response.status;
        //console.log("status", status);
        if (status === 429) {
          alert("Servers are busy, please try again later!");
        }
        return setProcessing(false);
      });
  };

  const checkStatus = async (token) => {
    console.log(import.meta.env.VITE_API_URL);
    const options = {
      method: "GET",
      url: import.meta.env.VITE_JUDGE_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": import.meta.env.VITE_JUDGE_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_JUDGE_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutput(response.data);
        //console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
      <div className="flex flex-row">
        <div className="py-2 px-4">
          <LanguageDropDown handleChangeLang={handleChangeLang} />
        </div>
        <div className="py-2 px-4">
          <ThemeDropDown handleChange={handleChange} />
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex-col w-full h-full justify-start items-end px-4">
          <CodeEditor
            code={code}
            onChange={onChange}
            theme={theme}
            lang={language}
          />
        </div>
        <div className="flex-col w-[40%] pr-4">
          <div className="right-container flex flex-shrink-0  flex-col">
            <OutputWindow currentOutput={output} />
          </div>
          <div className="flex flex-col items-end">
            <InputWindow input={input} setInput={setInput} />
            <button
              onClick={handleCompile}
              disabled={!code}
              className={`mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code ? "opacity-50" : ""`}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
            <div className="left-0">
              {output ? <OutputDetails outputInfo={output} /> : ""}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
