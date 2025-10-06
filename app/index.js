/**
 * @format
 */
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Mensagem em segundo plano:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
