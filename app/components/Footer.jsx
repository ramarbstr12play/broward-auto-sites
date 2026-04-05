export default function Footer({ business_name, year }) {
  return (
    <footer>
      <div className="container">
        <p>© {year} {business_name} — Serving Broward County</p>
      </div>
    </footer>
  );
}
