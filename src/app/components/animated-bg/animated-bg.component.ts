import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animated-bg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animated-bg.component.html',
  styleUrl: './animated-bg.component.scss',
})
export class AnimatedBgComponent implements AfterViewInit {
  @ViewChild('container', { static: true }) container!: ElementRef;

  constructor(private renderer: Renderer2) {}

  public ngAfterViewInit(): void {
    this.addCircles(15);
  }

  private addCircles(count: number): void {
    for (let i = 0; i < count; i++) {
      const circle = this.renderer.createElement('div');
      const vw = this.getRandomVw();

      this.renderer.addClass(circle, 'circle');
      this.renderer.setStyle(circle, 'width', vw);
      this.renderer.setStyle(circle, 'height', vw);
      this.renderer.setStyle(circle, 'background-color', this.getRandomColor());
      this.renderer.setStyle(
        circle,
        'animation',
        `moveAround${i} ${this.getRandomDuration()} infinite linear`
      );
      this.renderer.appendChild(this.container.nativeElement, circle);

      const initialX = this.getRandomPosition();
      const initialY = this.getRandomPosition();
      const keyframes = `
        @keyframes moveAround${i} {
          0% { transform: translate(${initialX}, ${initialY}); }
          25% { transform: translate(${this.getRandomPosition()}, ${this.getRandomPosition()}); }
          50% { transform: translate(${this.getRandomPosition()}, ${this.getRandomPosition()}); }
          75% { transform: translate(${this.getRandomPosition()}, ${this.getRandomPosition()}); }
          100% { transform: translate(${initialX}, ${initialY}); }
        }
      `;
      this.addStyles(keyframes);
    }
  }

  private getRandomDuration(): string {
    return `${this.getRandomInt(100, 60)}s`;
  }

  private getRandomVw(): string {
    return `${this.getRandomInt(20, 10)}vw`;
  }

  private getRandomColor(): string {
    return `hsl(${this.getRandomInt(360)}, 100%, 50%)`;
  }

  private getRandomPosition(): string {
    return `${this.getRandomInt(100, -50)}${this.getRandomViewport()}`;
  }

  private getRandomViewport(): string {
    return this.getRandomInt(10) > 5 ? 'vw' : 'vh';
  }

  private addStyles(styles: string): void {
    const styleSheet = document.createElement('style');

    styleSheet.innerText = styles;
    this.renderer.appendChild(document.head, styleSheet);
  }

  private getRandomInt(max: number, min: number = 0): number {
    return Math.random() * (max - min) + min;
  }
}
