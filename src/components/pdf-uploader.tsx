'use client';

import type { DragEvent, FC } from 'react';
import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  Download,
  Trash2,
  CopyCheck,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { ProcessedFile } from '@/lib/types';

interface PdfUploaderProps {
  files: ProcessedFile[];
  selectedFileId?: string;
  onUpload: (files: File[]) => void;
  onSelectFile: (file: ProcessedFile) => void;
  onClear: () => void;
}

interface FileItemProps {
  file: ProcessedFile;
  isSelected: boolean;
  onSelectFile: (file: ProcessedFile) => void;
}

const FileItem: FC<FileItemProps> = ({ file, isSelected, onSelectFile }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({ title: 'Copied to clipboard!', description: `Content of ${file.name} is now in your clipboard.` });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: 'Failed to copy', description: 'Could not copy text to clipboard.', variant: 'destructive' });
    }
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.replace(/\.pdf$/i, '.md'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const getStatusIcon = () => {
    switch (file.status) {
      case 'queued':
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  return (
    <div
      onClick={() => onSelectFile(file)}
      className={cn(
        'flex flex-col p-3 rounded-lg border transition-all duration-200 cursor-pointer',
        isSelected ? 'border-primary bg-primary/5' : 'hover:bg-accent/50',
        file.status !== 'completed' && 'cursor-default'
      )}
    >
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 shrink-0 text-muted-foreground" />
        <div className="flex-grow overflow-hidden">
          <p className="truncate font-medium">{file.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{file.status}</p>
        </div>
        <div className="shrink-0">{getStatusIcon()}</div>
      </div>
      {(file.status === 'processing' || file.status === 'completed') && file.status !== 'error' && (
        <Progress value={file.status === 'completed' ? 100 : 50} className="h-1 mt-2" />
      )}
      {file.status === 'error' && (
        <p className="text-xs text-destructive mt-1">{file.error}</p>
      )}
      {file.status === 'completed' && file.markdown && (
        <div className="mt-2 pt-2 border-t flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleCopy(file.markdown!)}>
            {copied ? <CopyCheck /> : <Copy />}
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDownload(file.name, file.markdown!)}>
            <Download />
            Download
          </Button>
        </div>
      )}
    </div>
  );
};

export const PdfUploader: FC<PdfUploaderProps> = ({ files, onUpload, onSelectFile, selectedFileId, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const pdfFiles = Array.from(event.target.files).filter(file => file.type === 'application/pdf');
      if (pdfFiles.length !== event.target.files.length) {
        toast({ title: 'Some files were not PDFs', description: 'Only PDF files are supported and have been added.', variant: 'default' });
      }
      onUpload(pdfFiles);
    }
  };
  
  const handleDragAction = (e: DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(isEntering);
    }
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDragAction(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const pdfFiles = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
      if (pdfFiles.length !== e.dataTransfer.files.length) {
        toast({ title: 'Some files were not PDFs', description: 'Only PDF files are supported and have been added.', variant: 'default' });
      }
      if(pdfFiles.length > 0) onUpload(pdfFiles);
      e.dataTransfer.clearData();
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Upload PDFs</CardTitle>
            <CardDescription>Drag & drop files or click to browse.</CardDescription>
        </div>
        {files.length > 0 && (
          <Button variant="destructive" size="sm" onClick={onClear}>
            <Trash2 className="mr-2 h-4 w-4"/> Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <div
          className={cn(
            'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors duration-200',
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          )}
          onDragEnter={(e) => handleDragAction(e, true)}
          onDragLeave={(e) => handleDragAction(e, false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-center text-muted-foreground">
            {isDragging ? 'Drop files here' : 'Drag & drop PDF files here, or click to select files'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        {files.length > 0 && (
            <>
                <Separator />
                <ScrollArea className="flex-grow h-0 min-h-[200px]">
                    <div className="space-y-2 pr-4">
                        {files.map(file => (
                            <FileItem key={file.id} file={file} isSelected={file.id === selectedFileId} onSelectFile={onSelectFile} />
                        ))}
                    </div>
                </ScrollArea>
            </>
        )}
      </CardContent>
    </Card>
  );
};
