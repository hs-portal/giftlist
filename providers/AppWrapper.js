import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { MD3LightTheme as DefaultTheme, PaperProvider } from "react-native-paper";
import SignIn from "../components/SignIn";
import { ActivityIndicator } from "react-native-paper";
import { DataProvider } from "./DataProvider";
import { lightTheme, darkTheme } from "../theme";

const theme = {
  ...DefaultTheme,
  //version: 2,
  colors: {
    ...lightTheme.colors,
  },
};

const AppWrapper = ({ children }) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
      <View style={styles.activityContainer}>
        <ActivityIndicator animating={true} />
      </View>
    );
  }

  if (!user) {
    return (
      <View>
        <Text>Login</Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <DataProvider user={user}>{children}</DataProvider>
    </PaperProvider>
  );
};

export { AppWrapper };

const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
