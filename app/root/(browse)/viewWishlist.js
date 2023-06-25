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
  Dialog,
  Portal,
  Snackbar,
} from "react-native-paper";
import { format } from "date-fns";

import ThemeAppbar from "../../../components/ThemeAppbar";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { useData } from "../../../providers/DataProvider";

export default function ViewWishlist() {
  const router = useRouter();
  const theme = useTheme();
  const { wishlistID } = useLocalSearchParams();
  const {
    userContacts,
    sharedWishlists,
    purchaseWishlistItem,
    getSharedWishlistItems,
  } = useData();

  const [itemsLoading, setItemsLoading] = useState(true);

  const [activeWishlist, setActiveWishlist] = useState({});
  const [wishlistAuthor, setWishlistAuthor] = useState({});

  const [itemExpanded, setItemExpanded] = useState();

  const [purchaseDialogueVisible, setPurchaseDialogueVisible] = useState(false);
  const [purchaseItemIndex, setPurchaseItemIndex] = useState(0);
  const [purchaseItemTitle, setPurchaseItemTitle] = useState("");

  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  useEffect(() => {
    let currWishlist = sharedWishlists.find((wl) => {
      if (wl._id.toString() == wishlistID.toString()) {
        return wl;
      }
    });
    let author = userContacts.find((c) => {
      if (c._partition == currWishlist._partition) {
        return c;
      }
    });
    setWishlistAuthor(author);
    setActiveWishlist(currWishlist);
  }, [sharedWishlists]);

  let currWishlistItems = getSharedWishlistItems(wishlistID);

  useEffect(() => {
    if (currWishlistItems) {
      setItemsLoading(false);
    }
  }, [currWishlistItems]);

  const Price = ({ cancelled, purchased, price }) => {
    let displaySubtext = true;
    let priceText = price;
    let showIcon = false;
    let icon = "progress-check";

    if (purchased) {
      displaySubtext = false;
      priceText = "Purchased";
      showIcon = true;
    }

    if (cancelled) {
      displaySubtext = false;
      priceText = "Cancelled";
      showIcon = true;
      icon = "cancel";
    }

    return (
      <View style={{ flexDirection: "column", justifyContent: "center" }}>
        <Chip
          style={{
            backgroundColor: cancelled
              ? "#e3caca"
              : theme.colors.surfaceVariant,
          }}
          textStyle={{
            fontSize: 12,
            color: cancelled ? theme.colors.error : theme.colors.primary,
          }}
          compact
          mode="flat"
          icon={showIcon ? icon : ""}
          theme={{
            colors: {
              primary: cancelled ? theme.colors.error : theme.colors.primary,
            },
          }}
        >
          {priceText}
        </Chip>
        {displaySubtext && <Text variant="labelMedium">Approx Price</Text>}
      </View>
    );
  };

  const swipeableRefs = [];

  const renderRightActions = (progress, dragX) => {
    return (
      <View
        style={{
          padding: 8,
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e7f4e8",
        }}
      >
        <Chip
          style={{ backgroundColor: "#e7f4e8", height: 40 }}
          textStyle={{ fontSize: 12, color: theme.colors.primary }}
          compact
          mode="flat"
          icon={"progress-check"}
        >
          Mark item as purchased
        </Chip>
      </View>
    );
  };

  const triggerPurchase = (item, index) => {
    let title = "";
    if (item.title) {
      title = item.title;
    }
    setPurchaseItemIndex(index);
    setPurchaseItemTitle(title);
    setPurchaseDialogueVisible(true);
  };

  const confirmPurchase = () => {
    swipeableRefs[purchaseItemIndex].close();
    setPurchaseDialogueVisible(false);
    purchaseWishlistItem(currWishlistItems[purchaseItemIndex]);
    triggerSnackBar("Item purchased!");
  };

  const cancelPurchase = () => {
    swipeableRefs[purchaseItemIndex].close();
    setPurchaseDialogueVisible(false);
  };

  const triggerSnackBar = (message) => {
    setSnackMessage(message);
    setSnackVisible(true);
  };

  const onDismissSnackBar = () => {
    setSnackMessage("");
    setSnackVisible(false);
  };

  return (
    <>
      <ThemeAppbar hasBack title={activeWishlist.title || "View Wishlist"} />
      <ScrollView>
        <SafeAreaView style={{ gap: 16 }}>
          {itemsLoading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text>Author:</Text>
                <Chip>
                  {wishlistAuthor.firstName || ""}
                  {wishlistAuthor.lastName && ` ${wishlistAuthor.lastName}`}
                </Chip>
              </View>
              <Divider />
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
                </View>

                {currWishlistItems &&
                  currWishlistItems.length > 0 &&
                  currWishlistItems.map((item, index) => {
                    return (
                      <GestureHandlerRootView
                        key={`item-${index}`}
                        style={{ flex: 1 }}
                      >
                        {index > 0 && <Divider />}
                        <Swipeable
                          ref={(ref) => (swipeableRefs[index] = ref)}
                          onSwipeableOpen={() => triggerPurchase(item, index)}
                          renderRightActions={() =>
                            !item.purchased &&
                            !item.cancelled &&
                            renderRightActions()
                          }
                        >
                          <List.Accordion
                            style={{
                              backgroundColor: item.cancelled
                                ? "#f4e7e7"
                                : item.purchased
                                ? "#e7f4e8"
                                : "",
                            }}
                            onPress={() =>
                              setItemExpanded(
                                itemExpanded == index ? null : index
                              )
                            }
                            expanded={itemExpanded == index}
                            title={item.title}
                            left={(props) => (
                              <List.Icon {...props} icon="gift-outline" />
                            )}
                            right={() => (
                              <Price
                                cancelled={item.cancelled}
                                purchased={item.purchased}
                                price={item.price}
                              />
                            )}
                          >
                            <View style={{ backgroundColor: "white" }}>
                              <Divider />
                              <List.Item
                                title="Description"
                                description={item.description}
                              />
                              <List.Item title="URL" description={item.url} />
                            </View>
                          </List.Accordion>
                        </Swipeable>
                      </GestureHandlerRootView>
                    );
                  })}
              </List.Section>
            </>
          )}
        </SafeAreaView>
      </ScrollView>
      <Portal>
        <Dialog visible={purchaseDialogueVisible} onDismiss={cancelPurchase}>
          <Dialog.Title>Purchase Item</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Mark {purchaseItemTitle || "Item"} as purchased?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => cancelPurchase()}>Cancel</Button>
            <Button onPress={() => confirmPurchase()}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Snackbar
        visible={snackVisible}
        duration={3000}
        onDismiss={onDismissSnackBar}
      >
        {snackMessage}
      </Snackbar>
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
  rightAction: {
    alignItems: "center",
    flexDirection: "row-reverse",
    backgroundColor: "#e7f4e8",
    flex: 1,
    justifyContent: "flex-end",
  },
});
