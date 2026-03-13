import clsx from "clsx";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  ghost?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "text-[14px] leading-[0.85]",
  md: "text-3xl md:text-4xl leading-[0.85]",
  lg: "text-5xl md:text-7xl leading-[0.85]",
  xl: "text-[10vw] md:text-[8vw] leading-[0.85]",
};

export default function Logo({ size = "md", ghost = false, className }: LogoProps) {
  return (
    <div
      className={clsx(
        "font-bebas uppercase tracking-tight select-none",
        sizeMap[size],
        ghost && "text-white/[0.04]",
        className
      )}
    >
      <span className="block">PURE</span>
      <span className="block">
        AURA<span style={{ color: ghost ? undefined : "var(--accent)" }}>.</span>
      </span>
    </div>
  );
}
