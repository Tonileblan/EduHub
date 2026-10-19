
export interface CategoryTheme {
  name: string;
  icon: string;
  gradient: string;
  accentColor: string;
  glowColor: string;
  badgeBg: string;
  tagBg: string;
  description: string;
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  "IA & Agentes Autónomos": {
    name: "IA & Agentes Autónomos",
    icon: "🤖",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
    accentColor: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.4)",
    badgeBg: "rgba(168, 85, 247, 0.15)",
    tagBg: "rgba(168, 85, 247, 0.12)",
    description: "LLMs, Prompt Engineering, Claude, Agentes & Vibe Coding"
  },
  "Desarrollo Web & Software": {
    name: "Desarrollo Web & Software",
    icon: "💻",
    gradient: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
    accentColor: "#6366f1",
    glowColor: "rgba(99, 102, 241, 0.4)",
    badgeBg: "rgba(99, 102, 241, 0.15)",
    tagBg: "rgba(99, 102, 241, 0.12)",
    description: "React, TypeScript, Python, Fullstack, Cloud & DevOps"
  },
  "Trading, Inversión & Finanzas": {
    name: "Trading, Inversión & Finanzas",
    icon: "📈",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    tagBg: "rgba(16, 185, 129, 0.12)",
    description: "Scalping, Wyckoff, Cripto, Forex, Bolsa & Finanzas"
  },
  "Marketing, Tráfico & SEO": {
    name: "Marketing, Tráfico & SEO",
    icon: "🚀",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)",
    accentColor: "#f43f5e",
    glowColor: "rgba(244, 63, 94, 0.4)",
    badgeBg: "rgba(244, 63, 94, 0.15)",
    tagBg: "rgba(244, 63, 94, 0.12)",
    description: "Tráfico, Funnels, SEO, Copywriting, Ads & Redes Sociales"
  },
  "Negocios, Estrategia & Emprendimiento": {
    name: "Negocios, Estrategia & Emprendimiento",
    icon: "🏢",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    accentColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    badgeBg: "rgba(59, 130, 246, 0.15)",
    tagBg: "rgba(59, 130, 246, 0.12)",
    description: "Startups, Liderazgo, Escala, Modelos de Negocio & Ventas"
  },
  "E-Commerce & Amazon FBA": {
    name: "E-Commerce & Amazon FBA",
    icon: "🛒",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    accentColor: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.4)",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    tagBg: "rgba(245, 158, 11, 0.12)",
    description: "Amazon FBA, Shopify, Dropshipping & Comercio Electrónico"
  },
  "Diseño, Audiovisual & 3D": {
    name: "Diseño, Audiovisual & 3D",
    icon: "🎨",
    gradient: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
    accentColor: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.4)",
    badgeBg: "rgba(236, 72, 153, 0.15)",
    tagBg: "rgba(236, 72, 153, 0.12)",
    description: "UI/UX, Figma, Blender 3D, Fotografía, Edición & Vídeo"
  },
  "Ciberseguridad & Hacking Ético": {
    name: "Ciberseguridad & Hacking Ético",
    icon: "👾",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    accentColor: "#0ea5e9",
    glowColor: "rgba(14, 165, 233, 0.4)",
    badgeBg: "rgba(14, 165, 233, 0.15)",
    tagBg: "rgba(14, 165, 233, 0.12)",
    description: "Pentesting, Red Teaming, Seguridad Ofensiva & Redes"
  },
  "Desarrollo Personal, Mente & Productividad": {
    name: "Desarrollo Personal, Mente & Productividad",
    icon: "🧠",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    accentColor: "#14b8a6",
    glowColor: "rgba(20, 184, 166, 0.4)",
    badgeBg: "rgba(20, 184, 166, 0.15)",
    tagBg: "rgba(20, 184, 166, 0.12)",
    description: "Mindset, Biohacking, Oratoria, Hábitos & Alto Rendimiento"
  },
  "Música & Producción Sonora": {
    name: "Música & Producción Sonora",
    icon: "🎵",
    gradient: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
    accentColor: "#ea580c",
    glowColor: "rgba(234, 88, 12, 0.4)",
    badgeBg: "rgba(234, 88, 12, 0.15)",
    tagBg: "rgba(234, 88, 12, 0.12)",
    description: "Producción Musical, Ableton, Mezcla, Mastering & Audio"
  }
};

const DEFAULT_THEME: CategoryTheme = {
  name: "Masterclass General",
  icon: "🎓",
  gradient: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
  accentColor: "#4f46e5",
  glowColor: "rgba(79, 70, 229, 0.4)",
  badgeBg: "rgba(79, 70, 229, 0.15)",
  tagBg: "rgba(79, 70, 229, 0.12)",
  description: "Formación especializada y habilidades clave"
};

export const getCategoryTheme = (category?: string): CategoryTheme => {
  if (!category) return DEFAULT_THEME;
  return CATEGORY_THEMES[category] || DEFAULT_THEME;
};

export const getAuthorInitials = (author?: string): string => {
  if (!author || author === "Desconocido") return "🎓";
  const words = author.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};
