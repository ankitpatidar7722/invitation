import { MessageCircle, Phone } from "lucide-react";
import { wedding } from "@/data/wedding";
import { useLang } from "@/i18n/LangProvider";
import { prettyPhone, telHref, whatsappHref } from "@/lib/format";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

export default function Contact() {
  const { lang, dict, tx } = useLang();
  const c = dict.contact;
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <SectionHeading
        id="contact-title"
        eyebrow={c.eyebrow}
        title={c.title}
        subtitle={c.subtitle}
      />

      <ul className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
        {wedding.contacts.map(({ phone: n, name }, i) => (
          <Reveal as="li" key={n} delay={i * 100} className="card card-frame px-6 py-8 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blush-100 text-rose-500">
              <Phone className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-4 font-script text-4xl leading-tight text-rose-600">{tx(name)}</p>
            <a
              href={telHref(n)}
              className="mt-1 block font-serif text-2xl tabular-nums text-ink underline-offset-4 hover:text-rose-600 hover:underline"
            >
              {prettyPhone(n)}
            </a>
            <div className="mt-5 flex flex-col gap-2">
              <a href={telHref(n)} className="btn-gold">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {c.call}
                <span className="sr-only"> {tx(name)}, {prettyPhone(n)}</span>
              </a>
              <a
                href={whatsappHref(n, lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {c.whatsapp}
                <span className="sr-only"> {tx(name)}, {prettyPhone(n)} {c.newTab}</span>
              </a>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
