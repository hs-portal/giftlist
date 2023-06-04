import React, { useState } from "react";
import { Button, useTheme, Dialog, Portal, Text } from "react-native-paper";

import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "expo-router";

export default function Logout({ closeRealm }) {
  const router = useRouter();
  const theme = useTheme();

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const { signOut } = useAuth();

  const handleLogout = () => {
    hideDialog();
    router.push("/");
    closeRealm();
    signOut();
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
