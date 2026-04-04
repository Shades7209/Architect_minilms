# Mini LMS Mobile App

Mini LMS is a React Native Expo assignment project that demonstrates authentication, native mobile features, WebView integration, persistence, and course browsing using the FreeAPI platform.

## Overview

The app simulates a lightweight learning management system where users can:

- register and log in
- stay signed in across app restarts
- browse a generated course catalog
- search and bookmark courses
- open course details
- view embedded lesson content in a WebView
- receive local notifications
- continue with offline awareness

API base used in the project:

`https://api.freeapi.app/api/v1`

## Technology Stack

### Mandatory Technologies

- Framework: React Native Expo SDK 54
- Language: TypeScript with strict mode enabled
- Data persistence:
  - Expo SecureStore for auth tokens
  - React Native MMKV for app data
- Navigation: Expo Router
- Styling: NativeWind

### Additional Libraries Used

- React Hook Form
- Zod
- Axios
- Expo Notifications
- Expo Image Picker
- Expo Image
- React Native WebView
- LegendList
- React Native Reanimated

## Features Implemented

### Part 1: Authentication & User Management

- Login using FreeAPI `/users/login`
- Register using FreeAPI `/users/register`
- Auth token storage in Expo SecureStore
- Session restore on app restart
- Logout support
- Profile screen showing user details
- Profile picture update via image picker and avatar upload API

### Part 2: Course Catalog

- Instructors fetched from `/public/randomusers`
- Courses fetched from `/public/randomproducts`
- Course cards show:
  - thumbnail
  - instructor name
  - title
  - description
  - bookmark icon
- Pull-to-refresh on home screen
- Search screen with filtering
- Bookmark persistence with MMKV
- Course details screen

### Part 3: WebView Integration

- Embedded WebView content viewer
- Local HTML template rendered for course content
- Native-to-WebView communication through request headers

### Part 4: Native Features

- Notification permission request
- Notification when 5 courses are bookmarked
- 24-hour reminder notification
- Offline detection screen

### Part 5: State Management & Performance

- Global authentication state through context
- Global bookmark state through context
- SecureStore for sensitive data
- MMKV for local app data
- LegendList used for large scrolling lists
- Stable keys via `keyExtractor`

## Project Structure

```text
app/
  (auth)/
  (root)/
    (tabs)/
components/
src/
  API/
  Context/
  Services/
  Storage/
  validation/
assets/
```

## Setup Instructions

### Prerequisites

- Node.js 18 or newer
- npm
- Android Studio for Android testing
- Xcode for iOS testing on macOS

### Install

```bash
npm install
```

### Start the Expo project

```bash
npm start
```

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
npm run ios
```

### Run on Web

```bash
npm run web
```

## Environment Variables Needed

No environment variables are required for the current implementation.

The FreeAPI base URL is currently hardcoded in the source code.

## Build Instructions

### Android development build

```bash
npm run android
```

This launches the native Android app on an emulator or connected device.

### iOS development build

```bash
npm run ios
```

### APK deliverable status

An APK release pipeline is not yet configured in this repository. To fully satisfy the assignment deliverable, EAS Build or an equivalent Android release process should be added.

## Key Architectural Decisions

- FreeAPI random products are treated as courses because the assignment does not provide a dedicated course API.
- FreeAPI random users are mapped as instructors for the catalog.
- SecureStore is used only for sensitive authentication data.
- MMKV is used for fast local persistence of bookmarks and recent searches.
- Context providers are used for shared authentication and bookmark state.
- Expo Router keeps navigation file-based and easy to scale.
- WebView content is generated from a local HTML template so the app can control content structure and branding.

## Known Issues / Limitations

- Token refresh handling is not implemented yet.
- API retry logic is not implemented yet.
- API timeout handling is not implemented yet.
- User preferences are not persisted yet.
- Course list state is still screen-local rather than globally shared.
- WebView error fallback UI is still limited.
- Offline handling is currently a full-screen state, not a banner.
- Some profile statistics are placeholders because the API does not provide LMS progress data.
- APK release configuration is still pending.

## Screenshots of Main Screens

Add screenshots here before submission:

- Sign In / Register
- Home / Course List
- Search
- Saved Courses
- Profile
- Course Details
- WebView Viewer
- Offline State

Suggested format:

```md
![Sign In](./docs/screenshots/sign-in.png)
![Home](./docs/screenshots/home.png)
![Profile](./docs/screenshots/profile.png)
```

## Demo Video Checklist

For the required 3 to 5 minute walkthrough, include:

- authentication flow
- session restore
- course browsing
- search
- bookmarking
- course details
- WebView content
- notification behavior
- offline handling

## Technical Constraint Status

- Must use Expo SDK: satisfied
- Must use TypeScript: satisfied
- Strict mode enabled: satisfied
- Must use Expo Router: satisfied
- Must use NativeWind: satisfied
- Must support portrait and landscape: satisfied

## Submission Checklist

- Complete source code
- Updated README
- Demo video
- APK or release build
- Screenshots added
- GitHub repository prepared
