/**
 * Helper to convert various video URLs (YouTube, Vimeo, direct MP4) into safe embeddable URLs or direct players
 */
export function getEmbedVideoUrl(
  url?: string
): { type: 'youtube' | 'vimeo' | 'mp4' | null; embedUrl: string | null } {
  if (!url || typeof url !== 'string') {
    return { type: null, embedUrl: null };
  }

  const trimmed = url.trim();

  // YouTube matchers:
  // standard: https://www.youtube.com/watch?v=VIDEO_ID
  // short: https://youtu.be/VIDEO_ID
  // embed: https://www.youtube.com/embed/VIDEO_ID
  // shorts: https://www.youtube.com/shorts/VIDEO_ID
  const youtubeMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/i
  );
  if (youtubeMatch && youtubeMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}?autoplay=0&rel=0&modestbranding=1`,
    };
  }

  // Vimeo matchers
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`,
    };
  }

  // Direct video file (.mp4, .webm, .ogg)
  const directVideoUrl = getSafeDirectVideoUrl(trimmed);
  if (directVideoUrl) {
    return {
      type: 'mp4',
      embedUrl: directVideoUrl,
    };
  }

  return { type: null, embedUrl: null };
}

function getSafeDirectVideoUrl(url: string): string | null {
  if (!/\.(mp4|webm|ogg)($|\?)/i.test(url)) {
    return null;
  }

  // Allow local assets and same-origin relative paths without upgrading them to absolute URLs.
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    return null;
  }

  return null;
}
