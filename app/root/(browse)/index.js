import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  List,
  Text,
  Chip,
  Divider,
  Avatar,
  useTheme,
} from "react-native-paper";

import ThemeAppbar from "../../../components/ThemeAppbar";
import { useRouter, useNavigation } from "expo-router";
import { contacts, sharedWishlists } from "../../../dummyData";
import navigateWithBackParam from "../../../utils/navigateWithBackParam";

export default function Browse() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();

  const [drawerActive, setDrawerActive] = useState("");

  var wishlists = [...sharedWishlists];
  var wishlistContacts = [...contacts];

  const ListDescription = ({ contact, type, items }) => {
    let purchasedArray = items.filter((item) => {
      return item.purchased;
    });
    return (
      <View style={styles.descriptionText}>
        <Text variant="labelMedium">
          {contact.firstName}'s {type}
        </Text>
        <Text variant="labelLarge">
          {purchasedArray.length}/{items.length} Items Purchased
        </Text>
      </View>
    );
  };

  const UserIcon = ({ contact }) => {
    var firstInitial = Array.from(contact.firstName)[0];
    var lastInitial = Array.from(contact.lastName)[0];

    return (
      <Avatar.Text
        style={{
          backgroundColor: theme.colors[contact.color],
          alignSelf: "center",
        }}
        size={36}
        label={`${firstInitial}${lastInitial}`}
      />
    );
  };

  const DueDate = ({ date }) => {
    return (
      <View style={{ flexDirection: "column", justifyContent: "center" }}>
        <Chip
          style={{ backgroundColor: theme.colors.surfaceVariant }}
          textStyle={{ fontSize: 12, color: theme.colors.primary }}
          compact
          mode="flat"
          icon="calendar-range"
        >
          {date}
        </Chip>
      </View>
    );
  };

  return (
    <>
      <ThemeAppbar hasDefaultAction title="Browse" />
      <SafeAreaView>
        <List.Section>
          {wishlists.map((wishlist, index) => {
            let contact = wishlistContacts.find(
              (c) => c.email === wishlist.owner
            );
            return (
              <React.Fragment key={`wishlist-${index}`}>
                {index > 0 && <Divider />}
                <List.Item
                  onPress={() =>
                    navigateWithBackParam({
                      router,
                      navigation,
                      route: "/root/(browse)/viewWishlist",
                      extraParams: { wishlistID: index },
                    })
                  }
                  style={{ paddingLeft: 8 }}
                  title={wishlist.title}
                  description={(props) => (
                    <ListDescription
                      {...props}
                      contact={contact}
                      type={wishlist.type}
                      items={wishlist.items}
                    />
                  )}
                  left={() => <UserIcon contact={contact} />}
                  right={() => <DueDate date={wishlist.date} />}
                />
              </React.Fragment>
            );
          })}
        </List.Section>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  descriptionText: {
    flexDirection: "column",
  },
});
