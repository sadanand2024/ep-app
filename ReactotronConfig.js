import Reactotron from "reactotron-react-native";

Reactotron.configure({
  name: "TaraFirst Employee Portal",
  host: "192.168.1.10"
})
  .useReactNative()
  .connect();

console.tron = Reactotron;
