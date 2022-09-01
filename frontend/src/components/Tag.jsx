export default function Tag(props) {
    return (
        <span 
            className={`align-baseline py-1 px-3 m-8 ml-0 text-md text-slate-900 text-center rounded-full whitespace-nowrap max-w-fit $text-white bg-amber-400`}
        >
            {props.children}
        </span>
    );
}