export default function ContactPage() {
  return (
    <div className="page-shell">
      <section className="page-heading">
        <h1>Contact</h1>
        <p>Use this page as the official support contact for the project demo and presentation.</p>
      </section>
      <div className="report-layout">
        <section className="panel form-stack">
          <h2 className="section-title">Project desk</h2>
          <p><strong>Email:</strong> fastfound@example.com</p>
          <p><strong>Phone:</strong> +92 300 0000000</p>
          <p><strong>Address:</strong> Campus Help Desk, Main Block</p>
        </section>
        <section className="panel">
          <h2 className="section-title">Presentation note</h2>
          <p className="empty-state">During demo, login as admin with the seeded account, submit a claim as a user, then approve or reject it from the dashboard.</p>
        </section>
      </div>
    </div>
  );
}
