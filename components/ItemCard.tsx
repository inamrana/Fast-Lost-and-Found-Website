import Link from "next/link";
import { CalendarDays, MapPin, Tag } from "lucide-react";
import type { Item } from "@/lib/types";

export function ItemCard({ item, score }: { item: Item; score?: number }) {
  return (
    <article className="item-card">
      <img src={item.imageUrl} alt={item.title} />
      <div className="item-card-body">
        <div className="row-between">
          <span className={`status-badge ${item.status}`}>{item.status}</span>
          {typeof score === "number" && <span className="match-score">{score}% match</span>}
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="meta-line">
          <Tag size={15} />
          {item.category} / {item.color}
        </div>
        <div className="meta-line">
          <MapPin size={15} />
          {item.location}
        </div>
        <div className="meta-line">
          <CalendarDays size={15} />
          {item.eventDate}
        </div>
        <Link className="text-link" href={`/items/${item.id}`}>View details</Link>
      </div>
    </article>
  );
}
