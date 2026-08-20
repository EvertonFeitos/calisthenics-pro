import React, { useState, useEffect } from 'react';
import { Play, Film, Image as ImageIcon, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { getEmbedVideoUrl } from '../utils/mediaHelper';

interface ExerciseMediaViewerProps {
  imageUrl?: string;
  videoUrl?: string;
  exerciseName: string;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export const ExerciseMediaViewer: React.FC<ExerciseMediaViewerProps> = ({
  imageUrl,
  videoUrl,
  exerciseName,
  className = '',
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'image'>(videoUrl ? 'video' : 'image');
  const [imageError, setImageError] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    setActiveTab(videoUrl ? 'video' : 'image');
    setImageError(false);
  }, [videoUrl, imageUrl, exerciseName]);

  const { type, embedUrl } = getEmbedVideoUrl(videoUrl);
  const hasVideo = !!embedUrl;
  const hasImage = !!imageUrl && !imageError;

  if (!hasVideo && !hasImage) {
    return null;
  }

  return (
    <div className={`overflow-hidden rounded-2xl bg-[#141414] border border-[#262626] shadow-md ${className}`}>
      {/* Header bar with Tab Selector and Collapse Toggle */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#181818] border-b border-[#242424]">
        <div className="flex items-center gap-1.5">
          {hasVideo && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('video');
                setIsCollapsed(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'video' && !isCollapsed
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[#888] hover:text-[#ccc] bg-[#202020]'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Vídeo Tutorial</span>
            </button>
          )}

          {hasImage && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('image');
                setIsCollapsed(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'image' && !isCollapsed
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[#888] hover:text-[#ccc] bg-[#202020]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Foto / Ilustração</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#666] font-medium hidden sm:inline">Execução Correta</span>
          {collapsible && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-[#888] hover:text-[#ccc] hover:bg-[#222] rounded-lg transition-colors flex items-center gap-1 text-[11px]"
              title={isCollapsed ? 'Expandir mídia' : 'Recolher mídia'}
            >
              <span className="text-[10px] font-semibold">{isCollapsed ? 'Exibir' : 'Ocultar'}</span>
              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Media Content Body if not collapsed */}
      {!isCollapsed && (
        <>
          {/* Video Content */}
          {hasVideo && (activeTab === 'video' || !hasImage) && (
            <div className="relative aspect-video w-full bg-black">
              {type === 'youtube' || type === 'vimeo' ? (
                <iframe
                  src={embedUrl || ''}
                  title={`Tutorial ${exerciseName}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : type === 'mp4' ? (
                <video
                  src={embedUrl || ''}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Seu navegador não suporta reprodução de vídeo.
                </video>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                  <Film className="w-8 h-8 text-indigo-400 mb-2" />
                  <p className="text-xs text-[#bbb] mb-2 font-medium">Link externo do vídeo disponível</p>
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors"
                  >
                    <span>Assistir vídeo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Image Content */}
          {hasImage && (activeTab === 'image' || !hasVideo) && (
            <div className="relative w-full bg-black/40 overflow-hidden flex items-center justify-center min-h-[160px] max-h-[300px]">
              <img
                src={imageUrl}
                alt={`Execução correta de ${exerciseName}`}
                className="w-full h-full object-contain max-h-[300px] transition-transform duration-300 hover:scale-105"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
