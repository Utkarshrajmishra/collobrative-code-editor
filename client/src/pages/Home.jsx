import LanguageDropDown from "../components/DropDown/LanguageDropDown";
import ThemeDropDown from "../components/DropDown/ThemeDropDown";
import CodeEditor from "../components/Editor/Editor";
const Home = () => {
  return (
    <>
      <LanguageDropDown />
      <ThemeDropDown />
      <CodeEditor/>
    </>
  );
};

export default Home;
