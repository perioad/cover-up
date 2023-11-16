import { Injectable } from '@angular/core';
// @ts-expect-error
import { ID3Writer } from 'browser-id3-writer';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoverUpService {
  addImageToMp3$(mp3File: File, imageFile: File): Observable<string> {
    return from(
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event: any) => {
          try {
            const mp3Buffer = event.target.result;
            const writer = new ID3Writer(mp3Buffer);
            const imageReader = new FileReader();

            imageReader.onload = (imgEvent: any) => {
              writer.setFrame('APIC', {
                type: 3,
                data: imgEvent.target.result,
                description: 'Album cover',
              });
              writer.addTag();

              const taggedSongBuffer = writer.arrayBuffer;
              const blob = new Blob([taggedSongBuffer], { type: 'audio/mp3' });
              const url = URL.createObjectURL(blob);

              resolve(url);
            };

            imageReader.readAsArrayBuffer(imageFile);
          } catch (error) {
            reject(error);
          }
        };

        reader.readAsArrayBuffer(mp3File);
      })
    );
  }
}
