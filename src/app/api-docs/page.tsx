import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const curlSingle = `curl -X POST \
  -F \"file=@/path/to/your/document.pdf\" \
  https://xtomd.vercel.app/api
`;

const curlMultiple = `curl -X POST \
  -F \"file=@/path/to/document1.pdf\" \
  -F \"file=@/path/to/document2.pdf\" \
  https://xtomd.vercel.app/api
`;

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <p>You can use the API directly to convert PDF files.</p>
          <h3 id="endpoint">
            Endpoint: <code>POST /api</code>
          </h3>
          <p>
            The endpoint accepts <code>multipart/form-data</code> and can handle
            single or multiple file uploads. Use the <code>file</code> key for
            each file you upload.
          </p>

          <h3 id="examples">Examples</h3>

          <h4 id="curl">
            <code>curl</code>
          </h4>
          <h5 id="single-file-upload">Single File Upload</h5>
          <pre>
            <code>{curlSingle}</code>
          </pre>

          <h5 id="multiple-file-upload">Multiple File Upload</h5>
          <pre>
            <code>{curlMultiple}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
