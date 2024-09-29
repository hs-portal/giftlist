import React, { useState, useEffect } from "react";
import Realm from "realm";
import { StyleSheet, ScrollView, View, Alert } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@realm/react";

import { useRouter } from "expo-router";

import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const app = useApp();
  const router = useRouter();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "634509221384-8ebojs8orh0lou3ogclhm4947k8ca4n5.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({
      scheme: "com.hsportal.giftlist",
    }),
  });

  // Handle Google Sign In Response
  useEffect(() => {
    if (response?.type === "success") {
      // console.log("idtoken:", response.authentication.idToken);
      let accessToken = response.authentication.accessToken;
      let idToken = response.authentication.idToken;
      getUserInfo(accessToken, idToken);
    }
  }, [response]);

  const getUserInfo = async (accessToken, idToken) => {
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const googleUser = await response.json();
      // do something with userdata, ie: setUserInfo(googleUser);
      const credential = Realm.Credentials.jwt(idToken);
      const user = await app.logIn(credential);
      console.log("signed in as Realm user", user.id);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const signIn = async (email, password) => {
    const creds = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(creds);
  };

  const onPressSignIn = async () => {
    console.log("Trying sign in with user: " + email);
    try {
      await signIn(email, password);
    } catch (error) {
      const errorMessage = `Failed to sign in: ${error.message}`;
      console.error(errorMessage);
      //Alert.alert(errorMessage);
    }
  };

  const signUp = async (email, password) => {
    await app.emailPasswordAuth.registerUser({ email, password });
  };

  const onPressSignUp = async () => {
    console.log("Trying signup with user: " + email);
    try {
      await signUp(email, password);
      signIn(email, password);
    } catch (error) {
      const errorMessage = `Failed to sign up: ${error.message}`;
      console.error(errorMessage);
      //Alert.alert(errorMessage);
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
          <Button mode="contained" style={{ alignSelf: "center" }} icon="login" onPress={() => onPressSignIn()}>
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
