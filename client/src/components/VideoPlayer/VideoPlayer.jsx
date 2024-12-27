import { FaVideoSlash } from "react-icons/fa";
import ReactPlayer from "react-player";

const VideoPlayer = ({ stream }) => {
  return (
    <div>
      {stream ? (
        <div className=" w-[100%] bg-neutral-900 rounded-md overflow-hidden">
          <ReactPlayer url={stream}  playing muted width="100%" height="242px" />
        </div>
      ) : (
        <div className="w-full outline outline-1 outline-black flex flex-col justify-center items-center font-inter text-zinc-400 bg-zinc-900 h-[240px] rounded-md">
          <FaVideoSlash fontSize={25} />
          <p>Video chat not started</p>
        </div>
      )}
    </div>
  );
};
export default VideoPlayer;
