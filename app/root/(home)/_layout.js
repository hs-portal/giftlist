import { Stack } from "expo-router";

export default () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="viewWishlist"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="createWishlist"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};
