import React from "react";

interface FeaturedContentListProps {
  todaysVideos: any[];
  todaysBooks: any[];
  featuredPage: number;
}

const FeaturedContentList: React.FC<FeaturedContentListProps> = ({ todaysVideos, todaysBooks, featuredPage }) => {
  const getListItem = (item: any, index: number, isVideo: boolean) => {
    let openUrl = "";
    let imageSrc = item.imageUrl || "/books.png";
    let imageAlt = item.title || item.name || "";
    if (isVideo) {
      openUrl = item.url;
    } else {
      if (item.source === "file" && item.url) {
        openUrl = item.url;
      } else if (item.source === "amazon" && item.url) {
        openUrl = item.url;
      } else if (item.url) {
        openUrl = item.url;
      } else if (item.imageUrl && (item.imageUrl.endsWith(".pdf") || item.imageUrl.startsWith("/uploads/"))) {
        openUrl = item.imageUrl;
      } else {
        openUrl = "";
      }
    }
    const handleClick = (e: React.MouseEvent) => {
      if (openUrl) {
        window.open(openUrl, "_blank", "noopener,noreferrer");
      }
    };
    return (
      <li
        key={`${item.title || item.name}-${index}`}
        className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-slate-50 transition"
        onClick={handleClick}
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleClick(e as any); }}
        role="button"
        aria-label={`Open ${isVideo ? 'video' : 'book'}: ${item.title || item.name}`}
      >
        <div className={`relative ${isVideo ? "h-14 w-24" : "h-14 w-20"} flex-shrink-0 overflow-hidden rounded-xl bg-slate-100`}>
          {isVideo ? (
            <iframe
              className="h-full w-full rounded-xl"
              src={`https://www.youtube.com/embed/${item.youtubeId}`}
              title={item.title || item.name || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img src={imageSrc} alt={imageAlt} className="object-cover w-full h-full rounded-xl" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Add additional info here if needed */}
          </div>
          <h4 className="mt-1 text-sm font-semibold leading-5 text-slate-900 truncate">{item.title || item.name}</h4>
          {!isVideo && (
            // Add book-specific info here if needed
            null
          )}
        </div>
      </li>
    );
  };

  return (
    <ul className="divide-y divide-slate-100 bg-white rounded-[22px] shadow-sm">
      {todaysVideos.map((video, index) => getListItem(video, index, true))}
      {todaysBooks.map((book, index) => getListItem(book, index, false))}
      {todaysVideos.length === 0 && todaysBooks.length === 0 && (
        <li className="px-4 py-6 text-center text-slate-500">No featured content added today.</li>
      )}
    </ul>
  );
};

export default FeaturedContentList;
