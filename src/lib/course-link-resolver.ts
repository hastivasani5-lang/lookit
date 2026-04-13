type ResolveCourseTargetInput = {
  title?: string;
  category?: string;
};

const W3S_BASE = "https://www.w3schools.com";

const TITLE_RULES: Array<{ pattern: RegExp; url: string }> = [
  { pattern: /(html|css|web\s*design|design\s*systems|ux|ui)/i, url: `${W3S_BASE}/html/default.asp` },
  { pattern: /(frontend|javascript|app\s*development|full\s*stack|no-?code|api)/i, url: `${W3S_BASE}/js/default.asp` },
  { pattern: /(react)/i, url: `${W3S_BASE}/react/default.asp` },
  { pattern: /(data|analytics|ai|machine\s*learning)/i, url: `${W3S_BASE}/python/default.asp` },
  { pattern: /(security|cyber)/i, url: `${W3S_BASE}/cybersecurity/index.php` },
  { pattern: /(sql|database)/i, url: `${W3S_BASE}/sql/default.asp` },
];

const CATEGORY_RULES: Array<{ pattern: RegExp; url: string }> = [
  { pattern: /(web\s*development|development|programming)/i, url: `${W3S_BASE}/whatis/default.asp` },
  { pattern: /(ui\/ux|graphic\s*design|design)/i, url: `${W3S_BASE}/css/default.asp` },
  { pattern: /(data\s*science|ai)/i, url: `${W3S_BASE}/python/python_ml_getting_started.asp` },
  { pattern: /(cyber\s*security)/i, url: `${W3S_BASE}/cybersecurity/index.php` },
  { pattern: /(content|marketing|business|leadership|communication|career)/i, url: `${W3S_BASE}/howto/default.asp` },
];

export function resolveCourseTargetUrl({ title = "", category = "" }: ResolveCourseTargetInput): string {
  const safeTitle = title.trim();
  const safeCategory = category.trim();
  const titleAndCategory = `${safeTitle} ${safeCategory}`.trim();

  for (const rule of TITLE_RULES) {
    if (rule.pattern.test(titleAndCategory)) {
      return rule.url;
    }
  }

  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(safeCategory)) {
      return rule.url;
    }
  }

  const query = encodeURIComponent(titleAndCategory || "web development");
  return `${W3S_BASE}/search/search.php?q=${query}`;
}
