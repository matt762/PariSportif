import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  accent?: string;
  onClick?: () => void;
  as?: "div" | "button" | "a";
}

export function GlassCard({ children, className = "", style = {}, accent, onClick, as: Tag = "div" }: GlassCardProps) {
  const base: CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${accent ? `${accent}25` : "rgba(168,85,247,0.12)"}`,
    borderRadius: 20,
    backdropFilter: "blur(16px)",
    ...style,
  };

  return (
    <Tag
      className={className}
      style={base}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
