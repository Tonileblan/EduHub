
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
  "Marketing & SEO": {
    name: "Marketing & SEO",
    icon: "🚀",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)",
    accentColor: "#f43f5e",
    glowColor: "rgba(244, 63, 94, 0.4)",
    badgeBg: "rgba(244, 63, 94, 0.15)",
    tagBg: "rgba(244, 63, 94, 0.12)",
    description: "Tráfico, SEO, Copywriting, Ads & Growth Hacking"
  },
  "Desarrollo & Programación": {
    name: "Desarrollo & Programación",
    icon: "💻",
    gradient: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
    accentColor: "#6366f1",
    glowColor: "rgba(99, 102, 241, 0.4)",
    badgeBg: "rgba(99, 102, 241, 0.15)",
    tagBg: "rgba(99, 102, 241, 0.12)",
    description: "Web, Fullstack, Python, React, Cloud & DevOps"
  },
  "Inteligencia Artificial": {
    name: "Inteligencia Artificial",
    icon: "🤖",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
    accentColor: "#8b5cf6",
    glowColor: "rgba(139, 92, 246, 0.4)",
    badgeBg: "rgba(139, 92, 246, 0.15)",
    tagBg: "rgba(139, 92, 246, 0.12)",
    description: "LLMs, Prompt Engineering, Agentes & Automatizaciones"
  },
  "Trading & Inversión": {
    name: "Trading & Inversión",
    icon: "📈",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)",
    accentColor: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    tagBg: "rgba(16, 185, 129, 0.12)",
    description: "Cripto, Forex, Bolsa, Análisis Técnico & Finanzas"
  },
  "Ecommerce & Negocios": {
    name: "Ecommerce & Negocios",
    icon: "🛒",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)",
    accentColor: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.4)",
    badgeBg: "rgba(59, 130, 246, 0.15)",
    tagBg: "rgba(59, 130, 246, 0.12)",
    description: "Amazon FBA, Shopify, Dropshipping & Startups"
  },
  "Diseño & 3D": {
    name: "Diseño & 3D",
    icon: "🎨",
    gradient: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)",
    accentColor: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.4)",
    badgeBg: "rgba(236, 72, 153, 0.15)",
    tagBg: "rgba(236, 72, 153, 0.12)",
    description: "UI/UX, Figma, Blender 3D, Ilustración & Animación"
  },
  "Mentalidad & Productividad": {
    name: "Mentalidad & Productividad",
    icon: "🧠",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)",
    accentColor: "#14b8a6",
    glowColor: "rgba(20, 184, 166, 0.4)",
    badgeBg: "rgba(20, 184, 166, 0.15)",
    tagBg: "rgba(20, 184, 166, 0.12)",
    description: "Hábitos, Liderazgo, Ventas & Alto Rendimiento"
  },
  "Fotografía & Vídeo": {
    name: "Fotografía & Vídeo",
    icon: "🎬",
    gradient: "linear-gradient(135deg, #ea580c 0%, #e11d48 100%)",
    accentColor: "#ea580c",
    glowColor: "rgba(234, 88, 12, 0.4)",
    badgeBg: "rgba(234, 88, 12, 0.15)",
    tagBg: "rgba(234, 88, 12, 0.12)",
    description: "Edición Premiere, DaVinci, Iluminación & Cine"
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
