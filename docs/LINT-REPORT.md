# ESLint Report

Generated from `npm run lint` on 2026-10-01.

## Result

The lint command exited with code `1`.

| Severity | Count |
| --- | ---: |
| Errors | 383 |
| Warnings | 40 |
| Total diagnostics | 423 |

## Errors

### Unused variables: `@typescript-eslint/no-unused-vars`

**228 errors across 48 files.** These include unused imports, function parameters, local variables, and destructured values.

Affected files:

- `app/(marketing)/ads-portal/dashboard/page.js`
- `app/(marketing)/ads-portal/page.js`
- `app/(marketing)/ads-portal/submit/page.js`
- `app/(marketing)/browse/page.js`
- `app/(marketing)/contribute/page.js`
- `app/(marketing)/contribute-drive/page.js`
- `app/(marketing)/contribute-legacy/page.js`
- `app/(marketing)/docs/page.js`
- `app/(marketing)/download/page.js`
- `app/(marketing)/downloadAndroid/page.js`
- `app/(marketing)/remerciements/page.js`
- `app/(marketing)/report-bug/page.js`
- `app/(marketing)/search/page.js`
- `app/api/drive/auth/route.js`
- `app/api/estt-ai/route.js`
- `app/api/github-events/route.js`
- `app/api/upload-drive/route.js`
- `app/app/page.js`
- `app/contact/page.js`
- `app/deeplink/[...slug]/page.js`
- `app/emails-templates/page.js`
- `app/page.js`
- `app/sitemap.js`
- `components/features/admin/AdminAds.js`
- `components/features/admin/AdminBugReports.js`
- `components/features/admin/AdminClubRequests.js`
- `components/features/admin/AdminCommunication.js`
- `components/features/admin/AdminFastContribute.js`
- `components/features/admin/AdminMessages.js`
- `components/features/admin/AdminNotifications.js`
- `components/features/admin/AdminOverview.js`
- `components/features/admin/AdminRewardCodes.js`
- `components/features/admin/AdminShortUrls.js`
- `components/features/admin/AdminSidebar.js`
- `components/features/admin/Dashboard.js`
- `components/features/admin/ModeratorSidebar.js`
- `components/features/chat/ChatBubble.js`
- `components/features/feed/ActivityFeed.js`
- `components/features/projects/ProjectShowcaseCard.js`
- `components/features/projects/ProjectSubmissionCard.js`
- `components/features/promotions/PromotionalModal.js`
- `components/layout/Footer.js`
- `components/layout/Header.js`
- `components/profile/SettingsModal.jsx`
- `lib/drive.js`
- `lib/lemonsqueezy.js`
- `lib/notifications.js`
- `lib/pdfUtils.js`

### Unescaped entities: `react/no-unescaped-entities`

**148 errors across 44 files.** Apostrophes in JSX text must be escaped as `&apos;`, `&lsquo;`, `&#39;`, or `&rsquo;`.

Affected files:

- `app/(legal)/privacy/page.js`
- `app/(legal)/terms/page.js`
- `app/(marketing)/ads-portal/dashboard/page.js`
- `app/(marketing)/ads-portal/page.js`
- `app/(marketing)/ads-portal/submit/page.js`
- `app/(marketing)/browse/page.js`
- `app/(marketing)/contribute/page.js`
- `app/(marketing)/contribute-drive/page.js`
- `app/(marketing)/contribute-legacy/page.js`
- `app/(marketing)/docs/page.js`
- `app/(marketing)/download/page.js`
- `app/(marketing)/downloadAndroid/page.js`
- `app/(marketing)/remerciements/page.js`
- `app/(marketing)/report-bug/page.js`
- `app/(marketing)/search/page.js`
- `app/(marketing)/thanks/page.js`
- `app/contact/page.js`
- `app/download-export/[token]/page.js`
- `app/drive/page.js`
- `app/not-found.js`
- `app/resource-contact/[threadId]/page.js`
- `app/uploadimgtest/page.js`
- `components/features/admin/AdminAds.js`
- `components/features/admin/AdminAnnouncements.js`
- `components/features/admin/AdminClubChanges.js`
- `components/features/admin/AdminCommunication.js`
- `components/features/admin/AdminFastContribute.js`
- `components/features/admin/AdminNotifications.js`
- `components/features/admin/AdminOverview.js`
- `components/features/admin/AdminResources.js`
- `components/features/admin/AdminSettings.js`
- `components/features/admin/AdminSidebar.js`
- `components/features/admin/ModeratorDocs.js`
- `components/features/admin/ModeratorSidebar.js`
- `components/features/admin/RejectionDialog.js`
- `components/features/chat/ChatBubble.js`
- `components/features/chat/ChatTermsDialog.js`
- `components/features/marketing/AdsPreview.js`
- `components/features/marketing/ClubsPreview.js`
- `components/features/promotions/PromotionalModal.js`
- `components/layout/Footer.js`
- `components/layout/Header.js`
- `components/profile/ProfileCompletionDialog.jsx`
- `components/profile/SettingsModal.jsx`

### CommonJS imports: `@typescript-eslint/no-require-imports`

**6 errors across 2 files.** Replace `require()` calls with imports where the module format allows it, or document the dynamic-loading requirement.

- `app/api/estt-ai/route.js`
- `app/api/upload-drive/route.js`

### Undefined JSX identifier: `react/jsx-no-undef`

**1 error.** `CalendarDays` is referenced without being defined or imported.

- `components/features/chat/ChatInput.js`

### Other error rules

- `@next/next/no-page-custom-font`: **3 errors** in `app/layout.js`. Use the supported Next.js font loading approach.
- `@next/next/google-font-display`: **1 error** in `app/layout.js`. Configure the Google font display behavior through the supported font API.

## Warnings

### Unoptimized images: `@next/next/no-img-element`

**22 warnings across 16 files.** Replace `<img>` with `next/image` where optimization is appropriate. Keep plain `<img>` only when there is a specific reason and document that exception.

Affected files:

- `app/(marketing)/ads-portal/dashboard/page.js`
- `app/(marketing)/ads-portal/submit/page.js`
- `app/(marketing)/browse/page.js`
- `app/(marketing)/report-bug/page.js`
- `app/uploadimgtest/page.js`
- `components/features/admin/AdminAds.js`
- `components/features/admin/AdminAnnouncements.js`
- `components/features/admin/AdminClubRequests.js`
- `components/features/admin/AdminCommunication.js`
- `components/features/chat/ChatBubble.js`
- `components/features/chat/ChatInput.js`
- `components/features/projects/ProjectBriefCard.js`
- `components/features/projects/ProjectCarousel.js`
- `components/features/projects/ProjectShowcaseCard.js`
- `components/features/projects/ProjectSubmissionCard.js`
- `components/layout/FloatingAssistant.jsx`

### React Hook dependencies: `react-hooks/exhaustive-deps`

**13 warnings across 9 files.** Review each effect. Add genuinely used reactive values, remove unnecessary outer-scope values, or restructure the effect when the dependency is intentionally stable.

Affected files:

- `app/(marketing)/ads-portal/dashboard/page.js`
- `app/(marketing)/browse/page.js`
- `app/(marketing)/contribute-drive/page.js`
- `app/(marketing)/contribute-legacy/page.js`
- `app/page.js`
- `components/features/chat/ChatBubble.js`
- `components/features/chat/ChatInput.js`
- `components/features/promotions/PromotionalModal.js`
- `components/layout/Header.js`

### Missing image alternative text: `jsx-a11y/alt-text`

**1 warning.** Add meaningful `alt` text, or use `alt=""` when the image is purely decorative.

- `components/features/admin/AdminNotifications.js`

## Recommended remediation order

1. Fix `react/jsx-no-undef` and the Next.js font errors because they indicate direct correctness or framework integration issues.
2. Remove unused imports and variables to reduce noise and reveal any remaining behavioral problems.
3. Escape JSX entities throughout user-facing text.
4. Review hook dependency warnings individually; do not silence them mechanically.
5. Migrate image elements and add missing `alt` text.
6. Replace `require()` calls where possible and rerun `npm run lint`.
