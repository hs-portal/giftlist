import React from "react";
import Realm from "realm";
import { StyleSheet, View } from "react-native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { AppProvider, UserProvider, createRealmContext } from "@realm/react";
import SignIn from "../components/SignIn";
import { ProfileData, Wishlist, WishlistItem } from "../schemas";
import { ActivityIndicator } from "react-native-paper";
import { DataProvider } from "./DataProvider";
import { lightTheme, darkTheme } from "../theme";

const theme = {
  ...DefaultTheme,
  //version: 2,
  colors: {
    ...lightTheme.colors,
  },
};

const AppWrapper = ({ children }) => {
  const realmConfig = {
    schema: [ProfileData.schema, Wishlist.schema, WishlistItem.schema],
  };

  const { RealmProvider, useRealm, useObject, useQuery } =
    createRealmContext(realmConfig);

  const LoadingIndicator = () => {
    return (
      <View style={styles.activityContainer}>
        <ActivityIndicator animating={true} />
      </View>
    );
  };

  const OpenRealmBehaviorConfiguration = {
    type: "openImmediately",
  };

  return (
    <AppProvider id="giftlist-gzgyt">
      <PaperProvider theme={theme}>
        <UserProvider fallback={SignIn}>
          <RealmProvider
            sync={{
              flexible: true,
              newRealmFileBehavior: OpenRealmBehaviorConfiguration,
              existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
              onError: console.error,
              initialSubscriptions: {
                update(subs, realm) {
                  subs.add(realm.objects("ProfileData"));
                  subs.add(realm.objects("Wishlist"));
                  subs.add(realm.objects("WishlistItem"));
                },
              },
            }}
            fallback={LoadingIndicator}
          >
            <DataProvider
              useRealm={useRealm}
              useObject={useObject}
              useQuery={useQuery}
            >
              {children}
            </DataProvider>
          </RealmProvider>
        </UserProvider>
      </PaperProvider>
    </AppProvider>
  );
};

export { AppWrapper };

const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
