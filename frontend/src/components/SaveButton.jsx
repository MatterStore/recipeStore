export default function SaveButton(props) {
  return (
    <button
      className={`py-3 px-6 m-8 ml-0 text-xl text-white text-center rounded-md whitespace-nowrap max-w-fit select-none ${
        props.primary
          ? `text-white bg-indigo-600 hover:bg-indigo-700`
          : `text-indigo-900 ring-inset ring-indigo-400 ring-2 hover:bg-indigo-100`
      } ${props.className}`}
      onClick={props.onClick}>
      {props.children}
    </button>
  );
}
