import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { useUserData } from "../../../providers/UserDataProvider";

import ThemeAppbar from "../../../components/ThemeAppbar";
import Logout from "../../../components/Logout";

export default function Browse() {
  const router = useRouter();
  const { closeRealm } = useUserData();

  const [fName, seFName] = useState("");
  const [lName, setLName] = useState("");

  return (
    <>
      <ThemeAppbar hasBack title="Profile" />
      <SafeAreaView style={styles.container}>
        <View style={{ width: "100%" }}>
          <TextInput
            variant="flat"
            onChangeText={(v) => seFName(v)}
            value={fName}
            label="First Name"
          />
        </View>
        <View style={{ width: "100%" }}>
          <TextInput
            variant="flat"
            onChangeText={(v) => setLName(v)}
            value={lName}
            label="Last Name"
          />
        </View>
        <Button
          mode="contained"
          icon="content-save-check-outline"
          onPress={() => {
            console.log("Save");
          }}
        >
          Save
        </Button>
        <Logout closeRealm={closeRealm} />
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
    //justifyContent: "center",
    gap: 16,
  },
});
