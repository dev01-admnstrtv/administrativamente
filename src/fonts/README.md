# Charter Font Files

This directory should contain the Charter font files for the premium reading experience:

## Required Files:
- `Charter-Regular.woff2`
- `Charter-Italic.woff2`
- `Charter-Bold.woff2`
- `Charter-BoldItalic.woff2`

## Where to Get Charter:
Charter is available from:
1. **Hoefler & Co.** (original source) - https://www.typography.com/fonts/charter/overview
2. **Adobe Fonts** (if you have Creative Cloud subscription)
3. **Google Fonts** has a similar font called "Charter" that you can use as alternative

## Installation:
1. Download the Charter font files in WOFF2 format
2. Place them in this directory with the exact names listed above
3. The fonts are already configured in `src/app/layout.tsx`

## Fallback Fonts:
If Charter fonts are not available, the system will fall back to:
- New York (macOS)
- Georgia Pro
- Georgia
- System serif font

## Alternative Setup (Google Fonts):
If you prefer to use Google Fonts instead of local files, you can modify `src/app/layout.tsx` to use the Google Fonts Charter variant.