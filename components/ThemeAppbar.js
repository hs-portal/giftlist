import React, { useState, useEffect } from "react";
import { Appbar, Menu, IconButton, useTheme } from "react-native-paper";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import navigateWithBackParam from "../utils/navigateWithBackParam";

const ThemeAppbar = ({
  hasBack = false,
  hasDefaultAction = false,
  title = "",
  customAction = null,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { prevScreen } = useLocalSearchParams();
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const menuHandler = (route) => {
    closeMenu();
    navigateWithBackParam({ router, navigation, route });
  };

  const backHandler = (prev) => {
    navigation.navigate({ key: prev });
  };

  return (
    <>
      <Appbar.Header elevated style={{ backgroundColor: theme.colors.primary }}>
        {hasBack && (
          <Appbar.BackAction
            color="#fff"
            onPress={() => {
              backHandler(prevScreen);
            }}
          />
        )}
        <Appbar.Content title={title} color="#fff" />
        {customAction && customAction}
        {hasDefaultAction && (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                iconColor="#fff"
                icon="dots-vertical"
                onPress={openMenu}
              ></IconButton>
            }
          >
            <Menu.Item
              onPress={() => {
                menuHandler("/root/(menu)/editProfile");
              }}
              title="Profile"
            />
            <Menu.Item
              onPress={() => {
                menuHandler("/root/(menu)/aboutApp");
              }}
              title="App Info"
            />
          </Menu>
        )}
      </Appbar.Header>
    </>
  );
};

export default ThemeAppbar;
