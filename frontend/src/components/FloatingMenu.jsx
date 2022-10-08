import { useState } from "react";

export default function FloatingMenu(props) {
  function MenuEntry(props) {
    return <li className={`p-4 hover:bg-slate-200`}>
      {props.children}
    </li>
  } 
  function ParentMenuEntry(props) {
    const [open, setOpen] = useState(false);
    return <li 
      className={`p-4 hover:bg-slate-200 relative`}
      onMouseEnter={()=>setOpen(true)}
      onMouseLeave={()=>setOpen(false)}
    >
      {props.name}
      {
        open ? (
          <div className="absolute shadow-lg rounded right-[calc(10rem+1px)] w-40 top-0 z-50 bg-slate-50 ring-1 ring-slate-300">
            {props.children}
          </div>
        ) : null
      }
    </li>
  } 

    return (
      <div className="absolute shadow rounded right-0 top-8 z-50 bg-slate-50 ring-1 ring-slate-300 w-40">
        <ul>
          <MenuEntry>
            Edit Recipe
          </MenuEntry>
          <ParentMenuEntry name="Add to Collection">
            <MenuEntry>New Collection</MenuEntry>
            <hr />
            {
              ['🇬🇷 Greek', '🍕 Pizzas', '🥩 Meat lovers', '🇹🇭 Thai'].map(name => {return (
                <MenuEntry>{name}</MenuEntry>
              )})
            }
          </ParentMenuEntry>
          <MenuEntry>
            Delete Recipe
          </MenuEntry>
          <MenuEntry>
            Play Recipe Radio
          </MenuEntry>
        </ul>
      </div>
    );
  }
  