import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  List,
  Text,
  Chip,
  Divider,
  useTheme,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import { format } from "date-fns";
import ThemeAppbar from "../../../components/ThemeAppbar";
import { useRouter, useNavigation } from "expo-router";
import navigateWithBackParam from "../../../utils/navigateWithBackParam";
import { useData } from "../../../providers/DataProvider";

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();
  const { createNewWishlist, wishlists, wishlistItems } = useData();

  const [wishListData, setWishListData] = useState([]);

  const [newWishlistModalVisible, setNewWishlistModalVisible] = useState(false);

  const [newWishlistTitle, setNewWishlistTitle] = useState("");
  const [newWishlistError, setNewWishlistError] = useState(false);

  useEffect(() => {
    let wishlistsRAW = [...wishlists];

    wishlistsRAW.forEach((wl) => {
      let items = [];

      wishlistItems.forEach((i) => {
        if (wl._id.toString() == i.wishlist) {
          items.push(i);
        }
      });

      wl.items = items;
    });

    setWishListData(wishlistsRAW);
  }, [wishlists, wishlistItems]);

  const showNewWishlistModal = () => setNewWishlistModalVisible(true);
  const hideNewWishlistModal = () => {
    setNewWishlistModalVisible(false);
    setNewWishlistTitle("");
    setNewWishlistError(false);
  };

  const handleNewItemInput = (value) => {
    if (value === "") {
      setNewWishlistError(true);
    } else {
      setNewWishlistError(false);
    }
    setNewWishlistTitle(value);
  };

  const saveNewWishlist = async () => {
    if (newWishlistTitle === "") {
      setNewWishlistError(true);
      return;
    }
    const newWishlistID = await createNewWishlist(newWishlistTitle);
    hideNewWishlistModal();
    if (newWishlistID) {
      navigateWithBackParam({
        router,
        navigation,
        route: "/root/(home)/createWishlist",
        extraParams: { wishlistID: newWishlistID },
      });
    }
  };

  const ListDescription = ({ type, items }) => {
    return (
      <View style={styles.descriptionText}>
        <Text variant="labelMedium">{type}</Text>
        <Text variant="labelLarge">{items} Items</Text>
      </View>
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
      <ThemeAppbar hasDefaultAction title="My Wishlists" />
      <SafeAreaView>
        <Button
          mode="contained"
          style={{ alignSelf: "center" }}
          icon="playlist-plus"
          onPress={showNewWishlistModal}
        >
          Create Wishlist
        </Button>
        <List.Section>
          {wishlists &&
            wishlists.length > 0 &&
            wishListData.map((wishlist, index) => {
              return (
                <React.Fragment key={`wishlist-${index}`}>
                  {index > 0 && <Divider />}
                  <List.Item
                    onPress={() =>
                      navigateWithBackParam({
                        router,
                        navigation,
                        route: "/root/(home)/viewWishlist",
                        extraParams: { wishlistID: wishlist._id },
                      })
                    }
                    title={wishlist.title}
                    description={(props) => (
                      <ListDescription
                        {...props}
                        type={wishlist.type}
                        items={wishlist.items?.length || 0}
                      />
                    )}
                    left={(props) => (
                      <List.Icon {...props} icon="playlist-check" />
                    )}
                    right={() => (
                      <DueDate date={format(wishlist.date, "dd/MM/yyyy")} />
                    )}
                  />
                </React.Fragment>
              );
            })}
        </List.Section>
      </SafeAreaView>
      <Portal>
        <Modal
          visible={newWishlistModalVisible}
          onDismiss={hideNewWishlistModal}
          contentContainerStyle={{ padding: 24 }}
        >
          <View style={{ backgroundColor: "white", padding: 16, gap: 16 }}>
            <Text>Create New Wishlist</Text>
            <View style={styles.inputRow}>
              <TextInput
                variant="flat"
                onChangeText={(v) => handleNewItemInput(v)}
                value={newWishlistTitle || ""}
                label={`Wishlist Title ${newWishlistError ? "*required" : ""}`}
                error={newWishlistError}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 16,
                justifyContent: "flex-end",
              }}
            >
              <Button
                buttonColor={theme.colors.tertiary}
                onPress={hideNewWishlistModal}
                mode="contained"
              >
                Cancel
              </Button>
              <Button onPress={() => saveNewWishlist()} mode="contained">
                Create Wishlist
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  descriptionText: {
    flexDirection: "column",
  },
  inputRow: {
    width: "100%",
  },
});
