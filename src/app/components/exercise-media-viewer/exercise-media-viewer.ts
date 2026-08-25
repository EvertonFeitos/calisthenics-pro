import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { getEmbedVideoUrl } from '../../utils/mediaHelper';

@Component({
  selector: 'app-exercise-media-viewer',
  imports: [CommonModule],
  templateUrl: './exercise-media-viewer.html',
  styleUrl: './exercise-media-viewer.scss',
})
export class ExerciseMediaViewer implements OnChanges {
  private static readonly TRUSTED_EMBED_HOSTS = new Set([
    'www.youtube-nocookie.com',
    'player.vimeo.com',
  ]);

  @Input() imageUrl?: string;
  @Input() videoUrl?: string;
  @Input() exerciseName = 'Exercício';
  @Input() collapsible = false;
  @Input() defaultCollapsed = false;

  protected activeTab: 'video' | 'image' = 'image';
  protected imageError = false;
  protected isCollapsed = false;
  protected videoType: 'youtube' | 'vimeo' | 'mp4' | null = null;
  protected embedUrl: string | null = null;
  protected safeEmbedUrl: SafeResourceUrl | null = null;

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnChanges(_changes: SimpleChanges): void {
    const parsed = getEmbedVideoUrl(this.videoUrl);
    this.videoType = parsed.type;
    this.embedUrl = parsed.embedUrl;
    this.safeEmbedUrl = this.createTrustedEmbedUrl(parsed.embedUrl, parsed.type);
    this.imageError = false;
    this.isCollapsed = this.defaultCollapsed;
    this.activeTab = this.hasVideo ? 'video' : 'image';
  }

  protected get hasVideo(): boolean {
    return this.videoType === 'mp4' ? !!this.embedUrl : !!this.safeEmbedUrl;
  }

  protected get hasImage(): boolean {
    return !!this.imageUrl && !this.imageError;
  }

  protected handleImageError(): void {
    this.imageError = true;
    if (this.activeTab === 'image' && this.hasVideo) {
      this.activeTab = 'video';
    }
  }

  private createTrustedEmbedUrl(
    embedUrl: string | null,
    videoType: 'youtube' | 'vimeo' | 'mp4' | null
  ): SafeResourceUrl | null {
    if (!embedUrl || videoType === null || videoType === 'mp4') {
      return null;
    }

    try {
      const parsed = new URL(embedUrl);
      const isTrustedHost = ExerciseMediaViewer.TRUSTED_EMBED_HOSTS.has(parsed.hostname);

      if (parsed.protocol !== 'https:' || !isTrustedHost) {
        return null;
      }

      return this.sanitizer.bypassSecurityTrustResourceUrl(parsed.toString());
    } catch {
      return null;
    }
  }
}
