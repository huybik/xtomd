'use client';

import type { FC } from 'react';
import React from 'react';
import { FileText } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ProcessedFile } from '@/lib/types';

interface MarkdownPreviewProps {
  file: ProcessedFile | null;
}

export const MarkdownPreview: FC<MarkdownPreviewProps> = ({ file }) => {
  return (
    <Card className="lg:sticky lg:top-8 h-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Markdown Preview</CardTitle>
          <CardDescription>
            {file ? `Previewing: ${file.name}` : 'Select a completed file to see the preview.'}
          </CardDescription>
        </div>
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
