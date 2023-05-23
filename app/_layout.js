import { Stack } from "expo-router";
import { Provider, defaultTheme } from "@react-native-material/core";
import { AuthProvider } from "../providers/AuthProvider";

export default function Layout() {
  return (
    <AuthProvider>
      <Provider
        theme={{
          // extend the default theme
          ...defaultTheme,
          palette: {
            ...defaultTheme.palette,
            // override the primary color
            primary: { main: "#07a7ff", on: "white" },
            secondary: { main: "#E4962D", on: "black" },
          },
        }}
      >
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
      </Provider>
    </AuthProvider>
  );
}
