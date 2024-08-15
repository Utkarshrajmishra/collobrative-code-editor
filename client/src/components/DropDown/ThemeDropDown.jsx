import { useState } from "react";
import { Styles } from "../../constants/Style";
import { Theme } from "../../constants/Theme";
import Select from "react-select";

const ThemeDropDown = () => {
  const [selectedTheme, setSelectedTheme] = useState(Theme[0]);

  return <Select value={selectedTheme} options={Theme} styles={Styles} />;
};

export default ThemeDropDown;
