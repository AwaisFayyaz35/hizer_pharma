<<<<<<< HEAD
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
=======
export function Logo({ variant = "teal" }: { variant?: "teal" | "white" }) {
  if (variant === "white") {
    return (
      <div className="inline-flex items-center bg-white rounded-lg px-2.5 py-1.5 leading-none select-none">
        <img src="/logo.jpeg" alt="Hi-Zer Pharma" className="h-9 w-auto" />
      </div>
    );
  }

  return (
    <div className="inline-flex items-center leading-none select-none">
      <img src="/logo.jpeg" alt="Hi-Zer Pharma" className="h-18 w-20 mix-blend-multiply" />
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
    </div>
  );
}
