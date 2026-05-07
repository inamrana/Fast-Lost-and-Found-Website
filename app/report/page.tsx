import { ReportForm } from "@/components/ReportForm";
import { requireUser } from "@/lib/auth";

export default async function ReportPage() {
  await requireUser();
  return (
    <div className="page-shell">
      <section className="page-heading">
        <h1>Report an item</h1>
        <p>Submit the basic details from your proposal: item type, color, location, photo, and description. The system checks possible matches immediately.</p>
      </section>
      <ReportForm />
    </div>
  );
}
