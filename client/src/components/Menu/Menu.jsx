import { GoLink } from "react-icons/go";
import { IoCodeSlashSharp } from "react-icons/io5";
import LanguageDropDown from "../DropDown/LanguageDropDown";
const Menu = ({ handleChangeLang }) => {
  return (
    <div className="h-[55px] justify-between px-4 bg-black flex items-center">
      <button className="flex items-center justify-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-[0.92rem] font-inter  text-zinc-50 py-[6px] px-4 rounded-md">
        <GoLink />
        Share
      </button>
      <p className="text-zinc-50 hover:text-zinc-50  text-[0.9rem] font-inter font-[500]">
        <span className="text-zinc-400">Live Block / </span>{" "}
        Collaborative Code Editor
      </p>
      <div className="flex gap-3">
        <LanguageDropDown handleChangeLang={handleChangeLang} />
        <button className="flex gap-1 items-center justify-center bg-zinc-50 text-[0.92rem] font-inter  text-black py-[6px] px-4 rounded-md">
          <IoCodeSlashSharp />
          Compile
        </button>
      </div>
    </div>
  );
};

export default Menu;
