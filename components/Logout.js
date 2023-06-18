import React, { useState } from "react";
import { Button, useTheme, Dialog, Portal, Text } from "react-native-paper";

import { useRouter } from "expo-router";
import { useUser } from "@realm/react";
import { useData } from "../providers/DataProvider";

export default function Logout() {
  const user = useUser();
  const router = useRouter();
  const theme = useTheme();
  const { realm } = useData();

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const handleLogout = () => {
    hideDialog();
    router.push("/");
    realm.close();
    if (user == null) {
      console.warn("Not logged in, can't log out!");
    } else {
      user.logOut();
    }
  };

  return (
    <>
      <Button
        mode="contained"
        icon="logout"
        buttonColor={theme.colors.tertiary}
        onPress={showDialog}
      >
        Log Out
      </Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Log Out</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you wish to log out? This will return you to the sign
              in screen.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={() => handleLogout()}>Log Out</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
