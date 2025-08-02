export type FileStatus = 'queued' | 'processing' | 'completed' | 'error';

export interface ProcessedFile {
  id: string;
  file: File;
  name: string;
  status: FileStatus;
  markdown?: string;
  error?: string;
}
