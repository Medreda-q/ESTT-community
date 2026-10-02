# Manual Test Guide: `require()` Import Migration

This guide covers the migration in:

- `/api/estt-ai`
- `/api/upload-drive`

The migration preserves lazy loading for optional document parsers and uses ES module imports for PDF parsing and Node streams.

## API tests

### 1. AI document extraction

Use the application workflow that sends a PDF, DOCX, Google Drive file, or Google Docs URL to the AI assistant.

Check:

- PDF text extraction still returns readable text.
- DOCX extraction still returns readable text.
- Google Drive and Google Docs links still return extracted content or the existing friendly failure response.
- Invalid, oversized, and unreachable files still return the existing error response.
- The server console does not report module import or parser type errors.

### 2. Drive upload

Use a test upload from a contribution, bug report, or resource workflow that uses `/api/upload-drive`.

Check:

- Authentication is still required.
- A valid file uploads successfully to Google Drive.
- The uploaded file keeps its display name and MIME type.
- Folder selection still works for bug reports and categorized uploads.
- The returned view and download URLs are present.
- Permission creation and the existing fallback behavior still work.

## Automated validation

The focused ESLint check passes for both API routes, including `@typescript-eslint/no-require-imports`. Run the production build as an additional bundling check:

```text
npm run build
```

The full build may still stop at unrelated repository lint findings documented in [LINT-REPORT.md](LINT-REPORT.md).
