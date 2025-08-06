#!/bin/bash

echo "🚀 Building TaraFlow Release APK..."

# Step 1: Clean previous builds
echo "📦 Cleaning previous builds..."
cd android
./gradlew clean
cd ..

# Step 2: Create assets directory if it doesn't exist
echo "📁 Creating assets directory..."
mkdir -p android/app/src/main/assets

# Step 3: Bundle JavaScript code
echo "📦 Bundling JavaScript code..."
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Step 4: Build release APK
echo "🔨 Building release APK..."
cd android
./gradlew assembleRelease
cd ..

# Step 5: Check if build was successful
if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    echo "✅ Build successful!"
    echo "📱 APK location: android/app/build/outputs/apk/release/app-release.apk"
    echo "📏 APK size: $(du -h android/app/build/outputs/apk/release/app-release.apk | cut -f1)"
    echo ""
    echo "🎉 Your standalone APK is ready!"
    echo "You can now install this APK on any Android device without needing the development server."
else
    echo "❌ Build failed!"
    echo "Please check the error messages above."
fi 