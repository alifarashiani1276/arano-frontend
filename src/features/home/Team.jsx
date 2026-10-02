import { useRef } from "react";
import { site } from "../../config/site";
import { TEAM } from "../../data/team";
import useSpotlight from "../../hooks/useSpotlight";
import Icon from "../../ui/Icon";
import Motion from "../../ui/Motion";
import SectionHeading from "../../ui/SectionHeading";
import SplitWords from "../../ui/SplitWords";

// کارت اول از راست، سومی از چپ، وسطی از پایین وارد می‌شود.
const ENTRY = [
  { "--x": "70px", "--y": "20px", "--r": "2deg" },
  { "--x": "0px", "--y": "70px", "--r": "0deg" },
  { "--x": "-70px", "--y": "20px", "--r": "-2deg" },
];

export default function Team() {
  const listRef = useRef(null);
  useSpotlight(listRef, ".spot");

  return (
    <section
      id="team"
      aria-labelledby="team-title"
      className="scroll-mt-24 border-t border-border bg-surface-2/50 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading id="team-title" {...site.sections.team} />

        <ul ref={listRef} className="mt-14 grid gap-6 md:grid-cols-3">
          {TEAM.map((member, i) => {
            const [first, ...rest] = member.name.trim().split(" ");
            return (
              <Motion
                as="li"
                key={member.id}
                fx="side"
                delay={i * 160}
                style={ENTRY[i % ENTRY.length]}
                className="h-full"
              >
                <article className="spot group relative h-full overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1.5 hover:border-primary/50">
                  <span
                    aria-hidden="true"
                    className="ghost-letter pointer-events-none absolute -left-3 -top-8 select-none text-[9rem] font-black leading-none text-foreground/[0.04]"
                  >
                    {member.name.trim().charAt(0)}
                  </span>

                  <div className="relative flex items-center gap-4">
                    <span className="orbit">
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
                    </span>

                    <div className="min-w-0">
                      <h3 className="flex flex-col font-black leading-[1.5]">
                        <span className="text-base text-foreground/80">
                          <SplitWords text={first} start={0} />
                        </span>
                        <span className="hl w-fit text-xl text-primary">
                          <SplitWords text={rest.join(" ")} start={1} />
                        </span>
                      </h3>
                      <p
                        style={{ "--cd": "700ms" }}
                        className="fx-child fx-up mt-1 text-sm font-bold text-muted"
                      >
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <p
                    style={{ "--cd": "800ms" }}
                    className="fx-child fx-up relative mt-5 text-sm leading-7 text-muted"
                  >
                    {member.bio}
                  </p>

                  <ul dir="ltr" className="relative mt-5 flex flex-wrap gap-2">
                    {member.skills.map((skill, s) => (
                      <li
                        key={skill}
                        style={{ "--cd": "900ms", "--i": s }}
                        className="fx-child fx-pop rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>

                  <ul className="relative mt-6 flex items-center gap-2 border-t border-border pt-5">
                    {member.links.map((link, l) => (
                      <li
                        key={link.label}
                        style={{ "--cd": "1100ms", "--i": l }}
                        className="fx-child fx-pop"
                      >
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
              </Motion>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
