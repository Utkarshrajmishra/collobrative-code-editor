import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OutputDetails from "../components/OutputWindow/OutputDetail";
import ThemeDropDown from "../components/DropDown/ThemeDropDown";
import LanguageDropDown from "../components/DropDown/LanguageDropDown";
import CodeEditor from "../components/Editor/Editor";
import InputWindow from "../components/InputWindow/InputWindow";
import OutputWindow from "../components/OutputWindow/OutputWindow";
import axios from "axios";
import { io } from "socket.io-client";
import Menu from "../components/Menu/Menu";

const socket = io("http://localhost:3001");

const Home = () => {
  const [theme, setTheme] = useState("vs-dark");
  const [langID, setLangID] = useState(63);
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [processing, setProcessing] = useState(false);

  let { id } = useParams();

  useEffect(() => {
    socket.emit("joinRoom", id);
  }, []);

  useEffect(() => {
    socket.on("getcode", (payload) => {
      setCode(payload);
    });

    socket.on("input", (payload) => {
      setInput(payload);
    });

    socket.on("output", (payload) => {
      setOutput(payload);
    });

    socket.on("getLang", (payload) => {
      setLangID(payload.newLanguage.id);
      setLanguage(payload.newLanguage.value);
    });

    socket.on();
  }, [socket]);

  const handleChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleInputChange = (input) => {
    setInput(input);
    socket.emit("getinput", { input, id });
  };

  const handleOutputChange = (output) => {
    setOutput(output);
    socket.emit("getoutput", { output, id });
  };

  const handleChangeLang = (newLanguage) => {
    setLangID(newLanguage.id);
    setLanguage(newLanguage.value);
    socket.emit("setLanguage", { id, newLanguage });
  };

  const onChange = (codeType, code) => {
    if (codeType === "code") {
      socket.emit("code", { code, id });
      setCode(code);
    }
  };

  const handleCompile = () => {
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
        let status = err.response.status;
        if (status === 429) {
          alert("Servers are busy, please try again later!");
        }
        return setProcessing(false);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: `${import.meta.env.VITE_JUDGE_URL}/${token}`,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Host": import.meta.env.VITE_JUDGE_HOST,
        "X-RapidAPI-Key": import.meta.env.VITE_JUDGE_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      if (statusId === 1 || statusId === 2) {
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
      } else {
        setProcessing(false);
        handleOutputChange(response.data);
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
    }
  };

  return (
    <>
      <Menu handleChangeLang={handleChangeLang} />
      <div className="bg-stone-100 w-full flex">
        <div className="flex  flex-col w-[60%] p-3">
          <div className="flex-col w-full h-full justify-start items-end  rounded-md">
            <CodeEditor
              code={code}
              onChange={onChange}
              theme={theme}
              lang={language}
            />
          </div>
          <div>
            <h1 className="font-inter text-[1rem] bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 ">
              Output
            </h1>
            <div className="flex">
              <div className=" w-[50%] ">
                <OutputWindow
                  currentOutput={output}
                  handleOutput={handleOutputChange}
                />
              </div>
              <div className="w-[50%]">
                <InputWindow input={input} setInput={handleInputChange} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-col w-[40%] pr-4">
          <div className="flex flex-col items-end">
            <button
              onClick={handleCompile}
              disabled={!code}
              className={`mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0 ${
                !code ? "opacity-50" : ""
              }`}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
