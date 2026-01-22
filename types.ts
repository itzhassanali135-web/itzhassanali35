
export interface TransformationResult {
  id: string;
  sourceUrl: string;
  referenceUrl: string;
  resultUrl: string;
  timestamp: number;
  prompt: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  TRANSFORMING = 'TRANSFORMING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ImageState {
  source: string | null;
  reference: string | null;
}
