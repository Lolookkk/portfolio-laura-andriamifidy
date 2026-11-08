export default function TechBadges({ tech }) {
  if (!tech || tech.length === 0) return null;
  return (
    <ul className="tech-list">
      {tech.map((label, index) => (
        <li key={`${label}-${index}`}>
          <span className="tech-badge">{label}</span>
        </li>
      ))}
    </ul>
  );
}
