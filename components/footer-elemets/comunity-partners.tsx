import Image from "next/image";
import Link from "next/link";
import { partners } from "./utils/pathners";

export default function ComunityPathners() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Community Partners</h3>
      <div className="flex flex-wrap gap-4">
        {partners.map((partner, i) => (
          <Link
            key={i}
            href={partner.link}
            target="_blank"
            className="grayscale hover:grayscale-0 transition-all duration-300"
            title={partner.name}
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              width={55}
              height={55}
              className="object-contain rounded-lg shadow-md"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
