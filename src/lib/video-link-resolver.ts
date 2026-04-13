type ResolveVideoTargetInput = {
  title?: string;
};

const VIDEO_TITLE_TO_URL: Record<string, string> = {
  "figma to prototype bootcamp": "https://www.youtube.com/results?search_query=figma+full+course",
  "full stack crash course": "https://www.youtube.com/results?search_query=full+stack+development+full+course",
  "ads funnel deep dive": "https://www.youtube.com/results?search_query=digital+marketing+full+course",
  "user research masterclass": "https://www.youtube.com/results?search_query=ux+research+full+course",
  "api security in practice": "https://www.youtube.com/results?search_query=api+security+full+course",
  "sales storytelling workshop": "https://www.youtube.com/results?search_query=sales+storytelling+full+course",
};

export function resolveVideoTargetUrl({ title = "" }: ResolveVideoTargetInput): string {
  const key = title.trim().toLowerCase();
  const direct = VIDEO_TITLE_TO_URL[key];

  if (direct) {
    return direct;
  }

  const query = encodeURIComponent(`${title.trim() || "video"} full course`);
  return `https://www.youtube.com/results?search_query=${query}`;
}
