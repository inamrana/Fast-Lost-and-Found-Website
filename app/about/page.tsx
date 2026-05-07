export default function AboutPage() {
  return (
    <div className="page-shell">
      <section className="page-heading">
        <h1>About</h1>
        <p>
          Fast Lost & Found is a web-based recovery board designed for quick reporting, smart tag matching, and admin-verified claims.
        </p>
      </section>
      <div className="grid">
        <article className="panel">
          <h2>Smart matching</h2>
          <p>Each report is tagged from its category, color, location, and description. Opposite lost/found posts are scored and shown as possible matches.</p>
        </article>
        <article className="panel">
          <h2>Secure access</h2>
          <p>Users get hashed passwords, signed session cookies, role-based navigation, and protected admin actions.</p>
        </article>
        <article className="panel">
          <h2>Verified claims</h2>
          <p>Claims stay pending until an admin reviews ownership proof and approves or rejects the request.</p>
        </article>
      </div>
    </div>
  );
}
