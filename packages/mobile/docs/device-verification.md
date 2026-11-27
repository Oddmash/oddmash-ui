# Device verification

Record the candidate commit, OS build, browser version, screen reader and version when available, and whether each result used hardware or an emulator. For each scenario record pass, fail, blocked or not run, with the observed announcement or visible outcome. Run the same task once without the screen reader and once with it active.

| Environment | Scope |
| --- | --- |
| Physical iPhone or iPad with Safari and VoiceOver | Required for iOS VoiceOver. Apple documents that VoiceOver is unavailable in iOS Simulator. Repeat applicable flows from an installed Home Screen app. |
| iOS Simulator with Safari | Optional geometry, touch, rotation and software keyboard checks. Record this result separately. |
| Android emulator with a Google Play system image, Chrome and TalkBack | Use Android Accessibility Suite and verify the task through TalkBack actions. Record the emulator result separately from hardware. |
| Physical Android device with Chrome and TalkBack | Check device-level gestures, keyboard, touch and announcements on hardware. |

[Apple accessibility testing](https://developer.apple.com/documentation/accessibility/performing-accessibility-testing-for-your-app) · [Android TalkBack testing](https://developer.android.com/codelabs/basic-android-kotlin-compose-test-accessibility)

## Tasks

Use the [public component demos](https://oddmash.github.io/oddmash-mobile/#components) and an app that installs the exact candidate tarball.

1. **Bottom Sheet.** Open Filters using assistive activation. Confirm that the modal name, text field, resize and dismiss controls are announced. Open the software keyboard, change the detent, and apply. Verify trigger focus returns and background scroll is unchanged.
2. **Adaptive Dialog.** Edit a name, open the software keyboard, then rotate or resize across the layout breakpoint. Verify the draft and current focus remain, then confirm the completion button is reachable.
3. **Swipe Action.** Find and activate Show actions without a gesture. Archive using the exposed action. Verify that after the app removes the row, the confirmation or next row is discoverable and the next focus move stays in context.
4. **Pull to Refresh.** Activate Refresh and check completion feedback. In a consumer with a deliberately slow request, check the pending announcement and a failed request followed by a successful retry. Check that a second touch cancels the pull without starting a refresh.
5. **Action Sheet.** Open Report actions and verify that Cancel is the first focused control, unavailable choices cannot be activated, and a canceled action returns focus to the trigger. Repeat at larger text and in landscape.
6. **Bottom Navigation.** Navigate to another destination, check announcement of the current page, then use Back. Check access near the home indicator and with enlarged labels.

On supported hardware, also check pinch starts on gesture surfaces and OS back or browser refresh gestures near screen edges. Record conflicts separately from page behavior.

## Current evidence

The Chromium, Firefox and WebKit browser checks are recorded in [verification](alpha-verification.md).

The Android WebView smoke test used an emulated Pixel 8, Android 16 API 36 (`BE2A.250530.026.D1`), WebView `133.0.6943.137` and TalkBack `16.0.0.738667889`. It used emulated touch exploration, swipes and double-taps. The TalkBack speech display confirmed the output below. The runtime revision for the refresh retest was `b65c078`.

| Scenario | Observed in Android WebView |
| --- | --- |
| Filter sheet | Reached Close dialog, Resize sheet and Search. Opened the software keyboard and applied the filters. Focus returned to Open filters. |
| Adaptive dialog | Kept the edited input and its focus when the emulator rotated from a narrow sheet to a centered dialog with the keyboard open. |
| Swipe Action | Opened and activated Archive. In a React 18 consumer of the package, TalkBack read Message archived after the row disappeared. A right swipe moved to Next message. |
| Refresh | Originally moved accessibility focus to the document while pending. After the fix, focus stayed on Refresh through a successful request and TalkBack displayed Refreshing and Refreshed. |
| Action sheet | Focus started on Cancel. Activating the unavailable Share report choice left the sheet open with no action result. |
| Bottom navigation | Activated Projects and TalkBack identified it as the current page. |

Android Chrome, physical Android and iOS devices, iOS VoiceOver, and the remaining variants in the task matrix still need evidence. Track these checks and npm readiness in [issue #7](https://github.com/Oddmash/oddmash-mobile/issues/7).
