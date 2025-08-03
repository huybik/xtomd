# xtomd

A simple and efficient web application for converting PDF files to Markdown, built with Next.js and ShadCN UI.

## Features

- **PDF to Markdown Conversion:** Upload one or more PDF files and get a clean Markdown output.
- **Drag and Drop Interface:** Easily upload files by dragging and dropping them into the application.
- **Real-time Preview:** View the generated Markdown for each converted file side-by-side with the uploader.
- **Individual & Bulk Actions:**
    - **Copy and Download:** Copy the Markdown of a single file to your clipboard or download it as a `.md` file.
    - **Copy and Download All:** Concatenate and copy or download all converted Markdown files at once for efficiency.
- **Responsive Design:** A clean and responsive interface that works on all screen sizes.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for building the user interface.
- [ShadCN UI](https://ui.shadcn.com/) - A collection of re-usable components for building the UI.
- [@opendocsg/pdf2md](https://www.npmjs.com/package/@opendocsg/pdf2md) - For the core PDF to Markdown conversion logic.
- [Tailwind CSS](https://tailwindcss.com/) - For styling the application.
- [TypeScript](https://www.typescriptlang.org/) - For static typing and improved developer experience.
- [Lucide React](https://lucide.dev/guide/packages/lucide-react) - For icons.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/get-npm)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/xtomd.git
   ```
2. Navigate to the project directory
   ```sh
   cd xtomd
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Run the development server
   ```sh
   npm run dev
   ```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1.  **Upload Files:** Drag and drop your PDF files onto the upload area, or click to select files from your computer.
2.  **Conversion:** The files will be automatically processed and converted to Markdown. You can see the status of each file.
3.  **Preview:** Once a file is converted, a preview of the Markdown will appear on the right side of the screen.
4.  **Copy/Download:**
    - For individual files, use the copy and download buttons next to each file name.
    - To get all the content at once, use the "Copy All" or "Download All" buttons that appear when multiple files are successfully converted.

## API Usage

You can also use the API directly to convert PDF files.

**Endpoint:** `POST /api`

The endpoint accepts `multipart/form-data` and can handle single or multiple file uploads. Use the `file` key for each file you upload.

### Example with `curl`

#### Single File Upload

```bash
curl -X POST \
  -F "file=@/path/to/your/document.pdf" \
  http://localhost:3000/api
```

#### Multiple File Upload

```bash
curl -X POST \
  -F "file=@/path/to/document1.pdf" \
  -F "file=@/path/to/document2.pdf" \
  http://localhost:3000/api
```

### Response Format

The API returns a JSON object containing a `results` array. Each object in the array represents a processed file.

**On Success:**

```json
{
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
}
```

**On Failure (for a specific file):**

If a file fails to convert, its `status` will be `error`, and it will include an `error` message.

```json
{
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
}
```

## Project Structure


```
/
├── public/
├── src/
│   ├── app/
│   │   ├── api/pdf-to-md/route.ts  # The API endpoint for PDF conversion
│   │   ├── page.tsx                # The main page component
│   │   └── layout.tsx              # The main layout component
│   ├── components/
│   │   ├── pdf-uploader.tsx        # The PDF uploader component
│   │   ├── markdown-preview.tsx    # The Markdown preview component
│   │   └── ui/                     # ShadCN UI components
│   ├── lib/
│   │   ├── types.ts                # TypeScript types
│   │   └── utils.ts                # Utility functions
├── package.json
└── README.md
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
