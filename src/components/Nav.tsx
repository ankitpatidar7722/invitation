import { useLang } from "@/i18n/LangProvider";
import LangToggle from "./LangToggle";

const LINKS = ["couple", "countdown", "events", "venue", "gallery", "contact", "share"] as const;

export default function Nav({ visible }: { visible: boolean }) {
  const { dict } = useLang();
  return (
    <nav
      aria-label={dict.nav.label}
      className={`fixed inset-x-0 top-0 z-40 transition duration-700 ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      <div className="mx-auto mt-2 flex w-[calc(100%-1.5rem)] max-w-3xl items-center rounded-full border border-gold-300/60 bg-ivory/80 shadow-soft backdrop-blur-md">
        <ul className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-2 py-1.5 [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
          {LINKS.map((id) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                className="block rounded-full px-3.5 py-2 font-sans text-[0.78rem] tracking-wide text-ink-soft transition hover:bg-blush-100 hover:text-rose-600"
              >
                {dict.nav[id]}
              </a>
            </li>
          ))}
        </ul>
        <div className="shrink-0 py-1 pr-1.5">
          <LangToggle compact />
        </div>
      </div>
    </nav>
  );
}
