export default function FloatingMenu(props) {
    return (
        <div className="absolute rounded left-0 top-8 z-50 bg-slate-50 ring-1 ring-slate-200 w-40">
            <ul>
                {
                    ["Edit Recipe", "Add to collection", "Delete Recipe", "Play Recipe Radio"].map((v) => 
                        <li className={`p-4 hover:bg-slate-200 right`}>
                            {v}
                        </li>
                    )
                }
            </ul>
        </div>
    );
  }
  