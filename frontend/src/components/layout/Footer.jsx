export default function Footer({ settings }) {
  const text = (settings.footer_text || '© {year} Laura Andriamifidy').replace(
    '{year}',
    new Date().getFullYear()
  );
  return (
    <footer>
      <p>{text}</p>
    </footer>
  );
}
