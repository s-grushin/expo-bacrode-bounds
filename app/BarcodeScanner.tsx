import { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import { PermissionsPage } from "./PermissionsPage";
import { BarcodeBounds } from "./types";

const SCAN_DELAY = 2000;

export function BarcodeScanner() {
  const [isTorch, setIsTorch] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [barcode, setBarcode] = useState<BarcodeBounds | null>(null);
  const [isReadyForScan, setIsReadyForScan] = useState(true);

  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    let timerId: number = 0;
    if (!isReadyForScan) {
      timerId = setTimeout(() => setIsReadyForScan(true), SCAN_DELAY);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [isReadyForScan]);

  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13"],
    onCodeScanned: (codes) => {
      if (!isReadyForScan) return;
      console.log("codes", JSON.stringify(codes, null, 2));
      setIsReadyForScan(false);
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
