import { GoLink } from "react-icons/go";
import { IoCodeSlashSharp } from "react-icons/io5";
import LanguageDropDown from "../DropDown/LanguageDropDown";
const Menu = ({ handleChangeLang, compile, disabled, processing }) => {
  const handleShareClick = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert(
          "Link copied to clipboard! Share it with your friends and enjoy a seamless pair programming experience"
        );
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  return (
    <div className="h-[55px] justify-between px-4 bg-black flex items-center">
      <button
        onClick={handleShareClick}
        className="flex items-center justify-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-[0.92rem] font-inter  text-zinc-50 py-[6px] px-4 rounded-md"
      >
        <GoLink />
        Share
      </button>
      <p className="text-zinc-50 hover:text-zinc-50 hidden lg:inline-block text-[0.9rem] font-inter font-[500]">
        <span className="lg:text-zinc-400 ">Live Block / </span>{" "}
        <span className="">Collaborative Code</span>
        Editor
      </p>
      <div className="flex gap-3">
        <LanguageDropDown handleChangeLang={handleChangeLang} />
        <button
          onClick={compile}
          disabled={disabled}
          className="flex gap-1 items-center justify-center bg-zinc-50 text-[0.92rem] font-inter  text-black py-[6px] px-4 rounded-md"
        >
          {processing ? (
            "Processing..."
          ) : (
            <>
              <IoCodeSlashSharp /> Compile
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Menu;
