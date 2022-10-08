export default function Header(props) {
  return (
    <h3 className={`text-5xl mb-8 mt-4 subpixel-antialiased ${props.className}`}>
      {props.children}
    </h3>
  );
}
