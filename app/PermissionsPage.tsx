import React from "react";
import { Button, View } from "react-native";

interface IProps {
  requestPermission: () => Promise<boolean>;
}

export function PermissionsPage({ requestPermission }: IProps) {
  return (
    <View>
      <Button title="Grant Camera Permission" onPress={requestPermission} />
    </View>
  );
}
