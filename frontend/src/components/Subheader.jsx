export default function Subheader(props) {
    return (
        <h3 className={`text-2xl mb-8 mt-2 subpixel-antialiased`}>
            {props.children}
        </h3>
    );
}