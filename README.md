# Capacitor Configure

A utility for automatically configuring native [Capacitor](https://capacitorjs.com/) projects in a predictable and safe way.

## Installation

```bash
npm install @capacitor/configure
```

Add to your npm scripts:

## Usage

```bash
npx cap-config run config.yaml
```

## Writing Configuration Files

Configuration files are written in YAML. New to YAML? Read [Learn YAML in five minutes](https://www.codeproject.com/Articles/1214409/Learn-YAML-in-five-minutes).

```yaml
vars:
  BUNDLE_ID:
    default: io.ionic.wowzaStarter
  PACKAGE_NAME:
    default: io.ionic.wowzaStarter
  INTUNE_CLIENT_ID:
  INTUNE_ADAL_AUTHORITY:
  INTUNE_REDIRECT_URI_IOS:
  INTUNE_SIGNATURE_HASH:

platforms:
  ios:
    bundleId: $BUNDLE_ID

    plist:
      - file: Info.plist
        entries:
          NSFaceIDUsageDescription: Use Face ID to authenticate yourself and login

      - file: Info.plist
        entries:
          CFBundleURLTypes:
            - CFBundleURLSchemes:
                - msauth.$(PRODUCT_BUNDLE_IDENTIFIER)
                - msauth.$(PRODUCT_BUNDLE_IDENTIFIER)-intunemam
                - msauth.com.microsoft.intunemam

      - file: Info.plist
        entries:
          LSApplicationQueriesSchemes:
            - mvisionmobile
            - msauthv2
            - scmx
            - lookoutwork-ase
            - msauthv3
            - lacoonsecurity
            - zips
            - skycure
            - smart-ns
            - smsec
            - betteractiveshield
            - companyportal
            - wandera
            - https-intunemam
            - http-intunemam
            - microsoft-edge-https-intunemam
            - microsoft-edge-http-intunemam
            - ms-outlook-intunemam

      - file: Info.plist
        entries:
          IntuneMAMSettings:
            ADALClientId: $INTUNE_CLIENT_ID
            ADALAuthority: $INTUNE_ADAL_AUTHORITY
            ADALRedirectUri: $INTUNE_REDIRECT_URI_IOS

    entitlements:
      - keychain-access-groups:
          ['$BUNDLE_ID', 'com.microsoft.intune.mam', 'com.microsoft.adalcache']
    frameworks:
      - AudioToolbox.framework
      - CoreServices.framework
      - ImageIO.framework
      - libc++.tbd
      - libqslite3.tbd
      - LocalAuthentication.framework
      - MessageUI.framework
      - QuartzCore.framework
      - Security.framework
      - SystemConfiguration.framework
      - WebKit.framework

  android:
    packageName: $PACKAGE_NAME

    manifest:
      - file: AndroidManifest.xml
        target: manifest/application
        attrs:
          android:name: com.ionicframework.intune.IntuneApplication

      - file: AndroidManifest.xml
        target: manifest
        append: |
          <queries>
              <package android:name="com.azure.authenticator" />
              <package android:name="$PACKAGE_NAME" />
              <package android:name="com.microsoft.windowsintune.companyportal" />
              <!-- Required for API Level 30 to make sure the app detect browsers
                  (that don't support custom tabs) -->
              <intent>
                  <action android:name="android.intent.action.VIEW" />
                  <category android:name="android.intent.category.BROWSABLE" />
                  <data android:scheme="https" />
              </intent>
              <!-- Required for API Level 30 to make sure the app can detect browsers that support custom tabs -->
              <!-- https://developers.google.com/web/updates/2020/07/custom-tabs-android-11#detecting_browsers_that_support_custom_tabs -->
              <intent>
                  <action android:name="android.support.customtabs.action.CustomTabsService" />
              </intent>
          </queries>

      - file: AndroidManifest.xml
        target: manifest/application
        append: |
          <activity android:name="com.microsoft.identity.client.BrowserTabActivity">
              <intent-filter>
                  <action android:name="android.intent.action.VIEW" />

                  <category android:name="android.intent.category.DEFAULT" />
                  <category android:name="android.intent.category.BROWSABLE" />

                  <!--
                      Add in your scheme/host from registered redirect URI
                      note that the leading "/" is required for android:path
                  -->
                  <data
                      android:host="$PACKAGE_NAME"
                      android:path="/$INTUNE_SIGNATURE_HASH"
                      android:scheme="msauth" />
              </intent-filter>
          </activity>

    build.gradle:
      buildscript:
        dependencies:
          - classpath: 'org.javassist:javassist:3.27.0-GA'
          - classpath: files("./app/src/main/libs/com.microsoft.intune.mam.build.jar")

    app.build.gradle:
      dependencies:
        - implementation: files("./src/main/libs/Microsoft.Intune.MAM.SDK.aar")
        - implementation: 'com.microsoft.identity.client:msal:1.5.5'

      apply plugin: 'com.microsoft.intune.mam'
      intunemam:
        includeExternalLibraries:
          - 'androidx.*'
          - 'com.getcapacitor.*'

    res:
      - path: raw
        file: auth_config.json
        text: |
          {
            "client_id": "f80e2e59-01b2-4f88-be80-4895a63eae7e",
            "authorization_user_agent": "DEFAULT",
            "redirect_uri": "msauth://$PACKAGE_NAME/uHU%2BUi09K1zPjWX4mZFggrgz%2Brk%3D",
            "broker_redirect_uri_registered": true,
            "authorities": [
              {
                "type": "AAD",
                "audience": {
                  "type": "AzureADMyOrg",
                  "tenant_id": "453daf0a-cd18-4085-bfd7-fb9431630f11"
                }
              }
            ]
          }

      - path: drawable
        file: logo.png
        source: logo.png
```

## Supported Operations

| Platform | Operation                  | Supported          |
| -------- | -------------------------- | ------------------ |
| ios      | Bundle ID                  | :white_check_mark: |
| ios      | Info.plist                 | :white_check_mark: |
| ios      | Add Frameworks             | :white_check_mark: |
| ios      | Set Entitlements           | :white_check_mark: |
| android  | Package ID                 | :white_check_mark: |
| android  | Gradle Config              | :white_check_mark: |
| android  | Resource Files             | :white_check_mark: |
| android  | Manifest File Modification | :white_check_mark: |
