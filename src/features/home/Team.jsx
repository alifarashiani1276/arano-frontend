import { site } from "../../config/site";
import { TEAM } from "../../data/team";
import Icon from "../../ui/Icon";
import Reveal from "../../ui/Reveal";
import SectionHeading from "../../ui/SectionHeading";

export default function Team() {
  return (
    <section
      id="team"
      aria-labelledby="team-title"
      className="scroll-mt-24 border-t border-border bg-surface-2/50 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading id="team-title" {...site.sections.team} />

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {TEAM.map((member, i) => (
            <Reveal
              as="li"
              key={member.id}
              delay={Math.min(i, 3)}
              className="h-full"
            >
              <article className="group h-full rounded-3xl border border-border bg-surface p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-primary/50">
                <div className="flex items-center gap-4">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-border transition-shadow duration-300 group-hover:ring-primary"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid h-16 w-16 place-items-center rounded-full bg-secondary text-2xl font-black text-primary ring-2 ring-border transition-shadow duration-300 group-hover:ring-primary"
                    >
                      {member.name.trim().charAt(0)}
                    </span>
                  )}
                  <div>
                    <h3 className="text-lg font-black">{member.name}</h3>
                    <p className="text-sm font-bold text-primary">
                      {member.role}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-muted">
                  {member.bio}
                </p>

                <ul dir="ltr" className="mt-5 flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex items-center gap-2 border-t border-border pt-5">
                  {member.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        aria-label={`${link.label} ${member.name}`}
                        className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted transition-[color,border-color] duration-200 hover:border-primary hover:text-primary"
                      >
                        <Icon name={link.icon} size={16} />
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
