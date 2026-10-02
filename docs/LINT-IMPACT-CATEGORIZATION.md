# Lint Fix Impact Categorization

This document ranks the pre-fix lint baseline from **least likely to affect platform behavior** to **most likely to affect platform behavior**. It answers four questions for each category:

- Could the fix break the website?
- Will the fix require further testing?
- Could the fix make something work differently than intended?
- Could the fix improve or worsen performance?

This assessment is based on the pre-fix diagnostics recorded in [LINT-REPORT.md](LINT-REPORT.md). The actual implementation should still be reviewed case by case.

## 1. Lowest impact: unescaped JSX entities

**Rule:** `react/no-unescaped-entities`  
**Current findings:** 148 errors across 44 files

These fixes normally change only how text is written in JSX, for example replacing a literal apostrophe with `&apos;` or `&#39;`.

| Question | Assessment |
| --- | --- |
| Could it break the website? | Very unlikely. The rendered text should remain visually equivalent. Risk increases only if the text is inside an unusual HTML attribute or contains intentional markup. |
| Is further testing required? | Low. Run lint and do a quick visual check of pages containing changed text. |
| Could behavior change unintentionally? | Very unlikely. The main possible change is typography or spacing in a small piece of text. |
| Performance effect | None in practice. |

**Recommended approach:** Fix mechanically, then spot-check legal, marketing, chat, and admin pages.

## 2. Low impact: missing image alternative text

**Rule:** `jsx-a11y/alt-text`  
**Current findings:** 1 warning in `components/features/admin/AdminNotifications.js`

Adding `alt` text improves accessibility without changing the image source or interaction. Use meaningful text for informative images and `alt=""` for decorative images.

| Question | Assessment |
| --- | --- |
| Could it break the website? | Very unlikely. The image itself is unchanged. Incorrectly descriptive text could reduce accessibility quality but should not break the page. |
| Is further testing required? | Low. Check the affected admin view with a screen reader or accessibility inspection if available. |
| Could behavior change unintentionally? | Only for users of assistive technology, and the intended change is beneficial. |
| Performance effect | None. |

**Recommended approach:** Fix immediately after confirming whether the image is informative or decorative.

## 3. Low-to-medium impact: unused variables and imports

**Rule:** `@typescript-eslint/no-unused-vars`  
**Current findings:** 228 errors across 48 files

Most findings are dead imports, unused state values, unused parameters, or unused local variables. Removing them is usually safe, but an import can still have module-load side effects even when its exported value is unused.

| Question | Assessment |
| --- | --- |
| Could it break the website? | Usually no, but removing an import with side effects, a registration step, or required CSS can break a feature. Removing an unused-looking state setter or parameter can also be unsafe if the code is incomplete. |
| Is further testing required? | Medium. Run lint and the relevant page or route. Prioritize admin, chat, payment, upload, and API files. |
| Could behavior change unintentionally? | Yes, if the value is actually used indirectly, triggers module initialization, or represents unfinished functionality. |
| Performance effect | Usually slightly better through less JavaScript and less work during module loading. The effect is normally small. |

**Recommended approach:** Remove clearly unused imports first. Review unused values in event handlers, effects, API routes, and payment/upload code manually. Do not blindly apply an auto-fix across the repository.

## 4. Medium impact: image element migration

**Rule:** `@next/next/no-img-element`  
**Current findings:** 22 warnings across 16 files

Replacing `<img>` with `next/image` can improve image optimization, loading behavior, and bandwidth usage. It can also change layout, sizing, caching, allowed domains, and how remote or user-uploaded images are handled.

| Question | Assessment |
| --- | --- |
| Could it break the website? | Yes, moderately. Images can disappear or fail if remote hosts are not configured, dimensions are missing, or an image relies on unrestricted browser behavior. |
| Is further testing required? | Yes. Test desktop and mobile layouts, remote images, uploaded images, loading states, and pages with image links or overlays. |
| Could behavior change unintentionally? | Yes. Aspect ratio, cropping, loading priority, intrinsic sizing, and error handling may change. |
| Performance effect | Usually better for production images through optimization and responsive sizing. It can be worse if used incorrectly, such as marking too many images as high priority or adding excessive server transformations. |

**Recommended approach:** Migrate user-facing production images individually. Treat `app/uploadimgtest/page.js` as a special test page and verify whether plain `<img>` is intentional before changing it.

## 5. Medium-to-high impact: replacing `require()` imports

**Rule:** `@typescript-eslint/no-require-imports`  
**Current findings:** 6 errors across `app/api/estt-ai/route.js` and `app/api/upload-drive/route.js`

Changing CommonJS loading to ES module imports can affect when a dependency loads, how default exports are shaped, and whether a server-only dependency is bundled correctly.

| Question | Assessment |
| --- | --- |
| Could it break the website? | Yes. These are API routes, so an import change can cause route startup failures, export mismatches, or deployment bundling problems. |
| Is further testing required? | Yes. Test the affected API routes locally and verify the production build or deployment bundle. Include success and failure paths. |
| Could behavior change unintentionally? | Yes. Module initialization timing and interop between CommonJS and ES modules can change. |
| Performance effect | Usually neutral. Static imports may improve bundler analysis, but they can also load a dependency earlier than a dynamic `require()`. |

**Recommended approach:** Inspect each `require()` before changing it. Preserve dynamic loading when it is required for optional dependencies, server-only code, or environment-specific behavior.

## 6. High impact: React Hook dependency fixes

**Rule:** `react-hooks/exhaustive-deps`  
**Current findings:** 13 warnings across 9 files

These warnings concern effects that may use stale values or may run with unnecessary dependencies. The correct fix depends on the intended lifecycle, not just on making the warning disappear.

| Question | Assessment |
| --- | --- |
| Could it break the website? | Yes. Adding a dependency can cause repeated requests, subscriptions, redirects, state resets, or render loops. Removing one can preserve stale data and hide a real bug. |
| Is further testing required? | Definitely. Test the complete affected workflow, including initial load, updates, navigation, authentication changes, empty states, and network failures. |
| Could behavior change unintentionally? | Yes, this is the main risk. The timing and frequency of side effects can change significantly. |
| Performance effect | Either direction. Correct dependencies can prevent stale work, while an incorrectly added dependency can trigger extra fetches, renders, subscriptions, or expensive processing. |

**Recommended approach:** Understand the effect's intended lifecycle first. Prefer restructuring the effect or moving stable logic when appropriate. Avoid disabling the rule without documenting why.

## 7. High impact: undefined JSX identifier

**Rule:** `react/jsx-no-undef`  
**Current finding:** `CalendarDays` in `components/features/chat/ChatInput.js`

This is a direct correctness issue. The symbol should be imported, defined, or replaced with the intended component. Depending on the build path, the current code can prevent compilation or make the chat input unusable.

| Question | Assessment |
| --- | --- |
| Could it break the website? | The current issue may already break the relevant build or chat route. A wrong replacement could introduce a visible UI or interaction problem. |
| Is further testing required? | Yes, but narrowly: run lint/build and test the chat input, including the calendar action and responsive layout. |
| Could behavior change unintentionally? | Yes, if the wrong icon or component is substituted, or if the missing symbol was intended to represent a different action. |
| Performance effect | Normally neutral. Importing one icon has negligible effect, though unused icon imports should be avoided. |

**Recommended approach:** Confirm the intended icon from nearby UI and import the matching component. Validate the chat workflow immediately after the fix.

## 8. Highest impact: global Next.js font configuration

**Rules:** `@next/next/no-page-custom-font` and `@next/next/google-font-display`  
**Current findings:** 4 errors in `app/layout.js`

The root layout affects every page. Changing font loading or removing custom font markup can alter typography, layout dimensions, page-load behavior, and visual stability across the platform.

| Question | Assessment |
| --- | --- |
| Could it break the website? | Yes, potentially across the whole site. Incorrect font configuration can cause build failures, missing fonts, fallback-font layout shifts, or styling regressions. |
| Is further testing required? | Definitely. Run lint and production build, then inspect representative marketing, core, authentication, admin, and mobile pages. Check font loading in the browser network and performance panels. |
| Could behavior change unintentionally? | Yes. Text wrapping, button sizes, navigation height, form layout, and visual identity can all change. |
| Performance effect | Usually better when migrated to the supported Next.js font API because fonts can be optimized and self-hosted. It can be worse if the migration adds large font files, too many weights, or blocks rendering. |

**Recommended approach:** Treat this as a layout-wide change. Capture the current typography on representative pages, migrate using the supported Next.js font mechanism, and compare screenshots and performance before and after.

## Overall priority

| Order | Category | Main concern |
| ---: | --- | --- |
| 1 | Unescaped JSX entities | Text-only change; very low runtime risk |
| 2 | Missing image `alt` text | Accessibility improvement; negligible runtime risk |
| 3 | Unused variables and imports | Usually safe, but side-effect imports require review |
| 4 | `<img>` to `next/image` migration | Layout, remote-host, and loading behavior can change |
| 5 | `require()` to import changes | API route and module-interoperability risk |
| 6 | Hook dependency fixes | Side effects, repeated requests, stale state, and performance risk |
| 7 | Undefined JSX identifier | Direct build or feature correctness issue |
| 8 | Global font configuration | Site-wide layout, build, and performance impact |

## Testing strategy

1. Handle text, accessibility, and clearly unused code in small batches; run lint after each batch.
2. For image and import changes, test the specific affected page or API route before moving on.
3. For hooks, test each workflow that owns the effect and watch the browser console and network activity.
4. For `app/layout.js`, run a production build and inspect representative pages at desktop and mobile widths.
5. Rerun `npm run lint` at the end and compare the remaining diagnostics with [LINT-REPORT.md](LINT-REPORT.md).
