import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  List,
  Text,
  Chip,
  Divider,
  Avatar,
  useTheme,
  SegmentedButtons,
} from "react-native-paper";
import { format } from "date-fns";
import ThemeAppbar from "../../../components/ThemeAppbar";
import { useRouter, useNavigation } from "expo-router";
import navigateWithBackParam from "../../../utils/navigateWithBackParam";
import { useData } from "../../../providers/DataProvider";

export default function Browse() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();

  const { sharedWishlists, userContacts } = useData();

  const [sharedWishlistData, setSharedWishlistData] = useState([]);
  const [filterValue, setFilterValue] = useState("date");

  useEffect(() => {
    let sortedWishlistData = sharedWishlists.sorted(filterValue);
    setSharedWishlistData(sortedWishlistData);
  }, [sharedWishlists, filterValue]);

  const ListDescription = ({ contact }) => {
    return (
      <View style={styles.descriptionText}>
        <Text variant="labelLarge">
          {contact.firstName} {contact.lastName}
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
          backgroundColor: contact.avatarColor,
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
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ paddingBottom: 8 }}>Sort by:</Text>
          <SegmentedButtons
            value={filterValue}
            onValueChange={setFilterValue}
            density="medium"
            buttons={[
              {
                icon: "calendar-range",
                value: "date",
                label: "Event Date",
                onPress: (v) => setFilterValue(v),
              },
              {
                icon: "account",
                value: "_partition",
                label: "Contact",
                onPress: (v) => setFilterValue(v),
              },
              {
                icon: "format-letter-case",
                value: "title",
                label: "Title",
                onPress: (v) => setFilterValue(v),
              },
            ]}
          />
        </View>
        <List.Section>
          {sharedWishlistData &&
            sharedWishlistData.length > 0 &&
            sharedWishlistData.map((wishlist, index) => {
              let contact = userContacts.find(
                (c) => c._partition === wishlist._partition
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
                        extraParams: { wishlistID: wishlist._id },
                      })
                    }
                    style={{ paddingLeft: 8 }}
                    title={wishlist.title}
                    description={(props) => (
                      <ListDescription {...props} contact={contact} />
                    )}
                    left={() => <UserIcon contact={contact} />}
                    right={() => (
                      <DueDate date={format(wishlist.date, "dd/MM/yyyy")} />
                    )}
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
