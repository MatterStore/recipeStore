export default function MenuEntry(props) {
  return (
    <li className={`p-4 hover:bg-slate-200`} onClick={props.onClick}>
      {props.children}
    </li>
  );
}
