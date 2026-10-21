import React, {} from 'react';
export interface MediaFile {id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  success?: boolean;
  message?: string;
  startTime?: number;
  endTime?: number;
  duration?: number;
  effect?: string;
}

export interface ImageData {width: number;
  height: number;
  src: string;
  gainMap?: Record<string,
  unknown>;
}

export interface VideoData {id: string;
  duration: number;
  width: number;
  height: number;
  startTime?: number;
  endTime?: number;
  effect?: string;
  scaled?: boolean;
  scale?: number;
  rotated?: boolean;
  degrees?: number;
}

export interface AudioData {id: string;
  duration: number;
}

export interface TrimSettings {start: number;
  end: number;
}

export interface ExportOptions {format: string;
  quality?: number;
  width?: number;
  height?: number;
}
