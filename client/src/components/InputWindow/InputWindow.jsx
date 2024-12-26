const InputWindow = ({ input, setInput }) => {
  return (
    <textarea
      name="input"
      id="input"
      rows={4}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Custom Input"
      className="focus:outline-none w-full placeholder:text-sm text-inter placeholder:text-inter border-2 h-full border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white "
    ></textarea>
  );
};

export default InputWindow;
