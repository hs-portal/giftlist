import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ThemeAppbar from "../../../components/ThemeAppbar";

import { useRouter } from "expo-router";
import packageJson from "../../../package.json";
export default function Browse() {
  const router = useRouter();

  return (
    <>
      <ThemeAppbar hasBack title="About App" />
      <SafeAreaView style={styles.container}>
        <Text>App Version: {packageJson.version}</Text>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
});
