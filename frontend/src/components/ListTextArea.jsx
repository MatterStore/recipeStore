import { useState } from 'react';
import { NoteIcon, TrashIcon } from '@primer/octicons-react';

export default function ListTextArea(props) {
  const toggleMode = () => {
    if (props.listMode) {
      // list mode to free text
      if (props.ordered) {
        setFreeText(
          props.items.map((item, index) => `${index + 1}. ${item}`).join('\n')
        );
      } else {
        setFreeText(props.items.map((item, index) => ` - ${item}`).join('\n'));
      }
    } else {
      const lines = freeText
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) =>
          line.replace(new RegExp('^([0-9]+|-| -)(.| |:)( )*'), '')
        ); // Remove list prefixes
      props.setItems(lines);
    }

    props.setListMode(!props.listMode);
  };

  const ModeToggleButton = (props) => {
    return (
      <span className="cursor-pointer" onClick={toggleMode}>
        {props.listMode ? props.listElementsIcon : <NoteIcon size={24} />}
      </span>
    );
  };
  const addItem = () => {
    let clone = Object.assign([], props.items);
    clone.push('');
    props.setItems(clone);
  };
  const setItem = (index, item) => {
    let clone = Object.assign([], props.items);
    clone[index] = item;
    props.setItems(clone);
  };
  const deleteStep = (index) => {
    let clone = Object.assign([], props.items);
    clone.splice(index, 1);
    props.setItems(clone);
  }
  const [freeText, setFreeText] = useState('');

  return (
    <section className="mb-12">
      <h3 className="text-xl font-bold mb-4 max-w-xl">
        {props.title}
        {props.editing ? (
          <span className="float-right">
            <ModeToggleButton
              listElementsIcon={props.listElementsIcon}
              listMode={props.listMode}
              setListMode={props.setListMode}
            />
          </span>
        ) : null}
      </h3>

      <div>
        {props.editing ? (
          props.listMode ? (
            <div>
              <ul className="list-disc ml-5 leading-relaxed text-xl">
                {props.items.map((item, i) => (
                  <li key={i} className="list-item max-w-xl px-5 py-1.5 relative">
                    <div className='flex flex-row group'>
                      <textarea
                        onChange={(e) => setItem(i, e.target.value)}
                        type="text"
                        value={item}
                        rows={1}
                        className="align-top w-full max-h-32 min-h-[3rem] bg-slate-100 rounded p-2"
                      />
                      <span onClick={(e) => deleteStep(i) } className="p-2 ml-2 w-12 h-12 cursor-pointer relative rounded bg-gray-100 hover:!opacity-80 group-hover:opacity-50 opacity-0 float-right flex justify-around">
                        <TrashIcon size={24} className="self-center" />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <span
                onClick={addItem}
                className={
                  'block mt-2 py-3 text-lg whitespace-nowrap cursor-pointer select-none font-bold text-gray-700 hover:text-gray-900'
                }>
                {props.addText}
              </span>
            </div>
          ) : (
            <textarea
              onChange={(e) => setFreeText(e.target.value)}
              value={freeText}
              rows={4}
              className="align-top max-w-xl w-full text-lg min-h-[3rem] bg-slate-100 rounded p-2"
            />
          )
        ) : (
          <ol className="list-disc ml-5 leading-relaxed text-xl">
            {props.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
