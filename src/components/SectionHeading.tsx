import { Divider } from "./ornaments/Floral";
import Reveal from "./Reveal";

export default function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="heading mt-3">
        {title}
      </h2>
      <Divider className="mx-auto mt-5 h-6 w-56" />
      {subtitle && <p className="mt-5 text-base leading-relaxed text-ink-soft">{subtitle}</p>}
    </Reveal>
  );
}
