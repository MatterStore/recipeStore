export default function Formfield(props) {
  const { type, placeholder, setFunc } = props;
  return (
    <label className="mt-2 mb-2">
      <div className="font-bold text-slate-600">{props.children}</div>
      <input
        className="form-control py-3 px-6 mr-8 w-full text-xl rounded-md whitespace-nowrap text-indigo-900 ring-inset ring-indigo-400 ring-2"
        type={type}
        id={`${type}Input`}
        name={`${type}Input`}
        placeholder={placeholder}
        onChange={(event) => setFunc(event.target.value)}
      />
      <small id="emailHelp" className="text-red-600 mt-2">
        {props.error}
      </small>
    </label>
  );
}
