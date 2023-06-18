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
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { useData } from "../../../providers/DataProvider";

export default function ViewWishlist() {
  const router = useRouter();
  const theme = useTheme();
  const { wishlistID } = useLocalSearchParams();
  const { wishlists, wishlistItems, createWishlistItem } = useData();

  const [activeWishlist, setActiveWishlist] = useState({});
  const [aciveWishlistItems, setActiveWishlistItems] = useState([]);

  const [itemExpanded, setItemExpanded] = useState();
  const [itemModalVisible, setItemModalVisible] = useState(false);

  const [newWishlistItemData, setNewWishlistItemData] = useState({
    title: "",
    description: "",
    url: "",
    price: "",
  });
  const [newWishlistItemDataError, setNewWishlistItemDataError] =
    useState(false);

  useEffect(() => {
    let currWishlist = wishlists.find((wl) => {
      if (wl._id.toString() == wishlistID) {
        return wl;
      }
    });

    setActiveWishlist(currWishlist);
  }, [wishlists]);

  useEffect(() => {
    let items = [];

    wishlistItems.forEach((i) => {
      if (i.wishlist.toString() == wishlistID) {
        items.push(i);
      }
    });
    setActiveWishlistItems(items);
  }, [wishlistItems]);

  const showNewItemModal = () => setItemModalVisible(true);
  const hideNewItemModal = () => {
    setItemModalVisible(false);
    setNewWishlistItemData({
      title: "",
      description: "",
      url: "",
      price: "",
    });
    setNewWishlistItemDataError(false);
  };

  const handleNewItemInput = (key, value) => {
    if (key === "title") {
      if (value === "") {
        setNewWishlistItemDataError(true);
      } else {
        setNewWishlistItemDataError(false);
      }
    }
    if (key === "price") {
      const regex = /^[0-9\b]+$/;
      if (!regex.test(value) && value != "") {
        return;
      }
    }
    let newData = { ...newWishlistItemData };
    newData[key] = value;
    setNewWishlistItemData(newData);
  };

  const saveNewWishlistItem = () => {
    if (newWishlistItemData.title === "") {
      setNewWishlistItemDataError(true);
      return;
    }
    let newItemData = { ...newWishlistItemData };
    newItemData.wishlist = activeWishlist._id;
    createWishlistItem(newItemData);
    hideNewItemModal();
  };

  const Price = ({ type, purchased, price }) => {
    let displaySubtext = true;
    let priceText = price;
    let showIcon = false;

    if (type !== "Personal List") {
      if (purchased) {
        displaySubtext = false;
        priceText = "Purchased";
        showIcon = true;
      }
    }

    return (
      <View style={{ flexDirection: "column", justifyContent: "center" }}>
        <Chip
          style={{ backgroundColor: theme.colors.surfaceVariant }}
          textStyle={{ fontSize: 12, color: theme.colors.primary }}
          compact
          mode="flat"
          icon={showIcon ? "progress-check" : ""}
        >
          {priceText}
        </Chip>
        {displaySubtext && <Text variant="labelMedium">Approx Price</Text>}
      </View>
    );
  };

  return (
    <>
      <ThemeAppbar hasBack title={activeWishlist.title || "View Wishlist"} />
      <ScrollView>
        <SafeAreaView style={{ gap: 16 }}>
          <View style={styles.infoRow}>
            <Text>List Type:</Text>
            <Chip>{activeWishlist.type}</Chip>
          </View>
          <Divider />
          <View style={styles.infoRow}>
            <Text>Event Date:</Text>
            <Chip>
              {format(activeWishlist.date || new Date(), "dd/MM/yyyy")}
            </Chip>
          </View>
          <Divider />
          {activeWishlist.description && (
            <>
              <View style={styles.infoRow}>
                <Text>{activeWishlist.description}</Text>
              </View>
              <Divider />
            </>
          )}
          <List.Section>
            <View
              style={{
                padding: 16,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text variant="titleMedium">Items</Text>
              <Button
                icon="plus-thick"
                onPress={showNewItemModal}
                mode="contained"
              >
                Add Item
              </Button>
            </View>

            {aciveWishlistItems.map((item, index) => {
              return (
                <>
                  {index > 0 && <Divider />}

                  <List.Accordion
                    key={`item-${index}`}
                    style={
                      activeWishlist.type === "Personal List"
                        ? {}
                        : {
                            backgroundColor: item.purchased ? "#e7f4e8" : "",
                          }
                    }
                    onPress={() =>
                      setItemExpanded(itemExpanded == index ? null : index)
                    }
                    expanded={itemExpanded == index}
                    title={item.title}
                    left={(props) => (
                      <List.Icon {...props} icon="gift-outline" />
                    )}
                    right={() => (
                      <Price
                        type={activeWishlist.type}
                        purchased={item.purchased}
                        price={item.price}
                      />
                    )}
                  >
                    <List.Item
                      title="Description"
                      description={item.description}
                    />
                    <List.Item title="URL" description={item.url} />
                  </List.Accordion>
                </>
              );
            })}
          </List.Section>
        </SafeAreaView>
      </ScrollView>
      <Portal>
        <Modal
          visible={itemModalVisible}
          onDismiss={hideNewItemModal}
          contentContainerStyle={{ padding: 24 }}
        >
          <View style={{ backgroundColor: "white", padding: 16, gap: 16 }}>
            <Text>New Item</Text>
            <View style={styles.inputRow}>
              <TextInput
                variant="flat"
                onChangeText={(v) => handleNewItemInput("title", v)}
                value={newWishlistItemData.title || ""}
                label={`Title ${newWishlistItemDataError ? "*required" : ""}`}
                error={newWishlistItemDataError}
              />
            </View>
            <View style={styles.inputRow}>
              <TextInput
                variant="flat"
                multiline
                onChangeText={(v) => handleNewItemInput("description", v)}
                value={newWishlistItemData.description || ""}
                label="Description"
              />
            </View>
            <View style={styles.inputRow}>
              <TextInput
                variant="flat"
                onChangeText={(v) => handleNewItemInput("url", v)}
                value={newWishlistItemData.url || ""}
                label="URL"
              />
            </View>
            <View style={styles.inputRow}>
              <TextInput
                variant="flat"
                onChangeText={(v) => handleNewItemInput("price", v)}
                value={newWishlistItemData.price || ""}
                label="Approximate Price"
                left={<TextInput.Affix text="$" />}
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
                onPress={hideNewItemModal}
                mode="contained"
              >
                Cancel
              </Button>
              <Button onPress={() => saveNewWishlistItem()} mode="contained">
                Save Item
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  descriptionText: {
    flexDirection: "column",
  },
  inputRow: {
    width: "100%",
  },
});
