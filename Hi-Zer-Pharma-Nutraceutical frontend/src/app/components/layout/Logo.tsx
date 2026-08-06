import { fs, ff } from "../../lib/constants";

export function Logo({ variant = "teal" }: { variant?: "teal" | "white" }) {
  const main = variant === "white" ? "text-white" : "text-[#0c3f35]";
  const sub = variant === "white" ? "text-[#7dd3bd]" : "text-[#28a869]";
  return (
    <div className="flex flex-col items-center leading-none select-none">
      <span className={`text-[22px] font-bold tracking-tight ${main}`} style={fs}>
        Hi-Zer
      </span>
      <span className={`text-[9px] font-semibold tracking-[0.18em] uppercase ${sub}`} style={ff}>
        Pharma & Nutraceutical
      </span>
    </div>
  );
}
