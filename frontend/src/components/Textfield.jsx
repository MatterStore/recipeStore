export default function Textfield(props) {
  return (
    <label>
      <div className="font-bold text-slate-600">{props.children}</div>
      <input
        type="text"
        className={`py-3 px-6 mr-8 mb-4 w-full text-xl rounded-md whitespace-nowrap text-indigo-900 ring-inset ring-indigo-400 ring-2 ${props.className}`}
        {...props.params}
      />
    </label>
  );
}
