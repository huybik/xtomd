import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const curlSingle = `curl -X POST \
  -F \"file=@/path/to/your/document.pdf\" \
  http://localhost:3000/api
`;

const curlMultiple = `curl -X POST \
  -F \"file=@/path/to/document1.pdf\" \
  -F \"file=@/path/to/document2.pdf\" \
  http://localhost:3000/api
`;

const pythonExample = `import requests

files = [
    ('file', ('document1.pdf', open('/path/to/document1.pdf', 'rb'), 'application/pdf')),
    ('file', ('document2.pdf', open('/path/to/document2.pdf', 'rb'), 'application/pdf'))
]

response = requests.post('http://localhost:3000/api', files=files)

if response.status_code == 200:
    print(response.json())
else:
    print(f"Error: {response.status_code}")
    print(response.text)`;

const javascriptExample = `const formData = new FormData();
formData.append('file', fileInput.files[0]); // Assuming 'fileInput' is an HTML file input element

fetch('http://localhost:3000/api', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;

const successResponse = `{
  "results": [
    {
      "fileName": "document1.pdf",
      "status": "success",
      "markdown": "# Your Converted Markdown..."
    },
    {
      "fileName": "document2.pdf",
      "status": "success",
      "markdown": "# Another Converted Markdown..."
    }
  ]
}`;

const errorResponse = `{
  "results": [
    {
      "fileName": "document1.pdf",
      "status": "success",
      "markdown": "# Your Converted Markdown..."
    },
    {
      "fileName": "problematic.pdf",
      "status": "error",
      "error": "Failed to convert problematic.pdf."
    }
  ]
}`;


export default function ApiDocsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <p>You can use the API directly to convert PDF files.</p>
          <h3 id="endpoint">Endpoint: <code>POST /api</code></h3>
          <p>The endpoint accepts <code>multipart/form-data</code> and can handle single or multiple file uploads. Use the <code>file</code> key for each file you upload.</p>
          
          <h3 id="examples">Examples</h3>

          <h4 id="curl"><code>curl</code></h4>
          <h5 id="single-file-upload">Single File Upload</h5>
          <pre><code>{curlSingle}</code></pre>
          
          <h5 id="multiple-file-upload">Multiple File Upload</h5>
          <pre><code>{curlMultiple}</code></pre>

          <h4 id="python">Python (using <code>requests</code>)</h4>
          <pre><code>{pythonExample}</code></pre>

          <h4 id="javascript">JavaScript (using <code>fetch</code>)</h4>
          <pre><code>{javascriptExample}</code></pre>
          
          <h3 id="response-format">Response Format</h3>
          <p>The API returns a JSON object containing a <code>results</code> array. Each object in the array represents a processed file.</p>
          
          <h4 id="on-success">On Success:</h4>
          <pre><code>{successResponse}</code></pre>
          
          <h4 id="on-failure-for-a-specific-file">On Failure (for a specific file):</h4>
          <p>If a file fails to convert, its <code>status</code> will be <code>error</code>, and it will include an <code>error</code> message.</p>
          <pre><code>{errorResponse}</code></pre>
        </CardContent>
      </Card>
    </div>
  );
}