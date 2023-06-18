import { Tabs } from "expo-router";
import {
  BottomNavigation,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default () => {
  const router = useRouter();
  const theme = useTheme();
  return (
    <Tabs
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={({ navigation, state, descriptors, insets }) => {
        var newState = { ...state };
        var modifiedRouteNames = [...newState.routeNames];
        var modifiedRoutes = [...newState.routes];

        var menuIndex = modifiedRouteNames.indexOf("(menu)");
        modifiedRouteNames.splice(menuIndex, 1);
        modifiedRoutes.splice(menuIndex, 1);

        newState.routeNames = modifiedRouteNames;
        newState.routes = modifiedRoutes;

        return (
          <BottomNavigation.Bar
            compact={true}
            navigationState={newState}
            safeAreaInsets={insets}
            theme={{
              colors: { secondaryContainer: theme.colors.primary },
            }}
            renderTouchable={(props) => (
              <TouchableRipple
                {...props}
                borderless
                background="rgba(0, 0, 0)"
              />
            )}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                router.push(`root/${route.name}`);
              }
            }}
            renderIcon={({ route, focused, color }) => {
              const { options } = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({
                  focused,
                  color: focused
                    ? theme.colors.secondaryContainer
                    : theme.colors.primary,
                  size: 24,
                });
              }

              return null;
            }}
            getLabelText={({ route }) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.title;

              return label;
            }}
            getColor={({ route }) => {
              return "#000";
            }}
          />
        );
      }}
    >
      <Tabs.Screen
        name="(browse)"
        options={{
          title: "Browse",
          tabBarIcon: ({ color }) => (
            <Icon name="format-list-checks" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon name="home-account" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(contacts)"
        options={{
          title: "Contacts",
          tabBarIcon: ({ color }) => (
            <Icon name="account-group" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(menu)"
        options={{
          title: "Menu",
          href: null,
          tabBarVisible: false,
          tabBarIcon: ({ color }) => (
            <Icon name="account-group" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};
