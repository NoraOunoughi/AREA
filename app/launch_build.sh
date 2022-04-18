#!/bin/sh

# echo key.properties >> /client_mobile/android/local.properties

echo "Launch Build Flutter"
echo '"flutter build apk" in client_mobile...'
flutter build apk --release --target-platform android-x64 --split-per-abi
echo 'Copy app-x86_64-release.apk into shared volume /apk_volume/app-release.apk'
cp /client_mobile/build/app/outputs/apk/release/*.apk /apk_volume/app-release.apk