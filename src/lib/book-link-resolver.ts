type ResolveBookTargetInput = {
  title?: string;
};

const SCRIBD_TITLE_TO_URL: Record<string, string> = {
  "ui patterns handbook": "https://www.scribd.com/document/700319986/UI-Patterns-Handbook",
  "modern react architecture": "https://www.scribd.com/document/708230882/Modern-React-Architecture",
  "growth marketing playbook": "https://www.scribd.com/document/707362782/Growth-Marketing-Playbook",
  "design systems in action": "https://www.scribd.com/document/706326730/Design-Systems-in-Action",
  "backend performance guide": "https://www.scribd.com/document/704598474/Backend-Performance-Guide",
  "brand positioning essentials": "https://www.scribd.com/document/701494750/Brand-Positioning-Essentials",
};

export function resolveBookTargetUrl({ title = "" }: ResolveBookTargetInput): string {
  const key = title.trim().toLowerCase();
  const direct = SCRIBD_TITLE_TO_URL[key];

  if (direct) {
    return direct;
  }

  const query = encodeURIComponent(title.trim() || "book pdf");
  return `https://www.scribd.com/search?query=${query}`;
}
