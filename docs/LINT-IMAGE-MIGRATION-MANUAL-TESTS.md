# Manual Test Guide: Image Element Migration

This guide covers the first `@next/next/no-img-element` cleanup batch:

- `ProjectBriefCard`
- `ProjectShowcaseCard`
- `ProjectSubmissionCard`
- `ProjectCarousel`

These components now use `next/image` while preserving their existing dimensions, object-fit behavior, alt text, and hover states.

## Pages to visit

1. `/projects`
2. `/projects/showcase/<showcaseId>`
3. `/projects/<projectId>`
4. `/projects/<projectId>/submissions/<submissionId>`

## Checks

- Project cover images load without broken-image icons.
- Cards keep their original height and `object-cover` cropping.
- Project carousel images fill the slide and preserve the fade/scale transition.
- Cards without images still show their existing placeholder.
- Alt text remains available for screen readers.
- Images load on desktop and mobile widths without layout shift or overflow.
- Hovering a submission card still applies the existing zoom effect.
- The browser console contains no Next.js image host or sizing errors.
- The Network panel shows image requests completing successfully for the configured remote hosts.

## Automated check

The four migrated components were checked with ESLint. No `@next/next/no-img-element` warnings were reported. The full repository still contains other image elements that require separate source and remote-host review.
