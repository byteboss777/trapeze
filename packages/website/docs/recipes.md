---
title: Recipes
sidebar_label: Recipes
sidebar_position: 6
---

This page documents various common automation tasks and how to achieve them with Trapeze.

## Auto-incrementing Build Numbers

Apps often need to automatically increment build numbers, such as those using a CI/CD workflow in a service like [Appflow](https://useappflow.com/).

Assuming your CI/CD service provides an environment variable that automatically increments ([Appflow](https://useappflow.com/) does, using the `CI_BUILD_NUMBER` environment variable), then updating the build number for your app requires supplying that number when updating the iOS build number and Android version code:

```yaml title="ci.yaml"
vars:
  CI_BUILD_NUMBER:
    default: 1

platforms:
  ios:
    buildNumber: $CI_BUILD_NUMBER
  android:
    versionCode: $CI_BUILD_NUMBER
```

Run this before every build in your CI/CD workflow to have auto-incrementing build numbers.

## Build-specific configuration settings

Apps often need to distribute configuration files that contain different values for different builds or environments. For example, `google-services.json`, a common Google configuration file, will often contain different values for dev/qa/prod/etc. builds.

To do this, use an operation that updates the target configuration file and run it before performing a full build of your app.

Using the `google-services.json` example from above, we can set the `project_id` in `google-services.json` to the value in the `GOOGLE_PROJECT_ID` environment variable.

```yaml title="config.yaml"
vars:
  GOOGLE_PROJECT_ID:
    default: "default_id"

platforms:
  android:
    json:
      - file: google-services.json
        set:
          project_info:
            project_id: $GOOGLE_PROJECT_ID
  ios:
    targets:
      App:
        json:
          - file: google-services.json
            set:
              project_info:
                project_id: $GOOGLE_PROJECT_ID
```

## Plugin configuration on install

For authors of native plugins in a cross-platform framework like Capacitor or React Native, Trapeze can be used to automatically configure the developer's project when installing a plugin.

To do this, create a `yaml` file that is distributed alongside the plugin, and then run the command when the plugin is installed, or document to developers how to run the command after install.

To use a Capacitor plugin for Microsoft Intune as an example, let's say the plugin requires some additional settings for iOS and Android. Then, when the plugin is installed, the developer runs the configuration script to fully install and configure the plugin.

```yaml title="install.yaml"
platforms:
  ios:
    targets:
      App:
        buildSettings:
          ENABLE_BITCODE: false
          STRIP_SWIFT_SYMBOLS: false

        plist:
          replace: false
          entries:
            - CFBundleURLTypes:
                - CFBundleURLSchemes:
                    - msauth.$(PRODUCT_BUNDLE_IDENTIFIER)
                    - msauth.$(PRODUCT_BUNDLE_IDENTIFIER)-intunemam
                    - msauth.com.microsoft.intunemam
  android:
    manifest:
      - file: AndroidManifest.xml
        target: manifest
        inject: |
          <queries>
            <!-- ... -->
          </queries>
```

The developer then installs the plugin and runs the configuration on install:

```shell
npm install my-capacitor-plugin
npx @trapezedev/configure run node_modules/my-capacitor-plugin/install.yaml
```