import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/Editor/Editor";
import InputWindow from "../components/InputWindow/InputWindow";
import OutputWindow from "../components/OutputWindow/OutputWindow";
import axios from "axios";
import { FaVideo } from "react-icons/fa";
import { useSocket } from "../context/SocketProvider";
import Menu from "../components/Menu/Menu";
import peer from "../services/peer";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";

const Home = () => {
  const socket = useSocket();
  const { id } = useParams();
  const [theme, setTheme] = useState("vs-dark");
  const [langID, setLangID] = useState(63);
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState(id);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);

      // Add tracks before creating the offer
      stream.getTracks().forEach((track) => {
        peer.peer.addTrack(track, stream);
      });

      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteSocketId, offer });
    } catch (err) {
      console.error("Error in handleCallUser:", err);
    }
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      try {
        console.log("Incoming call from:", from);
        setRemoteSocketId(from);

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);

        // Add tracks before creating the answer
        stream.getTracks().forEach((track) => {
          peer.peer.addTrack(track, stream);
        });

        const ans = await peer.getAnswer(offer);
        socket.emit("call:accepted", { to: from, ans });
      } catch (err) {
        console.error("Error in handleIncommingCall:", err);
      }
    },
    [socket]
  );

  const handleCallAccepted = useCallback(({ from, ans }) => {
    try {
      if (peer.peer.signalingState === "have-local-offer") {
        peer.setLocalDescription(ans);
        console.log("Call Accepted!");
      } else {
        console.warn("Unexpected signaling state:", peer.peer.signalingState);
      }
    } catch (err) {
      console.error("Error in handleCallAccepted:", err);
    }
  }, []);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: id });
  }, [id, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);
  useEffect(() => {
    socket.emit("joinRoom", id);

    socket.on("getcode", setCode);
    socket.on("input", setInput);
    socket.on("output", setOutput);
    socket.on("getLang", ({ newLanguage }) => {
      setLangID(newLanguage.id);
      setLanguage(newLanguage.value);
    });

    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("getcode");
      socket.off("input");
      socket.off("output");
      socket.off("getLang");
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    id,
    socket,
    handleIncommingCall,
    handleCallAccepted,
    setInput,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    setOutput,
  ]);

  const handleInputChange = (newInput) => {
    setInput(newInput);
    socket.emit("getinput", { input: newInput, id });
  };

  const handleOutputChange = (newOutput) => {
    setOutput(newOutput);
    socket.emit("getoutput", { output: newOutput, id });
  };

  const handleChangeLang = (newLanguage) => {
    setLangID(newLanguage.id);
    setLanguage(newLanguage.value);
    socket.emit("setLanguage", { id, newLanguage });
  };

  const handleCodeChange = (codeType, newCode) => {
    if (codeType === "code") {
      setCode(newCode);
      socket.emit("code", { code: newCode, id });
    }
  };

  const handleCompile = async () => {
    setProcessing(true);
    const requestData = {
      language_id: langID,
      source_code: btoa(code),
      stdin: btoa(input),
    };

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_JUDGE_URL,
        requestData,
        {
          params: { base64_encoded: "true", fields: "*" },
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": import.meta.env.VITE_JUDGE_HOST,
            "X-RapidAPI-Key": import.meta.env.VITE_JUDGE_KEY,
          },
        }
      );
      checkStatus(data.token);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 429) {
        alert("Servers are busy, please try again later!");
      }
      setProcessing(false);
    }
  };

  const checkStatus = async (token) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_JUDGE_URL}/${token}`,
        {
          params: { base64_encoded: "true", fields: "*" },
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": import.meta.env.VITE_JUDGE_HOST,
            "X-RapidAPI-Key": import.meta.env.VITE_JUDGE_KEY,
          },
        }
      );

      if ([1, 2].includes(data.status?.id)) {
        setTimeout(() => checkStatus(token), 2000);
      } else {
        setProcessing(false);
        handleOutputChange(data);
      }
    } catch (error) {
      console.error("Error fetching status:", error);
      setProcessing(false);
    }
  };

  return (
    <>
      <Menu
        handleChangeLang={handleChangeLang}
        compile={handleCompile}
        disabled={!code}
        processing={processing}
      />
      <div className="bg-stone-100 w-full flex">
        <div className="flex flex-col w-[60%] p-3">
          <div className="flex-col w-full h-full justify-start items-end rounded-md">
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
              theme={theme}
              lang={language}
            />
          </div>
          <div>
            <h1 className="font-inter text-[1rem] bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Output
            </h1>
            <div className="flex">
              <div className="w-[50%]">
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
              onClick={handleCallUser}
              className="mt-4 border-2 flex items-center justify-center gap-1 text-[0.9rem] border-black rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-3 py-2 hover:shadow transition duration-200 bg-white"
            >
              <FaVideo /> Start Video Chat
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-5">
            <VideoPlayer stream={myStream} />
            <VideoPlayer stream={remoteStream} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
