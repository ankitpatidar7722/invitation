import { wedding, type Person } from "@/data/wedding";
import { useLang } from "@/i18n/LangProvider";
import { RoseIcon } from "./ornaments/Floral";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function PersonCard({
  role,
  person,
  relation,
  delay,
}: {
  role: string;
  person: Person;
  relation: { grand: string; child: string };
  delay: number;
}) {
  const { tx } = useLang();
  return (
    <Reveal delay={delay} className="card card-frame px-7 py-10 text-center sm:px-10">
      <RoseIcon className="mx-auto h-10 w-10" />
      <p className="eyebrow mt-4">{role}</p>
      <h3 className="mt-2 font-script text-5xl text-rose-600 sm:text-6xl">{tx(person.name)}</h3>
      <dl className="mt-6 space-y-4 font-serif text-lg leading-snug text-ink">
        <div>
          <dt className="font-sans text-xs uppercase tracking-[0.22em] text-gold-600">{relation.grand}</dt>
          <dd className="mt-1">{tx(person.grandfather)}</dd>
        </div>
        <div>
          <dt className="font-sans text-xs uppercase tracking-[0.22em] text-gold-600">{relation.child}</dt>
          <dd className="mt-1">{tx(person.father)}</dd>
        </div>
      </dl>
    </Reveal>
  );
}

export default function Families() {
  const { dict, tx } = useLang();
  const f = dict.families;
  return (
    <section id="couple" className="section" aria-labelledby="couple-title">
      <SectionHeading
        id="couple-title"
        eyebrow={f.eyebrow}
        title={f.title}
        subtitle={tx(wedding.invitationLine)}
      />
      <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <PersonCard
          role={f.groom}
          person={wedding.groom}
          relation={{ grand: f.grandson, child: f.son }}
          delay={0}
        />
        <Reveal delay={150} className="text-center font-script text-6xl text-gold-500">
          <span aria-hidden="true">&amp;</span>
        </Reveal>
        <PersonCard
          role={f.bride}
          person={wedding.bride}
          relation={{ grand: f.granddaughter, child: f.daughter }}
          delay={250}
        />
      </div>
    </section>
  );
}
