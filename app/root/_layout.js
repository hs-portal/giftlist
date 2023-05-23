import { Tabs } from "expo-router";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { UserDataProvider } from "../../providers/UserDataProvider";
export default () => {
  return (
    <UserDataProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home View",
            tabBarIcon: ({ color }) => (
              <Icon name="home-account" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabscreen)"
          options={{
            title: "View 2",
            tabBarIcon: ({ color }) => (
              <Icon name="page-next-outline" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </UserDataProvider>
  );
};
