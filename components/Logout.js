import * as React from "react";
import { Button, Alert } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "expo-router";

export function Logout({ closeRealm }) {
  const router = useRouter();

  const { signOut } = useAuth();

  return (
    <Button
      title="Log Out"
      onPress={() => {
        Alert.alert("Log Out", null, [
          {
            text: "Yes, Log Out",
            style: "destructive",
            onPress: () => {
              router.push("/");
              closeRealm();
              signOut();
            },
          },
          { text: "Cancel", style: "cancel" },
        ]);
      }}
    />
  );
}
