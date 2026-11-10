import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export const DropIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z" /></svg>
);
export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const CartIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 4h2l2.4 11h10.2L20 8H6.2" /><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /></svg>
);
export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 12h14" /></svg>
);
export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M20 6 9 17l-5-5" /></svg>
);
export const ChatIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" /></svg>
);
export const TruckIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></svg>
);
export const BoxIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 8l9-5 9 5v8l-9 5-9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></svg>
);
export const SmileIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01" /></svg>
);
export const HomeIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z" /></svg>
);
export const GridIcon = (p: IconProps) => (
  <svg {...base(p)}><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></svg>
);
export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M15 5l-7 7 7 7" /></svg>
);
export const ArrowRightIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const HeartIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
);
export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const TagIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.2" /></svg>
);
export const BottleIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M10 3h4v3l2 3v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-3z" /></svg>
);

export function WhatsAppGlyph(p: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" {...p}>
      <path d="M16.001 2.667c-7.364 0-13.334 5.97-13.334 13.334 0 2.353.617 4.647 1.789 6.667L2.667 29.333l6.83-1.79a13.27 13.27 0 006.504 1.657h.006c7.364 0 13.334-5.97 13.334-13.333S23.365 2.667 16.001 2.667zm0 24.4a11.03 11.03 0 01-5.62-1.54l-.403-.24-4.053 1.062 1.082-3.951-.263-.406a11.05 11.05 0 01-1.7-5.897c0-6.108 4.97-11.078 11.079-11.078 2.96 0 5.742 1.153 7.834 3.246a11 11 0 013.244 7.834c0 6.108-4.97 11.078-11.1 11.078v-.108z" />
      <path d="M22.324 18.61c-.339-.17-2.006-.99-2.317-1.104-.311-.113-.538-.17-.764.17-.226.34-.876 1.104-1.074 1.33-.198.226-.396.255-.735.085-.339-.17-1.432-.528-2.727-1.68-1.008-.9-1.689-2.011-1.887-2.35-.198-.34-.021-.523.149-.692.153-.153.34-.396.51-.594.17-.198.226-.34.34-.566.113-.226.056-.424-.028-.594-.085-.17-.764-1.842-1.047-2.523-.276-.663-.556-.573-.764-.583l-.652-.011a1.25 1.25 0 00-.905.424c-.311.34-1.187 1.161-1.187 2.833s1.215 3.286 1.384 3.512c.17.226 2.392 3.652 5.797 5.121.81.35 1.442.559 1.935.716.813.259 1.553.222 2.138.135.652-.097 2.006-.82 2.289-1.612.283-.792.283-1.472.198-1.612-.085-.14-.311-.226-.65-.396z" />
    </svg>
  );
}
