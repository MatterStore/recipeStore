
export default function Ellipsis(props) {
  return (
    <span
      className={`rounded-full select-none hover:gray-900 ${props.className}`}
    >
        <span
        className={`relative text-3xl top-[-0.5ex] px-2 text-gray-700 rounded-md whitespace-nowrap select-none hover:gray-900 ${props.className}`}
        >
        ...
        </span>
    </span>
    
  );
}
