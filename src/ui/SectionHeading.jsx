import Reveal from "./Reveal";

export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  className = "",
}) {
  return (
    <Reveal className={`max-w-2xl ${className}`}>
      <p className="mb-4 flex items-center gap-3 text-sm font-bold text-primary">
        <span aria-hidden="true" className="h-px w-8 bg-primary" />
        {eyebrow}
      </p>
      <h2 id={id} className="text-3xl font-black leading-[1.4] md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-8 text-muted md:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
