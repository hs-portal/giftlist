import { Stack } from "expo-router";
import { AppWrapper } from "../providers/AppWrapper";

export default function Layout() {
  return (
    <AppWrapper>
      <Stack>
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
    </AppWrapper>
  );
}
