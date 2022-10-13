export default function FloatingMenu(props) {
  return (
    <div className="absolute shadow rounded right-0 top-8 z-50 bg-slate-50 ring-1 ring-slate-300 w-40">
      <ul>{props.children}</ul>
    </div>
  );
}
