# ImageLab

> **Your images. Your control. Perfectly optimized.**
> 
> A premium browser-based image compression, resizing and format conversion toolkit built with React, TypeScript and Vite.

---

## Overview

**ImageLab** is a client-side image processing web utility designed with the elegance and performance of modern desktop creative tools (Linear, Raycast). It empowers creators, developers, and photographers to compress, resize, and convert images directly in the browser with real-time visual previews and zero server dependencies.

### Privacy First Architecture

- **100% Client-Side Execution:** Images are never transmitted over a network or uploaded to external servers. All operations happen in-memory via the HTML Canvas and ImageBitmap APIs.
- **Zero Cloud Storage:** No persistent cloud buckets (S3, Cloudinary) or tracking scripts.
- **Automatic Memory Cleanup:** Decoded bitmaps and Blob URLs (`URL.createObjectURL`) are systematically revoked upon disposal to ensure optimal memory safety on mobile and low-spec hardware.

---

## Core Features

### 1. Image Upload & Workspace Management
- **Drag-and-Drop & File Picker:** Fluid drag-over states with file-type validation.
- **Multiple Workspace Files:** Load multiple images simultaneously with thumbnail strip navigation.
- **Active Selection & Pruning:** Switch active files or discard items independently.
- **Supported Formats:** JPEG, PNG, and WebP (up to 20 MB and 10,000 × 10,000 px).
- **Strict Decoding Validation:** Verifies actual image bytes rather than trusting file extensions alone.

### 2. High-Fidelity Compression
- **Lossy Compression Tuning:** Adjustable quality sliders (5% to 100%) for JPEG and WebP.
- **Lossless Handling for PNG:** Transparent communication explaining that Canvas PNG is lossless.
- **Transparency Preservation & Flattening:** Preserves alpha channels where supported; alerts when converting transparent images to JPEG with custom background color fill (White, Black, Neutral, or Custom Hex).
- **Real Metrics:** Computes actual Blob byte measurements, reduction percentages, and execution time (in milliseconds).

### 3. Precise Resizing
- **Aspect Ratio Locking:** Automatic recalculation of width/height maintaining original proportions.
- **Scale by Percentage:** Quick presets for 25%, 50%, 75%, 100%, 150%, and 200%.
- **Industry Standard Presets:**
  - Full HD (1920 × 1080)
  - HD (1280 × 720)
  - Instagram Square (1080 × 1080)
  - Instagram Portrait (1080 × 1350)
  - Story / Reel (1080 × 1920)
- **Controlled Upscaling:** Upscaling disabled by default with an explicit opt-in switch to prevent accidental image degradation.

### 4. Format Conversion
- **Cross-Format Conversion:** Full support between JPEG, PNG, and WebP.
- **Browser Capability Detection:** Detects browser encoding support before committing output Blobs.
- **Educational Guidance:** Clear notes explaining that converting lossy JPEG to PNG cannot reconstruct lost high-frequency details.

### 5. Interactive Comparison & Inspection
- **Side-by-Side Split View:** Desktop view comparing original and processed versions with dimensional overlays.
- **Quick-Toggle View:** Mobile-optimized single-touch toggle between original and processed states.
- **Checkerboard Transparency Backdrop:** Crisp display of transparent pixel regions.

### 6. Meaningful Downloads
- Single-click downloads with descriptive filenames (`[filename]-compressed.webp`, `[filename]-resized.jpg`, etc.) and verified Blob MIME types.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Framework & Core** | React 19, TypeScript (Strict Mode), Vite 6 |
| **Styling & Design System** | Tailwind CSS 3, Custom CSS Variables, Warm neutral palette |
| **Icons & Motion** | Lucide React, Framer Motion |
| **Image Pipeline** | HTML Canvas API, `createImageBitmap`, `canvas.toBlob` |
| **Testing Suite** | Vitest, React Testing Library, JSDOM |
| **Deployment** | Netlify Free (Static SPA configuration) |

---

## Design System & Color Palette

The interface is built around an 85% warm white/neutral, 10% charcoal text, and 5% indigo accent proportion to provide a calm, non-distracting workspace:

| Token | Light Theme | Dark Theme |
|---|---|---|
| **Background** | `#F7F7F5` | `#131315` |
| **Surface** | `#FFFFFF` | `#1B1B1E` |
| **Surface Subtle** | `#F2F2EF` | `#222226` |
| **Border** | `#E7E7E3` | `#2C2C32` |
| **Text (Main)** | `#202124` | `#ECECEE` |
| **Text (Muted)**| `#777777` | `#98989F` |
| **Primary Accent**| `#4F46E5` | `#6366F1` |
| **Success** | `#25845A` | `#34D399` |
| **Error** | `#D94B4B` | `#F87171` |

Persistent theme selection (Light, Dark, System) is saved in `localStorage`.

---

## Project Architecture

```text
src/
├── app/
│   ├── App.tsx                    # Top-level application layout
│   └── providers/
│       ├── theme-context.ts       # Context definition for theme state
│       └── theme-provider.tsx     # Theme provider and persistence
├── components/
│   ├── layout/
│   │   ├── Header.tsx             # Header with logo, theme toggle & privacy modal
│   │   ├── Footer.tsx             # Footer with Prabhu attribution link
│   ├── shared/                    # Reusable design primitives
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Slider.tsx
│   │   └── Switch.tsx
├── features/
│   └── image-processing/
│       ├── components/
│       │   ├── EmptyState.tsx         # Drag-and-drop workspace uploader
│       │   ├── ImageQueue.tsx         # Multi-file thumbnail selector
│       │   ├── ImageWorkspace.tsx     # Primary workspace coordinator
│       │   ├── BeforeAfterView.tsx    # Split comparison & toggle view
│       │   ├── OperationSelector.tsx  # Operation tabs (Compress, Resize, Convert)
│       │   ├── CompressSettings.tsx   # Quality slider & transparency controls
│       │   ├── ResizeSettings.tsx     # Dimensions, locks, percentage & presets
│       │   ├── ConvertSettings.tsx    # Format conversion options
│       │   └── ProcessingStats.tsx    # Savings breakdown & download button
│       ├── hooks/
│       │   ├── useWorkspaceImages.ts  # Workspace file queue & memory management
│       │   └── useImageProcessing.ts  # Operation coordination & stale result rejection
│       ├── services/
│       │   ├── canvas-processor.ts    # Core canvas rendering & blob export
│       │   ├── image-loader.ts        # ImageBitmap decoding & transparency detection
│       │   ├── image-compressor.ts    # Compression service
│       │   ├── image-resizer.ts       # Resizing service with upscaling guards
│       │   └── image-converter.ts     # Format conversion service
│       ├── constants/                 # Presets, limits, and MIME mappings
│       ├── types/                     # Domain TypeScript contracts
│       └── utils/
│           ├── dimension-utils.ts     # Aspect ratios and clamping math
│           ├── file-utils.ts          # Validation and download triggers
│           └── format-utils.ts        # Bytes, durations, and filename generator
├── hooks/
│   └── useTheme.ts                # Custom hook for theme consumption
├── lib/
│   └── utils.ts                   # Tailwind merge helper
├── styles/
│   └── index.css                  # Tailwind styles and custom transparency grid
├── test/
│   └── setup.ts                   # Vitest setup & browser polyfills
└── main.tsx                       # Entry point
```

---

## Local Development & Setup

### Prerequisites

- Node.js `v18.0.0` or higher (tested on Node v24)
- npm `v9.0.0` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/prabhu/imagelab.git
cd imagelab

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Opens the local Vite development server at `http://localhost:5173`.

### Verification Commands

```bash
# Type check TypeScript without emitting files
npm run typecheck

# Run ESLint across source files
npm run lint

# Run all unit and component tests with Vitest
npm run test

# Build optimized production bundle
npm run build
```

---

## Deployment on Netlify Free

The project is structured for zero-configuration, zero-cost static hosting on Netlify Free.

### Configuration (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Steps to Deploy

1. Connect your repository to Netlify.
2. Select default build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
3. Click **Deploy Site**. No environment variables or serverless functions required.

---

## Known Browser Limitations

- **Canvas Metadata Stripping:** Browser `canvas.toBlob()` re-encodes pixel matrices and deliberately strips EXIF tags, GPS coordinates, and camera profiles. This enhances user privacy but means copyright/camera metadata is omitted in the output.
- **WebP Support:** While modern Chromium, Firefox, and Safari fully support WebP encoding in Canvas, extremely old browser engines will fail WebP encoding; ImageLab detects this and shows an actionable fallback notice.
- **Lossless PNG Encoding:** HTML5 Canvas does not provide a lossy quantization algorithm for PNG files; file size reductions for PNG are achieved by resizing dimensions or converting to modern WebP.

---

## Attribution & Author

ImageLab was designed and built by **Prabhu**.

- **Portfolio:** [https://prabhu-coder.netlify.app/](https://prabhu-coder.netlify.app/)
- **License:** MIT License
