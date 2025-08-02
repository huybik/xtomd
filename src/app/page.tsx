'use client';

import { useState, useEffect, useCallback } from 'react';
import { BookText } from 'lucide-react';
import type { ProcessedFile } from '@/lib/types';
import { PdfUploader } from '@/components/pdf-uploader';
import { MarkdownPreview } from '@/components/markdown-preview';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const { toast } = useToast();
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);

  const updateFile = useCallback((id: string, updates: Partial<Omit<ProcessedFile, 'id' | 'file'>>) => {
    setFiles(currentFiles =>
      currentFiles.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  const processFile = useCallback((file: ProcessedFile) => {
    updateFile(file.id, { status: 'processing' });
    
    // Simulate API call and conversion with subtle animation
    const processTime = 1500 + Math.random() * 2000;
    setTimeout(() => {
        const isSuccess = Math.random() > 0.1; // 90% success rate
        if (isSuccess) {
            const completedFile = {
                status: 'completed' as const,
                markdown: `# Converted: ${file.name}\n\nThis is a dummy markdown conversion of your PDF file. It includes some *styling* and a list:\n\n- Item 1\n- Item 2\n- Item 3\n\n\`\`\`javascript\nconsole.log("Hello, from ${file.name}!");\n\`\`\``
            };
            updateFile(file.id, completedFile);
        } else {
            updateFile(file.id, { status: 'error', error: 'An unexpected error occurred during conversion.' });
        }
    }, processTime);
  }, [updateFile]);

  useEffect(() => {
    // Process one file at a time from the queue
    const queuedFile = files.find(f => f.status === 'queued');
    if (queuedFile) {
      processFile(queuedFile);
    }
  }, [files, processFile]);

  const handleUpload = (newFiles: File[]) => {
    const processed = newFiles.map(file => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        name: file.name,
        status: 'queued',
    } as ProcessedFile));
    setFiles(current => [...current, ...processed]);
  };
  
  const handleClear = () => {
    setFiles([]);
  };

  const completedFiles = files.filter(f => f.status === 'completed');

  const handleCopy = async (file: ProcessedFile) => {
    if (!file.markdown) return;
    try {
      await navigator.clipboard.writeText(file.markdown);
      setCopiedFileId(file.id);
      toast({ title: 'Copied to clipboard!', description: `Content of ${file.name} is now in your clipboard.` });
      setTimeout(() => setCopiedFileId(null), 2000);
    } catch (err) {
      toast({ title: 'Failed to copy', description: 'Could not copy text to clipboard.', variant: 'destructive' });
    }
  };

  const handleDownload = (file: ProcessedFile) => {
    if (!file.name || !file.markdown) return;
    const blob = new Blob([file.markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.name.replace(/\.pdf$/i, '.md'));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleCopyAll = async () => {
    const markdown = completedFiles.map(f => f.markdown).join('\n\n---\n\n');
    if (!markdown) return;
    try {
      await navigator.clipboard.writeText(markdown);
      toast({ title: 'All copied to clipboard!', description: 'Content of all converted files is now in your clipboard.' });
    } catch (err) {
      toast({ title: 'Failed to copy', description: 'Could not copy text to clipboard.', variant: 'destructive' });
    }
  };

  const handleDownloadAll = () => {
    const markdown = completedFiles.map(f => f.markdown).join('\n\n---\n\n');
    if (!markdown) return;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'xtomd_converted.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="border-b shrink-0 bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BookText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">xtomd</h1>
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block">
            The easiest way to convert PDF to Markdown.
          </p>
        </div>
      </header>
      <main className="flex-1 w-full container mx-auto p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-2 items-start">
            <PdfUploader 
              files={files} 
              onUpload={handleUpload} 
              onClear={handleClear}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onCopyAll={handleCopyAll}
              onDownloadAll={handleDownloadAll}
              copiedFileId={copiedFileId}
            />
            <div className="space-y-8">
              {completedFiles.length > 0 ? (
                completedFiles.map(file => (
                  <MarkdownPreview key={file.id} file={file} />
                ))
              ) : (
                <MarkdownPreview file={null} />
              )}
            </div>
        </div>
      </main>
      <footer className="border-t shrink-0 bg-card">
        <div className="container mx-auto flex h-16 items-center justify-center px-4">
          <p className="text-center text-sm text-muted-foreground">
            Built with Next.js & ShadCN UI.
          </p>
        </div>
      </footer>
    </div>
  );
}
