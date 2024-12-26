const OutputWindow = ({ currentOutput }) => {
  const Output = () => {
    let statusId = currentOutput?.status.id;

    if (statusId == 6) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(currentOutput?.compile_output)}
        </pre>
      );
    } else if (statusId == 5) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-green-500">
          {atob(currentOutput.stdout) !== null
            ? `${atob(currentOutput.stdout)}`
            : null}
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(currentOutput?.stderr)}
        </pre>
      );
    }
  };

  return (
    <>
       
      <div className="max-w-[375px] h-full bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto">
        {currentOutput ? <>{Output()}</> : null}
      </div>
    </>
  );
};

export default OutputWindow;
