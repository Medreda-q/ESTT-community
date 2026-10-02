# Manual Test Guide: Unused Variables and Imports

This guide covers the category-3 cleanup for `@typescript-eslint/no-unused-vars`. The pass removes unused imports, router bindings, unused catch names, and state values whose setters are still used. Stateful handlers and callback parameters that may represent unfinished features remain under review.

## Before testing

1. Start the application with `npm run dev`.
2. Keep the browser console open.
3. Test with a normal account, then an administrator account where noted.
4. Verify the relevant network requests in the browser Network panel.

## Pages to visit

### Authentication and home

- `/signup`
- `/`

Check that signup loads without errors, the home page renders its announcements, clubs, advertisements, and activity sections, and navigation still works.

### Club and event workflows

- `/clubs`
- `/clubs/<clubId>`
- `/clubs/<clubId>/join`
- `/clubs/<clubId>/events/<eventId>/registration`
- `/clubs/<clubId>/admin/scanner`

Check that club data loads, joining a club still submits correctly, event registration preserves form values and success state, and the QR scanner still requests camera access and processes a test ticket.

### Messaging and notifications

- `/messages`
- `/messages/<conversationId>`
- `/notifications`

Check that conversations load, opening a conversation still decrypts and displays messages, sending works, notification icons render, and read actions still update state.

### Profile and projects

- `/profile/<userId>`
- `/projects/<projectId>`
- `/projects/<projectId>/submissions/<submissionId>`
- `/resource/<resourceId>`
- `/tickets/<ticketId>`

Check that profile data, project details, submissions, resources, and ticket states render without console errors. Test any available edit, upload, refresh, or navigation action.

### Advertising

- `/ads-portal`
- `/ads-portal/submit`
- `/ads-portal/dashboard`

Check that ad forms load, preview and submit flows remain usable, dashboard ads load, delete actions still work, and payment navigation remains available through the visible UI.

### Admin pages

- `/admin/ads`
- `/admin/overview`
- `/admin/notifications`
- `/admin/messages`
- `/admin/resources`

Use an administrator account. Check that tables, filters, dialogs, notification actions, and resource management controls still render and respond.

## Automated validation

The focused ESLint checks passed for each edited batch. The repository currently has **77 remaining** `@typescript-eslint/no-unused-vars` diagnostics; these are primarily unused state, handlers, and callback parameters requiring behavior review before removal.

Run:

```text
npm run lint
```

Then confirm the remaining diagnostics are reviewed against the higher-risk list before continuing.

## Pass criteria

The cleanup is safe when the listed pages render, their visible actions still work, no new browser errors appear, and the affected API/network flows remain unchanged.
