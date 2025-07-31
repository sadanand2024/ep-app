import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

Reactotron
  .setAsyncStorageHandler(AsyncStorage)
  .configure()
  .useReactNative()
  .connect();

Reactotron.onCustomCommand({
  command: 'test',
  handler: () => console.tron.log('Custom Command Triggered')
});

console.tron = Reactotron;

console.tron.log('Reactotron Connected');