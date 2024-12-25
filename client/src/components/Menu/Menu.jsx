import { GoLink } from "react-icons/go";
import { IoCodeSlashSharp } from "react-icons/io5";
const Menu = () => {
  return (
    <div className="h-[50px] justify-between px-4 bg-black flex items-center">
      <button className="bg-neutral-900 text-[0.92rem] font-inter  text-zinc-50 py-1 px-5 rounded-md">
        Share
      </button>
      <p className="text-zinc-50 text-[0.9rem] font-inter font-[500]">
        Collaborative Code Editor
      </p>
      <div className="flex gap-3">
        <button className="flex items-center justify-center gap-1 bg-neutral-900 text-[0.92rem] font-inter  text-zinc-50 py-1 px-4 rounded-md">
            <GoLink/>
          Share
        </button>
        <button className="flex gap-1 items-center justify-center bg-zinc-50 text-[0.92rem] font-inter  text-black py-1 px-4 rounded-md">
            <IoCodeSlashSharp/>
          Compile
        </button>
      </div>
    </div>
  );
};

export default Menu;
