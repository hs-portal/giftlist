import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  TextInput,
  Text,
  Button,
  IconButton,
  Surface,
  Avatar,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

import { useRouter } from "expo-router";
import { useUser } from "@realm/react";
import { useData } from "../../../providers/DataProvider";

import ThemeAppbar from "../../../components/ThemeAppbar";
import Logout from "../../../components/Logout";

export default function Browse() {
  const router = useRouter();
  const user = useUser();

  const { updateProfileData, setSnackMessage } = useData();

  let profileData = user.customData;

  const [currentProfileData, setCurrentProfileData] = useState({});
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [avatarColor, setAvatarColor] = useState("");

  useEffect(() => {
    if (profileData !== currentProfileData) {
      setCurrentProfileData(profileData);
      setFName(profileData.firstName);
      setLName(profileData.lastName);
      setAvatarColor(profileData.avatarColor);
    }
  }, [user]);

  let avatarColors = [
    "#c41915",
    "#fd8a26",
    "#9aca28",
    "#ca7620",
    "#87b043",
    "#13874b",
    "#1897a6",
    "#70b3b8",
    "#3cb6e3",
    "#1a57b6",
    "#8266c9",
    "#a969ca",
    "#fc464b",
    "#c35e7e",
    "#a37c82",
    "#a29497",
    "#eacd33",
  ];

  const handleColorSelect = (color) => {
    setAvatarColor(color);
    handleProfileUpdate(currentProfileData, fName, lName, color);
  };

  const handleProfileUpdate = (oldData, firstName, lastName, color) => {
    updateProfileData(
      oldData._id,
      firstName,
      lastName,
      oldData.contacts,
      color
    );
    setSnackMessage("Profile updated");
  };

  const AvatarBadge = () => {
    var firstInitial = Array.from(fName)[0];
    var lastInitial = Array.from(lName)[0];
    return (
      <Avatar.Text
        style={{ backgroundColor: avatarColor || "#c41915" }}
        size={96}
        label={`${firstInitial}${lastInitial}`}
      />
    );
  };

  return (
    <>
      <ThemeAppbar
        hasBack
        backParams={{ alert: "Hey there" }}
        title="Profile"
        customAction={<Logout />}
      />
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <AvatarBadge />
          <View style={{ width: "100%" }}>
            <TextInput
              variant="flat"
              onChangeText={(v) => setFName(v)}
              value={fName}
              label="First Name"
              onBlur={() => {
                handleProfileUpdate(
                  currentProfileData,
                  fName,
                  lName,
                  avatarColor
                );
              }}
            />
          </View>
          <View style={{ width: "100%" }}>
            <TextInput
              variant="flat"
              onChangeText={(v) => setLName(v)}
              value={lName}
              label="Last Name"
              onBlur={() => {
                handleProfileUpdate(
                  currentProfileData,
                  fName,
                  lName,
                  avatarColor
                );
              }}
            />
          </View>
          <Text variant="titleMedium">Avatar Color</Text>
          <Surface style={styles.surface} elevation={1}>
            {avatarColors.map((color, i) => {
              return (
                <IconButton
                  key={`avatarColor-${i}`}
                  mode="contained"
                  icon="check-circle-outline"
                  containerColor={color}
                  iconColor={avatarColor === color ? "white" : color}
                  selected={avatarColor === color}
                  size={32}
                  onPress={() => handleColorSelect(color)}
                />
              );
            })}
          </Surface>
        </SafeAreaView>
      </ScrollView>
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
  surface: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
