import Link from "next/link";
import { partners } from "./utils/pathners";

export default function ComunityPathners() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Community Partners</h3>
      <ul className="space-y-2">
        {partners.map((partner, i) => (
          <li key={i}>
            <Link
              href={partner.link}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {partner.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
