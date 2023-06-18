import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { useUser } from "@realm/react";
import { useData } from "../../../providers/DataProvider";

import ThemeAppbar from "../../../components/ThemeAppbar";
import Logout from "../../../components/Logout";

export default function Browse() {
  const router = useRouter();
  const user = useUser();

  const { updateProfileData } = useData();

  let profileData = user.customData;

  const [currentProfileData, setCurrentProfileData] = useState({});
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");

  useEffect(() => {
    if (profileData !== currentProfileData) {
      setCurrentProfileData(profileData);
      setFName(profileData.firstName);
      setLName(profileData.lastName);
    }
  }, [user]);

  const handleProfileUpdate = (oldData, firstName, lastName) => {
    updateProfileData(
      oldData._id,
      firstName,
      lastName,
      oldData.contacts,
      oldData.avatarColor
    );
  };

  return (
    <>
      <ThemeAppbar hasBack title="Profile" />
      <SafeAreaView style={styles.container}>
        <View style={{ width: "100%" }}>
          <TextInput
            variant="flat"
            onChangeText={(v) => setFName(v)}
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
            handleProfileUpdate(currentProfileData, fName, lName);
          }}
        >
          Save
        </Button>
        <Logout />
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
