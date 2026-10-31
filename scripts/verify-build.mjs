workflows:
  survey-helper-pro-ios:
    name: Survey Helper Pro iOS unsigned build
    instance_type: mac_mini_m1
    max_build_duration: 60
    environment:
      xcode: latest
      node: 22
      vars:
        APP_NAME: "Survey Helper Pro"
    scripts:
      - name: Install dependencies
        script: |
          npm ci
      - name: Run test suite
        script: |
          npm test
      - name: Build web assets and copy proj4
        script: |
          npm run build
      - name: Add Capacitor iOS app if missing
        script: |
          if [ ! -d ios/App ]; then
            npx cap add ios
          fi
      - name: Sync Capacitor iOS project
        script: |
          npx cap sync ios
      - name: Build iOS project (unsigned)
        script: |
          CODE_SIGNING_ALLOWED=NO xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Debug -sdk iphoneos -destination 'generic/platform=iOS' build
    artifacts:
      - build/**/*.app
      - ios/App/build/**/*.xcarchive
