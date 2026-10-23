// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { ExternalLink, Play, Video } from 'lucide-react';
// import { fallbackFinancialVideo } from '@/lib/fallbackData';
// import { useVideoStore } from '@/store/useVideoStore';

// /** Pull a YouTube video id out of any common YouTube URL */
// function getYouTubeId(url = '') {
//   const match = String(url).match(
//     /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/
//   );
//   return match ? match[1] : null;
// }

// function getVimeoId(url = '') {
//   const match = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/);
//   return match ? match[1] : null;
// }

// /** Normalise one admin-provided video into what the UI needs */
// function normalizeVideo(raw, index) {
//   if (!raw) return null;
//   const link = raw.videoUrl || raw.embedUrl || raw.url || raw.youtubeUrl || raw.link || '';
//   if (!link) return null;

//   const ytId = getYouTubeId(link);
//   const vimeoId = !ytId ? getVimeoId(link) : null;

//   let embedSrc = link;
//   let watchUrl = link;
//   if (ytId) {
//     embedSrc = `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`;
//     watchUrl = `https://www.youtube.com/watch?v=${ytId}`;
//   } else if (vimeoId) {
//     embedSrc = `https://player.vimeo.com/video/${vimeoId}`;
//     watchUrl = `https://vimeo.com/${vimeoId}`;
//   }

//   const joiner = embedSrc.includes('?') ? '&' : '?';

//   return {
//     id: raw._id || raw.id || ytId || vimeoId || `video-${index}`,
//     title: raw.title || 'Financial Video',
//     description: raw.description || raw.summary || '',
//     duration: raw.duration || '',
//     thumbnail:
//       raw.thumbnailUrl || raw.thumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : ''),
//     watchUrl,
//     playSrc: `${embedSrc}${joiner}autoplay=1`,
//   };
// }

// function Thumb({ video, className = '' }) {
//   return video.thumbnail ? (
//     <img
//       src={video.thumbnail}
//       alt={video.title}
//       loading="lazy"
//       className={`h-full w-full object-cover ${className}`}
//     />
//   ) : (
//     <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#10243A] via-[#163352] to-[#0a1827]">
//       <Video className="h-8 w-8 text-white/30" />
//     </div>
//   );
// }

// /**
//  * Video Showcase Component
//  * One layout for any number of videos: player on the left, side panel on the right.
//  *  - 1 video  -> side panel shows the video details
//  *  - 2+ videos -> side panel shows a playlist
//  * Usage: <VideoShowcase initialVideos={financialVideos} />
//  */
// export default function VideoShowcase({ initialVideos = [] }) {
//   const { videos: storeVideos, fetchVideos, setVideos } = useVideoStore();

//   useEffect(() => {
//     if (Array.isArray(initialVideos) && initialVideos.length > 0) {
//       setVideos(initialVideos);
//     } else {
//       fetchVideos();
//     }
//   }, [initialVideos, setVideos, fetchVideos]);

//   const rawList =
//     storeVideos && storeVideos.length > 0
//       ? storeVideos
//       : Array.isArray(initialVideos) && initialVideos.length > 0
//       ? initialVideos
//       : [];

//   const videos = useMemo(() => {
//     const list = rawList.map(normalizeVideo).filter(Boolean);
//     if (list.length > 0) return list.slice(0, 4);
//     const fallback = normalizeVideo(fallbackFinancialVideo, 0);
//     return fallback ? [fallback] : [];
//   }, [rawList]);

//   const [activeIndex, setActiveIndex] = useState(0);
//   const [playing, setPlaying] = useState(false);

//   // Keep the selection valid if the list changes
//   useEffect(() => {
//     if (activeIndex > videos.length - 1) setActiveIndex(0);
//   }, [videos.length, activeIndex]);

//   if (videos.length === 0) return null;

//   const active = videos[activeIndex] || videos[0];
//   const isPlaylist = videos.length > 1;

//   const selectVideo = (idx) => {
//     setActiveIndex(idx);
//     setPlaying(true);
//   };

//   return (
//     <section id="financial-video" className="py-10 sm:py-14 bg-white scroll-mt-20 border-t border-slate-200/80">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
//           <div>
//             <span className="text-xs font-bold uppercase tracking-wider text-[#f87b1f] bg-[#f87b1f]/10 px-3.5 py-1 rounded-full border border-[#f87b1f]/20 inline-block mb-2.5">
//               Learn &amp; Grow
//             </span>
//             <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 tracking-tight">
//               Financial Videos
//             </h2>
//           </div>
//           <p className="text-slate-500 text-xs sm:text-sm max-w-md text-left sm:text-right leading-relaxed">
//             Short, practical guides on investing, compounding and wealth creation.
//           </p>
//         </div>

//         {/* Card: player + side panel (same layout for 1 or many videos) */}
//         <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg lg:h-[420px] lg:grid-cols-12">
//           {/* Player */}
//           <div className="relative aspect-video bg-slate-950 lg:col-span-8 lg:aspect-auto lg:h-full">
//             {playing ? (
//               <iframe
//                 key={`${active.id}-${activeIndex}`}
//                 src={active.playSrc}
//                 title={active.title}
//                 className="absolute inset-0 h-full w-full border-0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                 allowFullScreen
//               />
//             ) : (
//               <button
//                 type="button"
//                 onClick={() => setPlaying(true)}
//                 aria-label={`Play ${active.title}`}
//                 className="group absolute inset-0 block h-full w-full cursor-pointer"
//               >
//                 <Thumb video={active} className="transition-transform duration-700 group-hover:scale-105" />
//                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/10" />
//                 <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#2376b8] shadow-xl transition-transform duration-300 group-hover:scale-110">
//                   <Play className="ml-1 h-7 w-7 fill-current" />
//                 </span>
//                 <span className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-6">
//                   <span className="block line-clamp-2 text-sm font-bold leading-snug text-white drop-shadow sm:text-lg">
//                     {active.title}
//                   </span>
//                 </span>
//               </button>
//             )}
//           </div>

//           {/* Side panel */}
//           <aside className="flex min-h-0 flex-col border-t border-slate-200/80 bg-slate-50/70 lg:col-span-4 lg:border-l lg:border-t-0">
//             {isPlaylist ? (
//               <>
//                 <div className="flex shrink-0 items-center justify-between border-b border-slate-200/80 px-4 py-3">
//                   <div className="flex items-center gap-2">
//                     <span className="h-2 w-2 animate-pulse rounded-full bg-[#f87b1f]" />
//                     <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Playlist</span>
//                   </div>
//                   <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-slate-500 ring-1 ring-slate-200">
//                     {videos.length} videos
//                   </span>
//                 </div>

//                 <div className="news-feed-scroll max-h-[320px] flex-1 space-y-2 overflow-y-auto overscroll-contain p-3 lg:max-h-none">
//                   {videos.map((video, idx) => {
//                     const isActive = idx === activeIndex;
//                     return (
//                       <button
//                         key={`${video.id}-${idx}`}
//                         type="button"
//                         onClick={() => selectVideo(idx)}
//                         className={`group flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-2 text-left transition-all duration-300 ${
//                           isActive
//                             ? 'border-[#2376b8] bg-white shadow-md ring-2 ring-[#2376b8]/15'
//                             : 'border-transparent bg-white/70 hover:border-slate-200 hover:bg-white hover:shadow-sm'
//                         }`}
//                       >
//                         <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-slate-200 sm:w-28">
//                           <Thumb video={video} className="transition-transform duration-500 group-hover:scale-105" />
//                           <span className="absolute inset-0 flex items-center justify-center bg-black/25">
//                             <Play className="h-4 w-4 fill-white text-white" />
//                           </span>
//                           {video.duration && (
//                             <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 py-0.5 text-[10px] font-semibold leading-none text-white">
//                               {video.duration}
//                             </span>
//                           )}
//                         </div>

//                         <div className="min-w-0 flex-1">
//                           <span
//                             className={`mb-0.5 block text-[10px] font-bold uppercase tracking-wider ${
//                               isActive ? 'text-[#2376b8]' : 'text-slate-400'
//                             }`}
//                           >
//                             {isActive ? 'Now playing' : `Video ${idx + 1}`}
//                           </span>
//                           <h4
//                             className={`line-clamp-2 text-xs font-bold leading-snug transition-colors sm:text-[13px] ${
//                               isActive ? 'text-[#2376b8]' : 'text-slate-900 group-hover:text-[#2376b8]'
//                             }`}
//                           >
//                             {video.title}
//                           </h4>
//                         </div>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </>
//             ) : (
//               <div className="flex h-full flex-col justify-center p-6 sm:p-8">
//                 <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[#2376b8]/20 bg-[#2376b8]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#2376b8]">
//                   <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2376b8]" />
//                   Featured video
//                 </span>

//                 <h3 className="text-lg font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">
//                   {active.title}
//                 </h3>

//                 {active.description && (
//                   <p className="mt-2 line-clamp-5 text-xs leading-relaxed text-slate-500 sm:text-sm">
//                     {active.description}
//                   </p>
//                 )}

//                 {active.duration && (
//                   <p className="mt-3 text-xs font-semibold text-slate-400">Duration: {active.duration}</p>
//                 )}

//                 <div className="mt-6 flex flex-wrap items-center gap-3">
//                   {!playing && (
//                     <button
//                       type="button"
//                       onClick={() => setPlaying(true)}
//                       className="inline-flex items-center gap-2 rounded-xl bg-[#f87b1f] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#d9620b] sm:text-sm"
//                     >
//                       <Play className="h-4 w-4 fill-current" />
//                       Watch now
//                     </button>
//                   )}
//                   <a
//                     href={active.watchUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2376b8] hover:underline sm:text-sm"
//                   >
//                     Open in new tab
//                     <ExternalLink className="h-3.5 w-3.5" />
//                   </a>
//                 </div>
//               </div>
//             )}
//           </aside>
//         </div>
//       </div>
//     </section>
//   );
// }


'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Play, Video } from 'lucide-react';
import { useVideoStore } from '@/store/useVideoStore';

const MAX_VIDEOS = 4;

/** Pull a YouTube video id out of any common YouTube URL */
function getYouTubeId(url = '') {
  const match = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

function getVimeoId(url = '') {
  const match = String(url).match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

/** Normalise one admin-provided video into what the UI needs */
function normalizeVideo(raw, index) {
  if (!raw) return null;
  const link = raw.videoUrl || raw.embedUrl || raw.url || raw.youtubeUrl || raw.link || '';
  if (!link) return null;

  const ytId = getYouTubeId(link);
  const vimeoId = !ytId ? getVimeoId(link) : null;

  let embedSrc = link;
  let watchUrl = link;
  if (ytId) {
    embedSrc = `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`;
    watchUrl = `https://www.youtube.com/watch?v=${ytId}`;
  } else if (vimeoId) {
    embedSrc = `https://player.vimeo.com/video/${vimeoId}`;
    watchUrl = `https://vimeo.com/${vimeoId}`;
  }

  const joiner = embedSrc.includes('?') ? '&' : '?';

  return {
    id: raw._id || raw.id || ytId || vimeoId || `video-${index}`,
    title: raw.title || 'Financial Video',
    description: raw.description || raw.summary || '',
    duration: raw.duration || '',
    thumbnail:
      raw.thumbnailUrl || raw.thumbnail || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : ''),
    watchUrl,
    playSrc: `${embedSrc}${joiner}autoplay=1`,
  };
}

function Thumb({ video, className = '' }) {
  return video.thumbnail ? (
    <img
      src={video.thumbnail}
      alt={video.title}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#10243A] via-[#163352] to-[#0a1827]">
      <Video className="h-8 w-8 text-white/30" />
    </div>
  );
}

/**
 * Video Showcase Component
 * Shows only the videos uploaded by the admin (no fallback video).
 * If there are no videos, the section is not rendered.
 *  - 1 video   -> side panel shows the video details
 *  - 2+ videos -> side panel shows a playlist
 * Usage: <VideoShowcase initialVideos={financialVideos} />
 */
export default function VideoShowcase({ initialVideos }) {
  const { videos: storeVideos, fetchVideos, setVideos } = useVideoStore();

  const initialList = Array.isArray(initialVideos) ? initialVideos : [];
  const hasInitial = initialList.length > 0;

  // Keep the latest initial list in a ref so the effect only re-runs when
  // "has initial videos" changes (a new empty [] each render won't re-trigger fetches)
  const initialRef = useRef(initialList);
  initialRef.current = initialList;

  useEffect(() => {
    if (hasInitial) {
      setVideos(initialRef.current);
    } else {
      fetchVideos();
    }
  }, [hasInitial, setVideos, fetchVideos]);

  const rawList = Array.isArray(storeVideos) && storeVideos.length > 0 ? storeVideos : initialList;

  const videos = useMemo(
    () => rawList.map(normalizeVideo).filter(Boolean).slice(0, MAX_VIDEOS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storeVideos, initialVideos]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Keep the selection valid if the list changes
  useEffect(() => {
    if (activeIndex > videos.length - 1) setActiveIndex(0);
  }, [videos.length, activeIndex]);

  // No videos uploaded -> hide the whole section
  if (videos.length === 0) return null;

  const active = videos[activeIndex] || videos[0];
  const isPlaylist = videos.length > 1;

  const selectVideo = (idx) => {
    setActiveIndex(idx);
    setPlaying(true);
  };

  return (
    <section id="financial-video" className="py-10 sm:py-14 bg-white scroll-mt-20 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#f87b1f] bg-[#f87b1f]/10 px-3.5 py-1 rounded-full border border-[#f87b1f]/20 inline-block mb-2.5">
              Learn &amp; Grow
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-slate-900 tracking-tight">
              Financial Videos
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md text-left sm:text-right leading-relaxed">
            Short, practical guides on investing, compounding and wealth creation.
          </p>
        </div>

        {/* Card: player + side panel (same layout for 1 or many videos) */}
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg lg:h-[420px] lg:grid-cols-12">
          {/* Player */}
          <div className="relative aspect-video bg-slate-950 lg:col-span-8 lg:aspect-auto lg:h-full">
            {playing ? (
              <iframe
                key={`${active.id}-${activeIndex}`}
                src={active.playSrc}
                title={active.title}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play ${active.title}`}
                className="group absolute inset-0 block h-full w-full cursor-pointer"
              >
                <Thumb video={active} className="transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/10" />
                <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#2376b8] shadow-xl transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-4 text-left sm:p-6">
                  <span className="block line-clamp-2 text-sm font-bold leading-snug text-white drop-shadow sm:text-lg">
                    {active.title}
                  </span>
                </span>
              </button>
            )}
          </div>

          {/* Side panel */}
          <aside className="flex min-h-0 flex-col border-t border-slate-200/80 bg-slate-50/70 lg:col-span-4 lg:border-l lg:border-t-0">
            {isPlaylist ? (
              <>
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200/80 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#f87b1f]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Playlist</span>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-slate-500 ring-1 ring-slate-200">
                    {videos.length} videos
                  </span>
                </div>

                <div className="news-feed-scroll max-h-[320px] flex-1 space-y-2 overflow-y-auto overscroll-contain p-3 lg:max-h-none">
                  {videos.map((video, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={`${video.id}-${idx}`}
                        type="button"
                        onClick={() => selectVideo(idx)}
                        className={`group flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-2 text-left transition-all duration-300 ${
                          isActive
                            ? 'border-[#2376b8] bg-white shadow-md ring-2 ring-[#2376b8]/15'
                            : 'border-transparent bg-white/70 hover:border-slate-200 hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-slate-200 sm:w-28">
                          <Thumb video={video} className="transition-transform duration-500 group-hover:scale-105" />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                            <Play className="h-4 w-4 fill-white text-white" />
                          </span>
                          {video.duration && (
                            <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 py-0.5 text-[10px] font-semibold leading-none text-white">
                              {video.duration}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <span
                            className={`mb-0.5 block text-[10px] font-bold uppercase tracking-wider ${
                              isActive ? 'text-[#2376b8]' : 'text-slate-400'
                            }`}
                          >
                            {isActive ? 'Now playing' : `Video ${idx + 1}`}
                          </span>
                          <h4
                            className={`line-clamp-2 text-xs font-bold leading-snug transition-colors sm:text-[13px] ${
                              isActive ? 'text-[#2376b8]' : 'text-slate-900 group-hover:text-[#2376b8]'
                            }`}
                          >
                            {video.title}
                          </h4>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col justify-center p-6 sm:p-8">
                <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[#2376b8]/20 bg-[#2376b8]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#2376b8]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2376b8]" />
                  Featured video
                </span>

                <h3 className="text-lg font-bold leading-snug tracking-tight text-slate-900 sm:text-xl">
                  {active.title}
                </h3>

                {active.description && (
                  <p className="mt-2 line-clamp-5 text-xs leading-relaxed text-slate-500 sm:text-sm">
                    {active.description}
                  </p>
                )}

                {active.duration && (
                  <p className="mt-3 text-xs font-semibold text-slate-400">Duration: {active.duration}</p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {!playing && (
                    <button
                      type="button"
                      onClick={() => setPlaying(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#f87b1f] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#d9620b] sm:text-sm"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Watch now
                    </button>
                  )}
                  <a
                    href={active.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2376b8] hover:underline sm:text-sm"
                  >
                    Open in new tab
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}