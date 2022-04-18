FROM openjdk:8-jdk

LABEL maintainer="gitlab:jhbez"

#./android/app/build.gradle
ENV ANDROID_COMPILE_SDK "29" 
# ~/Android/Sdk/build-tools/
ENV ANDROID_BUILD_TOOLS "31.0.0"
# Last number android studio
ENV ANDROID_SDK_TOOLS   "4333796" 
ENV ANDROID_CMD_TOOLS   "8092744"

ENV FLUTTER_VERSION  "2.10.1"

RUN apt-get --quiet update --yes
RUN apt-get --quiet install --yes wget tar unzip lib32stdc++6 lib32z1

RUN  wget --quiet --output-document=android-sdk.zip https://dl.google.com/android/repository/sdk-tools-linux-${ANDROID_SDK_TOOLS}.zip && \
unzip -d android-sdk-linux android-sdk.zip && \
rm -rf android-sdk.zip

# RUN wget https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_CMD_TOOLS}_latest.zip && \
# unzip -d android-sdk-linux/cmdline-tools commandlinetools-linux-8092744_latest.zip && \
# rm -rf commandlinetools-linux-8092744_latest.zip

RUN  mkdir ~/.android && touch ~/.android/repositories.cfg
RUN echo y | android-sdk-linux/tools/bin/sdkmanager "platforms;android-${ANDROID_COMPILE_SDK}" >/dev/null
RUN echo y | android-sdk-linux/tools/bin/sdkmanager "platform-tools" >/dev/null
RUN echo y | android-sdk-linux/tools/bin/sdkmanager "build-tools;${ANDROID_BUILD_TOOLS}" >/dev/null
# ENV REPO_OS_OVERRIDE "linux"
RUN echo y | android-sdk-linux/tools/bin/sdkmanager --install "cmdline-tools;latest" >/dev/null
RUN echo y | android-sdk-linux/tools/bin/sdkmanager --update >/dev/null

ENV ANDROID_HOME $PWD/android-sdk-linux
ENV PATH $PATH:$PWD/android-sdk-linux/platform-tools/

#temporarily disable checking for EPIPE error and use yes to accept all licenses
#RUN set +o pipefail
RUN yes | android-sdk-linux/tools/bin/sdkmanager --licenses
#RUN set -o pipefail

# flutter sdk setup  
RUN wget --output-document=flutter-sdk.tar.xz "https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_${FLUTTER_VERSION}-stable.tar.xz" && \
  tar xf flutter-sdk.tar.xz && \
  rm -rf flutter-sdk.tar.xz
ENV PATH $PATH:$PWD/flutter/bin

# RUN touch android/local.properties
# RUN echo flutter.sdk=$PWD/flutter > android/local.properties
RUN flutter upgrade
RUN yes | flutter doctor --android-licenses
RUN flutter doctor

WORKDIR /client_mobile
COPY ./ ./

RUN chmod +x launch_build.sh
CMD ["./launch_build.sh"]