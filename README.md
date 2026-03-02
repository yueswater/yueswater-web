# Yueswater Blog Frontend

This is the visual presentation and content editing interface for [Yueswater](https://www.yueswater.com/), built with **Next.js 15** and **Tailwind CSS**. The frontend implements a Markdown editor with live preview capabilities, and integrates sophisticated image processing and cross-reference logic.

## Tech Stack

- **Next.js 15 (App Router)**: Leverages server-side rendering (SSR) for SEO optimization, combined with client components for interactive logic.
- **Tailwind CSS**: Used alongside the **Typography (prose)** plugin for article layout and styling, ensuring professional visual hierarchy for Markdown content.
- **Framer Motion**: Provides smooth transition animations for article entry and editor mode switching.
- **React Markdown**: Supports standard GFM, mathematical expressions (KaTeX), and raw HTML rendering.
- **Lucide React**: Supplies icons for the editor toolbar and UI components.

## Project Structure

The project encapsulates core logic within highly reusable components.

- `app/admin/write`: The primary editing page, integrating auto-save and keyboard shortcut support.
- `components/features/posts`: Contains the article body renderer (`ArticleBody`), table of contents navigation (`TableOfContents`), and interaction panels.
- `context`: Manages global state, including authentication (`AuthContext`) and the notification system (`ToastContext`).
- `services`: Encapsulates asynchronous logic for communicating with the backend API.
- `utils`: Provides utility functions for image scaling (`imageHelpers`) and URL manipulation.

## Core Editor Features

### Smart Image Handling and Cross-References

The editor integrates a custom image upload module. During upload, users can adjust the aspect ratio; the system automatically retrieves the original dimensions, computes the target width and height, and inserts the result as an HTML `<img>` tag into the article body. By assigning each image a unique `id`, users can implement in-article cross-reference navigation using the `[label](@fig-xxxx)` syntax.

### Auto-Numbering and Rendering Logic

The rendering engine uses CSS counters to automatically prepend figure labels such as "Figure 1" and "Figure 2" to images within an article. To ensure consistent display across platforms, raw HTML is parsed via `rehype-raw`, and all default borders and shadows on images are explicitly removed to maintain clean, content-focused presentation.

### Content Protection Mechanisms

To prevent content loss, the editor provides the following safeguards.

- **Auto-save**: Automatically submits a snapshot of the current content to the backend every 30 seconds.
- **Keyboard shortcut**: Supports `Ctrl+S` (or `Cmd+S`) to manually trigger a draft save.
- **Session continuity**: The JWT refresh mechanism ensures that network requests during editing sessions do not fail due to token expiry.

## Environment Configuration

Configure the following variables in `.env.local` before starting the project.

- `NEXT_PUBLIC_API_URL`: The URL pointing to the backend Django API.
- `SERVER_API_URL`: *(Optional)* An internal URL used for server-side requests.

## Getting Started

```bash
npm install
npm run dev
```