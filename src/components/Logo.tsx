interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden aura-ring ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/aura-logo.png"
        alt="Aura News logo"
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
