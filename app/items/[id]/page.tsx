import { notFound } from "next/navigation";
import { ClaimForm } from "@/components/ClaimForm";
import { ItemCard } from "@/components/ItemCard";
import { findMatches } from "@/lib/matching";
import { readCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/store";

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const item = db.items.find((candidate) => candidate.id === id);
  if (!item) notFound();
  const user = await readCurrentUser();
  const matches = findMatches(item, db.items);

  return (
    <div className="page-shell details-layout">
      <section className="panel form-stack">
        <img className="detail-image" src={item.imageUrl} alt={item.title} />
        <div className="row-between">
          <span className={`status-badge ${item.status}`}>{item.status}</span>
          <span className="tag-chip">{item.category}</span>
        </div>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
        <p><strong>Color:</strong> {item.color}</p>
        <p><strong>Location:</strong> {item.location}</p>
        <p><strong>Date:</strong> {item.eventDate}</p>
        <p><strong>Contact:</strong> {item.contactEmail}</p>
        <div className="tag-list">
          {item.tags.map((tag) => <span className="tag-chip" key={tag}>{tag}</span>)}
        </div>
      </section>

      <aside className="form-stack">
        <section className="panel">
          <h2 className="section-title">Claim this item</h2>
          {user ? <ClaimForm itemId={item.id} /> : <p className="empty-state">Login to submit an ownership claim for admin review.</p>}
        </section>
        <section className="panel form-stack">
          <h2 className="section-title">Possible matches</h2>
          {matches.length ? matches.map((match) => <ItemCard key={match.item.id} item={match.item} score={match.score} />) : <p className="empty-state">No strong matches yet.</p>}
        </section>
      </aside>
    </div>
  );
}
