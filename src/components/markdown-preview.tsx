'use client';

import type { FC } from 'react';
import React, { useState } from 'react';
import { FileText, Copy, Download, CopyCheck } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { ProcessedFile } from '@/lib/types';

interface MarkdownPreviewProps {
  file: ProcessedFile | null;
}

export const MarkdownPreview: FC<MarkdownPreviewProps> = ({ file }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async (content: string) => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({ title: 'Copied to clipboard!', description: `Content of ${file?.name} is now in your clipboard.` });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: 'Failed to copy', description: 'Could not copy text to clipboard.', variant: 'destructive' });
    }
  };

  const handleDownload = (filename: string, content: string) => {
    if (!filename || !content) return;
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

  return (
    <Card className="lg:sticky lg:top-8 h-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Markdown Preview</CardTitle>
          <CardDescription>
            {file ? `Previewing: ${file.name}` : 'Select a completed file to see the preview.'}
          </CardDescription>
        </div>
        {file && file.markdown && (
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleCopy(file.markdown!)}>
                    {copied ? <CopyCheck /> : <Copy />}
                    Copy
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload(file.name, file.markdown!)}>
                    <Download />
                    Download
                </Button>
            </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg min-h-[400px] lg:min-h-[500px] overflow-hidden">
          {file ? (
            <ScrollArea className="h-full max-h-[500px] p-4">
              <article className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="text-sm whitespace-pre-wrap bg-transparent p-0 m-0">{file.markdown}</pre>
              </article>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
              <FileText className="h-16 w-16 text-muted-foreground/50" />
              <p className="mt-4 font-medium text-muted-foreground">No file selected</p>
              <p className="text-sm text-muted-foreground/80">Your converted markdown will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
