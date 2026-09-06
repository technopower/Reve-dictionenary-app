# REVE AI English Learning & Dictionary App

একটি অ্যান্ড্রয়েড ও ওয়েব ভিত্তিক এআই ইংলিশ লার্নিং অ্যাপ। প্রবাসীদের সহজ ভাষায় ইংরেজি শেখা, অনুবাদ করা, সঠিক উচ্চারণ শোনা এবং স্পিকিং প্র্যাকটিসের সুবিধা রয়েছে।

## Features
- 📖 **Dictionary & Instant Translator:** ইংরেজি থেকে বাংলা বা অন্য ভাষায় দ্রুত অনুবাদ।
- 🤖 **AI Smart Explanation:** শব্দ ও বাক্যের ব্যাকরণগত ব্যাখ্যা।
- 🗣️ **AI Speaking Practice:** কথা বলে স্পিকিং স্কিল যাচাই।
- 📷 **OCR Image Translator:** ছবি বা লেখা স্ক্যান করে অনুবাদ।
- 📝 **Daily Quiz & Vocab:** বিষয়ভিত্তিক কুইজ ও শব্দভাণ্ডার প্র্যাকটিস।

## Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6)
- **OCR Engine:** Tesseract.js
- **TTS & Speech:** Web Speech API (SpeechSynthesis & SpeechRecognition)
- **Target Platform:** Web (PWA) / Android (WebView / Cordova / Capacitor)

## Required Android Permissions
অ্যান্ড্রয়েড বিল্ডের জন্য `AndroidManifest.xml`-এ এই পারমিশন যুক্ত করা আবশ্যক:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
