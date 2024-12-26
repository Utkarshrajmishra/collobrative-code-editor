export const Styles = {
  control: (provided) => ({
    ...provided,
    height: "39px", // Matches button height
    padding: "0", // Removes additional padding
    borderRadius: "0.375rem", // Matches rounded-md
    backgroundColor: "#171717", // bg-neutral-900
    color: "#f4f4f5", // text-zinc-50
    fontSize: "0.9rem", // Matches text-[0.92rem]
    fontFamily: "Inter, sans-serif", // Matches font-inter
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    ":hover": {
      backgroundColor: "#262626", // hover:bg-neutral-800
    },
    border: "none", // Removes the default border
    boxShadow: "none", // Removes focus shadow
  }),
  menu: (provided) => ({
    fontSize: "0.9rem", // Matches text-[0.92rem]
    fontFamily: "Inter, sans-serif", // Matches font-inter
    ...provided,
    backgroundColor: "#171717", // Matches the dropdown background
    color: "#f4f4f5", // Matches text color
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "0.9rem", // Matches text-[0.92rem]
    fontFamily: "Inter, sans-serif", // Matches font-inter
    color: "#f4f4f5", // Ensures selected text matches
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "0.9rem", // Matches text-[0.92rem]
    fontFamily: "Inter, sans-serif", // Matches font-inter
    backgroundColor: state.isFocused ? "#262626" : "#171717", // Highlight on hover
    color: state.isFocused ? "#f4f4f5" : "#d4d4d8", // Slightly lighter text for non-hover
  }),
};
