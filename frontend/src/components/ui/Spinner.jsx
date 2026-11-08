export default function Spinner({ label }) {
  return (
    <div className="page-state">
      <div className="spinner" />
      {label ? <p>{label}</p> : null}
    </div>
  );
}
