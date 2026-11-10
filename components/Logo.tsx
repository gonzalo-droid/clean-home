import Link from "next/link";
import { DropIcon } from "./icons";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Clean Home, ir al inicio">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-agua">
        <DropIcon className="h-5 w-5 text-white" />
      </span>
      <span className={`font-display text-xl font-extrabold ${light ? "text-white" : "text-marino"}`}>
        Clean Home
      </span>
    </Link>
  );
}
