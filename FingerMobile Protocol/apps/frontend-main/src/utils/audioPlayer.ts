import React, {} from 'react';
export const playAudio = (audioUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio
      .play()
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const stopAudio = (audio: HTMLAudioElement) => {
  audio.pause();
  audio.currentTime = 0;
};
