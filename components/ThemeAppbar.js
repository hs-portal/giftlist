import React, { useState, useEffect } from "react";
import { View } from "react-native";

import {
  Appbar,
  Menu,
  IconButton,
  Badge,
  useTheme,
  Modal,
  Text,
  Portal,
} from "react-native-paper";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import navigateWithBackParam from "../utils/navigateWithBackParam";

const ThemeAppbar = ({
  hasBack = false,
  backParams = {},
  hasDefaultAction = false,
  title = "",
  customAction = null,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const { prevScreen } = useLocalSearchParams();
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const menuHandler = (route) => {
    closeMenu();
    navigateWithBackParam({ router, navigation, route });
  };

  const backHandler = (prev) => {
    navigation.navigate({ key: prev, ...backParams });
  };

  const openNotifications = () => setNotificationModal(true);

  const closeNotifications = () => setNotificationModal(false);

  const Notifications = () => {
    return (
      <View>
        <IconButton
          iconColor="#fff"
          icon="bell"
          size={24}
          onPress={() => openNotifications()}
        />
        <Badge
          onPress={() => openNotifications()}
          size={20}
          style={{ position: "absolute", top: 4, right: 0 }}
        >
          12
        </Badge>
      </View>
    );
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
          <>
            <Notifications />
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
          </>
        )}
      </Appbar.Header>
      <Portal>
        <Modal
          visible={notificationModal}
          onDismiss={closeNotifications}
          contentContainerStyle={{ padding: 24 }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              gap: 16,
            }}
          >
            <Text>No new notifications to display</Text>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

export default ThemeAppbar;
