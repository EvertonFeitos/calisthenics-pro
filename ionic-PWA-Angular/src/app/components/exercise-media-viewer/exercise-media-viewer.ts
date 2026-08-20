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
  @Input() imageUrl?: string;
  @Input() videoUrl?: string;
  @Input() exerciseName = 'Exercício';
  @Input() collapsible = false;
  @Input() defaultCollapsed = false;

  protected activeTab: 'video' | 'image' = 'image';
  protected imageError = false;
  protected isCollapsed = false;
  protected videoType: 'youtube' | 'vimeo' | 'mp4' | 'other' | null = null;
  protected embedUrl: string | null = null;
  protected safeEmbedUrl: SafeResourceUrl | null = null;

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnChanges(_changes: SimpleChanges): void {
    const parsed = getEmbedVideoUrl(this.videoUrl);
    this.videoType = parsed.type;
    this.embedUrl = parsed.embedUrl;
    this.safeEmbedUrl =
      parsed.embedUrl && parsed.type !== 'mp4'
        ? this.sanitizer.bypassSecurityTrustResourceUrl(parsed.embedUrl)
        : null;
    this.imageError = false;
    this.isCollapsed = this.defaultCollapsed;
    this.activeTab = parsed.embedUrl ? 'video' : 'image';
  }

  protected get hasVideo(): boolean {
    return !!this.embedUrl;
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
}
