import { StyleSheet, View } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";

export function BarcodeScanner() {
  const device = useCameraDevice("back");

  return (
    <View style={styles.container}>
      <Camera device={device} isActive />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
