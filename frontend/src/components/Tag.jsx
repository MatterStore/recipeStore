export default function Tag(props) {
  return (
    <span
      className={`inline-block box-content py-1.5 px-4 mr-4 text-md text-slate-900 rounded-full whitespace-nowrap max-w-fit bg-amber-400 ${props.className}`}
    >
      {props.children}
    </span>
  );
}
