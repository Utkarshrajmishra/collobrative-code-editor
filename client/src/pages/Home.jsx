import LanguageDropDown from "../components/DropDown/LanguageDropDown";
import ThemeDropDown from "../components/DropDown/ThemeDropDown";
import CodeEditor from "../components/Editor/Editor";
import InputWindow from "../components/InputWindow/InputWindow";
const Home = () => {
  return (
    <>
      <LanguageDropDown />
      <ThemeDropDown />
      <InputWindow/>
    </>
  );
};

export default Home;
