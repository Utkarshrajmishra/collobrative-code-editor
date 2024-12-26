import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/Editor/Editor";
import InputWindow from "../components/InputWindow/InputWindow";
import OutputWindow from "../components/OutputWindow/OutputWindow";
import axios from "axios";
import ReactPlayer from "react-player";
import { FaVideoSlash, FaVideo } from "react-icons/fa";
import { useSocket } from "../context/SocketProvider";
import Menu from "../components/Menu/Menu";
import peer from "../services/peer";

const Home = () => {
  const socket = useSocket();
  const { id } = useParams();
  const [remoteSocketId, setRemoteSocketId] = useState();
  const [theme, setTheme] = useState("vs-dark");
  const [langID, setLangID] = useState(63);
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [remoteStream, setRemotedStream] = useState("");
  const [output, setOutput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [stream, setStream] = useState(null);

  const handleCallUser = useCallback(async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const offer = await peer.getOffer();
      socket.emit("userCall", { to: id, offer });
      setStream(userStream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, [id, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      console.log(offer);

      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setStream(stream);
      const answer = await peer.getAnswer(offer);
      socket.emit("callAccepted", { to: from, answer });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (stream) {
      const senders = peer.peer.getSenders();
      stream.getTracks().forEach((track) => {
        const sender = senders.find((s) => s.track === track);
        if (!sender) {
          peer.peer.addTrack(track, stream);
        }
      });
    }
  }, [stream]);

  const handleCallAccepted = useCallback( async ({ from, answer }) => {
     await  peer.setLocalDescription(answer);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegotiationAccept = useCallback(async ({ from, offer }) => {
    const answer =await peer.getAnswer(offer);
    socket.emit("negotationDone", { to: from, answer });
  }, []);

   const handleNegotiationFinal = useCallback(async ({ answer }) => {
     await peer.setLocalDescription(answer);
   }, []);

   const handleNegotiation = useCallback(async () => {
     const offer = await peer.getOffer();
     socket.emit("peerNegotiation", { offer, to: remoteSocketId });
   }, [socket]);


  useEffect(() => {
    socket.emit("joinRoom", id);

    socket.on("getcode", setCode);
    socket.on("incomingCall", handleIncomingCall);
    socket.on("input", setInput);
    socket.on("output", setOutput);
    socket.on("getLang", ({ newLanguage }) => {
      setLangID(newLanguage.id);
      setLanguage(newLanguage.value);
    });
    socket.on("callAccepted", handleCallAccepted);
    socket.on("peerNegotiation", handleNegotiationAccept);
    socket.on("peerNegotiationFinal", handleNegotiationFinal);

    return () => {
      socket.off("getcode");
      socket.off("incomingCall");
      socket.off("input");
      socket.off("output");
      socket.off("getLang");
      socket.off("callAccepted");
      socket.off("peerNegotiation");
      socket.off("peerNegotiationFinal", handleNegotiationFinal);
    };
  }, [
    id,
    socket,
    handleIncomingCall,
    handleCallAccepted,
    setInput,
    handleNegotiationAccept,
    handleNegotiationFinal,
    setOutput,
    handleCallAccepted,
  ]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiation);

    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  });

 
  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log('Got Tracks')
      setRemotedStream(remoteStream[0])
    });
  });
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
            <div>
              {stream ? (
                <div className="relative w-full h-[240px] rounded-md overflow-hidden">
                  <ReactPlayer
                    url={stream}
                    playing
                    muted
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />
                </div>
              ) : (
                <div className="w-full outline outline-1 outline-black flex flex-col justify-center items-center font-inter text-zinc-400 bg-zinc-900 h-[240px] rounded-md">
                  <FaVideoSlash fontSize={25} />
                  <p>Video chat not started</p>
                </div>
              )}
            </div>
            <div>
              {remoteStream ? (
                <div className="relative w-full h-[240px] rounded-md overflow-hidden">
                  <ReactPlayer
                    url={remoteStream}
                    playing
                    muted
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />
                </div>
              ) : (
                <div className="w-full outline outline-1 outline-black flex flex-col justify-center items-center font-inter text-zinc-400 bg-zinc-900 h-[240px] rounded-md">
                  <FaVideoSlash fontSize={25} />
                  <p>Video chat not started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
