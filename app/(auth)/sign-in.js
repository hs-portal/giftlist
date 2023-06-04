import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Alert } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../../providers/AuthProvider";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const router = useRouter();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, signUp, signIn, request, promptAsync } = useAuth();

  useEffect(() => {
    // If there is a user logged in, go to the root directory.
    if (user != null) {
      console.log(user);
      router.replace("/");
    }
  }, [user]);

  // The onPressSignIn method calls AuthProvider.signIn with the
  // email/password in state.
  const onPressSignIn = async () => {
    console.log("Trying sign in with user: " + email);
    try {
      await signIn(email, password);
    } catch (error) {
      const errorMessage = `Failed to sign in: ${error.message}`;
      console.error(errorMessage);
      Alert.alert(errorMessage);
    }
  };

  // The onPressSignUp method calls AuthProvider.signUp with the
  // email/password in state and then signs in.
  const onPressSignUp = async () => {
    console.log("Trying signup with user: " + email);
    try {
      await signUp(email, password);
      signIn(email, password);
    } catch (error) {
      const errorMessage = `Failed to sign up: ${error.message}`;
      console.error(errorMessage);
      Alert.alert(errorMessage);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView center style={styles.containerInner}>
        <Text>Signup or Signin:</Text>
        <View style={{ width: "100%" }}>
          <TextInput
            variant="flat"
            onChangeText={(v) => setEmail(v)}
            value={email}
            label="Email"
            autoCapitalize="none"
          />
        </View>
        <View style={{ width: "100%" }}>
          <TextInput
            variant="flat"
            onChangeText={(v) => setPassword(v)}
            value={password}
            label="Password"
            secureTextEntry
          />
        </View>
        <View style={styles.signinButtons}>
          <Button
            mode="contained"
            style={{ alignSelf: "center" }}
            icon="login"
            onPress={() => onPressSignIn()}
          >
            Sign In
          </Button>
          <Button
            onPress={() => onPressSignUp()}
            mode="outlined"
            style={{ alignSelf: "center" }}
            icon="account-plus-outline"
          >
            Sign Up
          </Button>
        </View>

        <Button
          mode="contained"
          icon="google"
          buttonColor={theme.colors.secondary}
          disabled={!request}
          onPress={() => {
            promptAsync({});
          }}
        >
          Sign in with Google
        </Button>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    height: "100%",
    paddingBottom: 16,
  },
  containerInner: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  signinButtons: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
});
