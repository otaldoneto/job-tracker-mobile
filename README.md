# Job Tracker Mobile

A React Native (Expo) client for [job-tracker](https://github.com/otaldoneto/job-tracker), the Kanban-style job
application tracker. Same data, same backend, now on iOS and Android — list your applications grouped by status,
and create, edit or delete them from your phone.

## Stack

- **Expo** + **React Native** — single codebase for iOS and Android
- **TypeScript**
- **Expo Router** — file-based routing (scaffolded by default, not yet used beyond the single screen)

This app has no backend of its own: it's a client for the [job-tracker](https://github.com/otaldoneto/job-tracker)
REST API.

## Running it locally

Requires the job-tracker web project running first (its Postgres container + `npm run dev`), since this app just
consumes its API.

```bash
npm install
npm run ios       # opens the iOS Simulator
npm run android   # opens an Android emulator
```

## Features

- Lists applications grouped by status (mirrors the web app's Kanban columns)
- Create, edit and delete applications from the app

## Technical decisions

**React Native with Expo, not a native Swift/Kotlin app.** A single TypeScript codebase covers both iOS and
Android, and it reuses the React knowledge already applied throughout this portfolio. Trade-off: less control over
platform-specific native APIs, not a concern for a REST API client like this one.

**The Android emulator needs a different API host than iOS.** The iOS Simulator shares the Mac's network stack, so
`localhost:3000` reaches the job-tracker server directly. The Android emulator runs as its own virtual machine —
`localhost` there refers to the emulator itself, not the host machine. `10.0.2.2` is the special alias Android's
emulator provides for the host's `localhost`, so the API base URL branches on `Platform.OS`.

**The edit modal is remounted by `key`, not patched with `useEffect`.** Its form fields start from `useState(initialValues?.company ?? '')`,
which only reads that initial value once. Reusing the same modal instance across different cards left it stuck
showing whichever application's data it saw first. Giving it `key={editingApplication?.id}` forces React to tear
down and recreate the component whenever the target application changes, resetting its internal state for free.

## Limitations

- No authentication — same trust model as the web app's own API.
- The API host is hardcoded for local development (`localhost` / `10.0.2.2`), not configurable for a deployed
  backend.
- No drag-and-drop reordering here; status changes and reordering still happen on the web app.
