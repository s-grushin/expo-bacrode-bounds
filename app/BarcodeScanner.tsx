import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { PermissionsPage } from "./PermissionsPage";
import { BarcodeBounds } from "./types";

export function BarcodeScanner() {
  const [isTorch, setIsTorch] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [barcode, setBarcode] = useState<BarcodeBounds | null>(null);

  const { hasPermission, requestPermission } = useCameraPermission();

  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13"],
    onCodeScanned: (codes) => {
      console.log("codes", JSON.stringify(codes, null, 2));
    },
  });

  const device = useCameraDevice("back");

  if (!hasPermission)
    return <PermissionsPage requestPermission={requestPermission} />;
  if (device == null) return null;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraEnabled}
        torch={isTorch ? "on" : "off"}
        codeScanner={codeScanner}
      />
      <View style={styles.actions}>
        {!hasPermission && (
          <Button title="Request Permission" onPress={requestPermission} />
        )}
        <Button title="torch" onPress={() => setIsTorch((prev) => !prev)} />
        <Button
          title="camera"
          onPress={() => setIsCameraEnabled((prev) => !prev)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
});
