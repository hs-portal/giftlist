import { Stack } from "expo-router";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { AuthProvider } from "../providers/AuthProvider";
import { lightTheme, darkTheme } from "../theme";

const theme = {
  ...DefaultTheme,
  //version: 2,
  colors: {
    ...lightTheme.colors,
  },
};

export default function Layout() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="root"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </PaperProvider>
    </AuthProvider>
  );
}
