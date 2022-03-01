import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'capacitor-configure-test',
  webDir: 'build',
  bundledWebRuntime: false,
  ios: {
    path: 'ios'
  },
  android: {
    path: 'android'
  }
};

export default config;
