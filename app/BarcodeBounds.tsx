import { View, StyleSheet } from "react-native";
import { BarcodeBoundsType } from "./types";

interface IProps {
	barcodeBounds: BarcodeBoundsType | null;
}

export function BarcodeBounds({ barcodeBounds }: IProps) {
	if (!barcodeBounds) return null;

	return <View style={[styles.barcodeBounds, barcodeBounds]} />;
}

const styles = StyleSheet.create({
	barcodeBounds: {
		borderWidth: 2,
		borderColor: "green"
	}
});
