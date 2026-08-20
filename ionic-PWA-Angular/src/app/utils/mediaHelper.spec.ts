import { getEmbedVideoUrl } from './mediaHelper';

describe('getEmbedVideoUrl', () => {
  it('converte link do YouTube para embed nocookie', () => {
    const result = getEmbedVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    expect(result.type).toBe('youtube');
    expect(result.embedUrl).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0&modestbranding=1'
    );
  });

  it('converte link do Vimeo para embed player', () => {
    const result = getEmbedVideoUrl('https://vimeo.com/148751763');

    expect(result.type).toBe('vimeo');
    expect(result.embedUrl).toBe('https://player.vimeo.com/video/148751763');
  });

  it('preserva mp4 direto', () => {
    const result = getEmbedVideoUrl('https://cdn.example.com/planche.mp4');

    expect(result.type).toBe('mp4');
    expect(result.embedUrl).toBe('https://cdn.example.com/planche.mp4');
  });

  it('retorna outro tipo para links http nao suportados explicitamente', () => {
    const result = getEmbedVideoUrl('https://example.com/tutorial');

    expect(result.type).toBe('other');
    expect(result.embedUrl).toBe('https://example.com/tutorial');
  });

  it('retorna null para valor invalido', () => {
    const result = getEmbedVideoUrl('sem-url-valida');

    expect(result).toEqual({ type: null, embedUrl: null });
  });
});
