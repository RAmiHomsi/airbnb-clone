export default function Image({ src, ...rest }) {
  src =
    src && src.includes("https://")
      ? src
      : "https://airbnb-clone-tawny-chi.vercel.app/uploads/" + src;
  return <img {...rest} src={src} alt={""} />;
}
