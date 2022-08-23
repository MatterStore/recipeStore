export default function Header(props) {
    return (
        <h3 className={`text-5xl mb-5 mt-8 md:mt-0 subpixel-antialiased`}>
            {props.children}
        </h3>
    );
}