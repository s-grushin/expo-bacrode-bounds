import { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from "react-native-vision-camera";
import { PermissionsPage } from "./PermissionsPage";
import { BarcodeBoundsType } from "./types";
import { BarcodeBounds } from "./BarcodeBounds";

const SCAN_DELAY = 1000;

export function BarcodeScanner() {
	const [isTorch, setIsTorch] = useState(false);
	const [isCameraEnabled, setIsCameraEnabled] = useState(false);
	const [barcodeBounds, setBarcodeBounds] = useState<BarcodeBoundsType | null>(null);
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
		onCodeScanned: codes => {
			if (!isReadyForScan) return;
			const [code] = codes;
			//console.log("codes", JSON.stringify(codes, null, 2));
			console.log("code", JSON.stringify(code, null, 2));
			const { frame } = code;
			if (!frame) return;

			const newBarcodeBounds: BarcodeBoundsType = {
				top: frame.y,
				left: frame.x - frame.width,
				width: frame.width,
				height: frame.height
			};
			setBarcodeBounds(newBarcodeBounds);
			setTimeout(() => setBarcodeBounds(null), 500);
			setIsReadyForScan(false);
		}
	});

	const device = useCameraDevice("back");

	if (!hasPermission) return <PermissionsPage requestPermission={requestPermission} />;
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
					<Button
						title="Request Permission"
						onPress={requestPermission}
					/>
				)}
				<Button
					title="torch"
					onPress={() => setIsTorch(prev => !prev)}
				/>
				<Button
					title="camera"
					onPress={() => setIsCameraEnabled(prev => !prev)}
				/>
			</View>

			<BarcodeBounds barcodeBounds={barcodeBounds} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	actions: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 10
	}
});
