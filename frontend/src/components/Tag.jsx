export default function Tag(props) {
  return (
    <span
      className={`py-1.5 px-4 my-8 mr-4 text-md text-slate-900 text-center rounded-full whitespace-nowrap max-w-fit bg-amber-400`}
    >
      {props.children}
    </span>
  );
}
