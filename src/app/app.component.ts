import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverUpService } from './services/cover-up.service';
import { AnimatedBgComponent } from './components/animated-bg/animated-bg.component';
import {
  Subject,
  catchError,
  combineLatest,
  finalize,
  map,
  of,
  take,
  timer,
} from 'rxjs';
import { LoaderComponent } from './components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AnimatedBgComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private coverUpService = inject(CoverUpService);
  private minLoadingTime = 1000;
  private _ariaMessage$ = new Subject<string>();

  public audioFile: File | null = null;
  public imageFile: File | null = null;
  public isLoading = false;
  public audioType = 'audio/mp3';
  public imageType = 'image/png, image/jpeg';
  public ariaMessage$ = this._ariaMessage$.asObservable();

  public get isCoverUpAllowed(): boolean {
    return !!(this.audioFile && this.imageFile);
  }

  public onFileSelected(event: Event): void {
    this.audioFile = this.extractFileFromEvent(event);
  }

  public onImageSelected(event: Event): void {
    this.imageFile = this.extractFileFromEvent(event);
  }

  public coverUp(): void {
    if (this.audioFile && this.imageFile) {
      this.isLoading = true;
      this.ariaAnnounce('The process has started');

      combineLatest([
        this.coverUpService.addImageToMp3$(this.audioFile, this.imageFile),
        timer(this.minLoadingTime),
      ])
        .pipe(
          take(1),
          map((emittion) => emittion[0]),
          catchError((error) => {
            console.error('Error processing files:', error);
            this.ariaAnnounce(
              'Something went wrong, the process has failed. Sorry'
            );

            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((url) => {
          if (!url) return;

          this.downloadAudio(url);
          this.ariaAnnounce('The process has finished successfully');
        });
    }
  }

  private downloadAudio(url: string): void {
    const link = document.createElement('a');
    const timestamp = new Date().toISOString();
    const nameWithoutFormat = this.audioFile!.name.split('.')
      .slice(0, -1)
      .join('.');

    link.href = url;
    link.download = `${nameWithoutFormat}-covered-up-${timestamp}.mp3`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private extractFileFromEvent(event: Event): File | null {
    const input = event.target as HTMLInputElement;

    return input.files ? input.files[0] : null;
  }

  private ariaAnnounce(message: string): void {
    this._ariaMessage$.next(message);
  }
}
