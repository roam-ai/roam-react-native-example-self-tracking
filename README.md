# Roam React Native Example: Self-Tracking

This project demonstrates how to implement self-tracking functionality using the Roam SDK in a React Native application. It serves as a reference for developers looking to integrate location tracking features into their own applications.

## Features

- Request and check location permissions
- Start and stop location tracking
- Display real-time location updates
- Show tracking status
- Implement foreground service for continuous tracking on Android

## Prerequisites

- Node.js (v12 or newer)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- A Roam SDK API key (sign up at [Roam's website](https://roam.ai/))

## Getting Started

## Step 1: Clone the repository:

```bash
git clone https://github.com/your-username/roam-react-native-example-self-tracking.git
cd roam-react-native-example-self-tracking
```

## Step 2: Install dependencies:

```bash
# using npm
npm install
# OR using Yarn
yarn install
```

## Step 3: Set up the Roam SDK key:
- Open `android/app/src/main/java/com/roamreactnativeexampleselftracking/MainApplication.java`
- Replace `YOUR_ROAM_SDK_KEY` with your actual Roam SDK key:
  ```java
  Roam.initialize(this, "YOUR_ROAM_SDK_KEY");
  ```

## Step 4: Run the project:
- For Android:
  ```
  npx react-native run-android
  ```
- For iOS (work in progress):
  ```
  npx react-native run-ios
  ```

## Congratulations! :tada:

You've successfully run the Roam Location SDK with Self Tracking. :partying_face:

>**Note**: iOS implementation is still a work in progress and may not function correctly at this time.

## How the App Works

1. **Permission Handling**: The app first checks and requests necessary location permissions.

2. **Start Tracking**: When the user presses "Start Tracking", the app:
- Enables foreground notification (on Android)
- Starts location tracking using Roam SDK
- Begins listening for location updates

3. **Location Display**: As location updates are received, the app displays:
- Latitude and Longitude
- Accuracy
- Altitude
- Speed
- Activity type
- Timestamp
- Timezone

4. **Stop Tracking**: When the user presses "Stop Tracking", the app:
- Stops location tracking
- Disables foreground notification (on Android)
- Clears the displayed location data

## Implementing in Your Own App

To implement self-tracking in your own app using this example:

1. Set up the Roam SDK in your project.
2. Copy the permission handling logic.
3. Implement the start and stop tracking functions.
4. Set up a listener for location updates.
5. Display or process the received location data as needed.
6. Add LocationService.java. Refer the file `android/app/src/main/java/com/roamreactnativeexampleselftracking/LocationService.java`
7. Update AndroidManifest.xml with the above service.

Remember to handle edge cases, such as permission denials and location services being disabled.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.