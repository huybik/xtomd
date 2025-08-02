'use client';

import { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Download, CheckCircle, FileText } from 'lucide-react';
import type { ProcessedFile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface MarkdownPreviewProps {
  file: ProcessedFile | null;
}

export const MarkdownPreview: FC<MarkdownPreviewProps> = ({ file }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!file || !file.markdown) return;
    try {
      await navigator.clipboard.writeText(file.markdown);
      setCopied(true);
      toast({ title: 'Copied to clipboard!', description: `Content of ${file.name} is now in your clipboard.` });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: 'Failed to copy', description: 'Could not copy text to clipboard.', variant: 'destructive' });
    }
  };

  const handleDownload = () => {
    if (!file || !file.markdown) return;
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Markdown Preview</CardTitle>
          <CardDescription>
            {file ? `Previewing: ${file.name}` : 'Select a file to see the preview.'}
          </CardDescription>
        </div>
        {file && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy Markdown</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Download Markdown</span>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:my-4 prose-blockquote:my-2 prose-ul:my-2 prose-ol:my-2">
          {file ? (
            <ScrollArea className="h-[500px] p-4 border rounded-md">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {file.markdown || ''}
                </ReactMarkdown>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] border rounded-md">
              <FileText className="h-16 w-16 text-muted-foreground/50" />
              <p className="mt-4 font-medium text-muted-foreground">No file converted yet</p>
              <p className="text-sm text-muted-foreground/80">Your converted markdown will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
