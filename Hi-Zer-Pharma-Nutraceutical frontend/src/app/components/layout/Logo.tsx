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
    </div>
  );
}
