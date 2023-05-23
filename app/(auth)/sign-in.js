import React, { useState, useEffect } from "react";
import { ScrollView, View, Alert } from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import {
  Text,
  TextInput,
  Button,
  Stack,
  HStack,
} from "@react-native-material/core";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import Icon from "@expo/vector-icons/MaterialCommunityIcons";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const router = useRouter();
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
    <>
      <ScrollView style={{ paddingTop: 50, height: "100%", paddingBottom: 24 }}>
        <Stack spacing={16} center style={{ height: "100%", padding: 24 }}>
          <Text>Signup or Signin:</Text>
          <View style={{ width: "100%" }}>
            <TextInput
              variant="outlined"
              onChangeText={(v) => setEmail(v)}
              value={email}
              label="email"
              autoCapitalize="none"
            />
          </View>
          <View style={{ width: "100%" }}>
            <TextInput
              variant="outlined"
              onChangeText={(v) => setPassword(v)}
              value={password}
              label="password"
              secureTextEntry
            />
          </View>
          <HStack spacing={16}>
            <Button
              title="Sign In"
              tintColor="white"
              style={{ alignSelf: "center" }}
              leading={(props) => <Icon name="login" {...props} />}
              onPress={() => onPressSignIn()}
            />
            <Button
              onPress={() => onPressSignUp()}
              title="Sign Up"
              tintColor="white"
              color="secondary"
              style={{ alignSelf: "center" }}
              leading={(props) => (
                <Icon name="account-plus-outline" {...props} />
              )}
            />
          </HStack>
          {/*
          <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => signInWithGoogle()}
            disabled={signinInProgress}
              />*/}
          <Button
            title="Sign in with Google"
            disabled={!request}
            onPress={() => {
              promptAsync({});
            }}
          />
        </Stack>
      </ScrollView>
    </>
  );
}
