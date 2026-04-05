export default function Header({ business_name }) {
  return (
    <header>
      <div className="container">
        <h1>{business_name}</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
