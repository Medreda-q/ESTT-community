# Manual Test Guide: Low-Impact Lint Fixes

This guide covers the fixes for:

- `react/no-unescaped-entities`: escaped apostrophes and quotation marks in JSX text
- `jsx-a11y/alt-text`: the Lucide `Image` icon naming collision that was reported as a missing `alt` attribute

The fixes should not change application logic. The checks below confirm that text still renders correctly and that the affected notification interfaces still work.

## Before testing

1. Start the application with `npm run dev`.
2. Open `http://localhost:3000`.
3. Sign in with a normal test account for core pages.
4. Use an administrator account for admin pages.
5. Keep the browser console open and note any new errors.

## Pages to visit

### 1. Not-found page

Visit `http://localhost:3000/this-page-does-not-exist`.

Check:

- The 404 page renders without a hydration or console error.
- The French text displays apostrophes correctly in `l'EST`, `n'a`, and `l'accueil`.
- The **Aller à l'accueil** button navigates to `/`.
- The **Retourner** button returns to the previous page.
- The layout is readable on desktop and mobile widths.

### 2. Notifications page

Visit `http://localhost:3000/notifications` while signed in.

Check:

- Notifications load, or the empty state appears if the account has none.
- Notification icons render normally, including notifications configured with the `image` icon.
- Mark-as-read and any available notification actions still work.
- No missing-image warning appears in the console.
- Refreshing the page does not change the layout or produce a hydration error.

### 3. Admin notifications page

Visit `http://localhost:3000/admin/notifications` with an administrator account.

Check:

- The page loads and the notification form is visible.
- The icon selector or icon preview renders the `image` icon normally.
- Entering text containing apostrophes or quotation marks keeps the text readable.
- Send/global and private notification actions still validate and submit as expected in the test environment.
- No missing-image warning appears in the console.

### 4. Representative text pages

Visit these public routes and scan headings, paragraphs, buttons, and notices for broken text or visible entity strings:

- `/privacy`
- `/terms`
- `/browse`
- `/contribute`
- `/docs`
- `/download`
- `/search`
- `/contact`
- `/drive`

For each page, confirm:

- Apostrophes and quotation marks display as normal punctuation.
- No literal `&apos;`, `&quot;`, or similar entity text is visible.
- Links and buttons remain in their original positions.
- The browser console has no new render or hydration errors.

## Automated checks already run

The focused ESLint check was run against the directly touched files:

```text
UnescapedEntityDiagnostics: 0
AltTextDiagnostics: 0
```

The full lint command will continue to report findings from the other categories documented in [LINT-REPORT.md](LINT-REPORT.md). Those categories were intentionally not changed in this pass.

## Pass criteria

The low-impact pass is successful when all listed pages render, text punctuation is normal, notification icons and actions still work, and the focused ESLint check remains at zero for both rules.
