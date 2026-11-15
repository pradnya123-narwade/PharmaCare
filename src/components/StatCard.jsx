export default function StatCard({ label, value, note, number, tone = "blue", icon }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className={`stat-number tone-${tone}`}>
          {icon ? <span className="stat-icon">{icon}</span> : number}
        </span>
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-note">{note}</span>
    </article>
  );
}
