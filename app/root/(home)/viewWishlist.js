import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  Avatar,
  Button,
  List,
  Text,
  Chip,
  Divider,
  useTheme,
  Modal,
  Dialog,
  Portal,
  TextInput,
  Snackbar,
  IconButton,
} from "react-native-paper";
import { format } from "date-fns";

import ThemeAppbar from "../../../components/ThemeAppbar";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useUser } from "@realm/react";

import { useData } from "../../../providers/DataProvider";

export default function ViewWishlist() {
  const router = useRouter();
  const theme = useTheme();
  const user = useUser();
  const { wishlistID } = useLocalSearchParams();
  const {
    userContacts,
    wishlists,
    wishlistItems,
    updateWishlistData,
    createWishlistItem,
    cancelWishlistItem,
  } = useData();

  let profileData = user.customData;

  const [activeWishlist, setActiveWishlist] = useState({});
  const [activeWishlistItems, setActiveWishlistItems] = useState([]);

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

  const [cancelDialogueVisible, setCancelDialogueVisible] = useState(false);
  const [cancelItemIndex, setCancelItemIndex] = useState(0);
  const [cancelItemTitle, setCancelItemTitle] = useState("");

  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const [contactsModalVisible, setContactsModalVisible] = useState(false);
  const [invitedContacts, setInvitedContacts] = useState([]);
  const [otherContacts, setOtherContacts] = useState([]);

  const [loadingContactData, setLoadingContactData] = useState({});
  const [loadingContactIndex, setLoadingContactIndex] = useState("");

  useEffect(() => {
    let currWishlist = wishlists.find((wl) => {
      if (wl._id.toString() == wishlistID) {
        return wl;
      }
    });

    let currWishlistData = {
      title: currWishlist.title || "",
      type: currWishlist.type || "Personal List",
      complete: currWishlist.complete || false,
      date: currWishlist.date || new Date(),
      description: currWishlist.description || "",
      contacts: currWishlist.contacts || [],
      _partition: currWishlist._partition || user.id,
      _id: currWishlist._id,
    };

    setActiveWishlist(currWishlistData);
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
    triggerSnackBar("New wishlist item created!");
  };

  const Price = ({ type, cancelled, purchased, price }) => {
    let displaySubtext = true;
    let priceText = price;
    let showIcon = false;
    let icon = "progress-check";

    if (cancelled) {
      displaySubtext = false;
      priceText = "Cancelled";
      showIcon = true;
      icon = "cancel";
    }

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
          backgroundColor: "#f4e7e7",
        }}
      >
        <Chip
          style={{
            backgroundColor: "#f4e7e7",
            height: 40,
          }}
          theme={{ colors: { primary: theme.colors.error } }}
          textStyle={{ fontSize: 12, color: theme.colors.error }}
          compact
          mode="flat"
          icon={"cancel"}
        >
          Mark item as Cancelled
        </Chip>
      </View>
    );
  };

  const triggerCancel = (item, index) => {
    let title = "";
    if (item.title) {
      title = item.title;
    }
    setCancelItemIndex(index);
    setCancelItemTitle(title);
    setCancelDialogueVisible(true);
  };

  const confirmCancel = () => {
    swipeableRefs[cancelItemIndex].close();
    setCancelDialogueVisible(false);
    cancelWishlistItem(activeWishlistItems[cancelItemIndex]);
    triggerSnackBar("Item cancelled!");
  };

  const cancelCancel = () => {
    swipeableRefs[cancelItemIndex].close();
    setCancelDialogueVisible(false);
  };

  const triggerSnackBar = (message) => {
    setSnackMessage(message);
    setSnackVisible(true);
  };

  const onDismissSnackBar = () => {
    setSnackMessage("");
    setSnackVisible(false);
  };

  const showContactsModal = () => setContactsModalVisible(true);
  const hideContactsModal = () => {
    setContactsModalVisible(false);
  };

  const UserIcon = ({ contact }) => {
    var firstInitial = Array.from(contact.firstName)[0];
    var lastInitial = Array.from(contact.lastName)[0];

    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar.Text
          style={{ backgroundColor: contact.avatarColor }}
          size={32}
          label={`${firstInitial}${lastInitial}`}
        />
      </View>
    );
  };

  useEffect(() => {
    if (activeWishlist.contacts && userContacts) {
      //console.log(activeWishlist.contacts, userContacts);
      let filteredUserContactsInvited = userContacts.filter((contact) => {
        //console.log(activeWishlist.contacts, contact);
        return activeWishlist.contacts.indexOf(contact._partition) >= 0;
      });
      let filteredUserContactsOther = userContacts.filter(
        (contact) => activeWishlist.contacts.indexOf(contact._partition) == -1
      );
      setInvitedContacts(filteredUserContactsInvited);
      setOtherContacts(filteredUserContactsOther);
    }
  }, [activeWishlist, userContacts]);

  const handleInviteContact = (index, type, contact) => {
    setLoadingContactIndex(`${type}-${index}`);
    setLoadingContactData({ type: type, contact: contact });
  };
  useEffect(() => {
    if (Object.keys(loadingContactData).length > 0) {
      let { type, contact } = loadingContactData;
      const updateWishlistContacts = async () => {
        let updatedWishlistData = { ...activeWishlist };
        let updatedContactList = [...updatedWishlistData.contacts];

        if (type == "add") {
          updatedContactList.push(contact);
        } else if (type == "remove") {
          let removeIndex = updatedContactList.indexOf(contact);
          updatedContactList.splice(removeIndex, 1);
        }
        updatedWishlistData.contacts = updatedContactList;

        const updateWishlistCall = await updateWishlistData(
          updatedWishlistData
        );
        if (updateWishlistCall == "complete") {
          setLoadingContactData({});
        }
      };
      updateWishlistContacts();
    }
  }, [loadingContactData]);

  useEffect(() => {
    setLoadingContactIndex("");
  }, [invitedContacts]);

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
          <View style={styles.infoRow}>
            <Text>Invited Contacts:</Text>
            <Chip
              mode="outlined"
              icon="account-search-outline"
              onPress={showContactsModal}
            >
              {(activeWishlist.contacts && activeWishlist.contacts.length) || 0}{" "}
              {(activeWishlist.contacts && activeWishlist.contacts.length == 1
                ? "Contact"
                : "Contacts") || "Contacts"}
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

            {activeWishlistItems.map((item, index) => {
              return (
                <GestureHandlerRootView
                  key={`item-${index}`}
                  style={{ flex: 1 }}
                >
                  {index > 0 && <Divider />}
                  <Swipeable
                    ref={(ref) => (swipeableRefs[index] = ref)}
                    onSwipeableOpen={() => triggerCancel(item, index)}
                    renderRightActions={() =>
                      !item.purchased && !item.cancelled && renderRightActions()
                    }
                  >
                    <List.Accordion
                      style={
                        activeWishlist.type === "Personal List"
                          ? {
                              backgroundColor: item.cancelled ? "#f4e7e7" : "",
                            }
                          : {
                              backgroundColor: item.purchased
                                ? "#e7f4e8"
                                : item.cancelled
                                ? "#f4e7e7"
                                : "",
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
      <Portal>
        <Dialog visible={cancelDialogueVisible} onDismiss={cancelCancel}>
          <Dialog.Title>Cancel Item</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Mark {cancelItemTitle || "Item"} as cancelled?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => cancelCancel()}>Cancel</Button>
            <Button onPress={() => confirmCancel()}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Modal
          visible={contactsModalVisible}
          onDismiss={hideContactsModal}
          style={{ maxHeight: "90%", alignSelf: "center" }}
          contentContainerStyle={{ padding: 24 }}
        >
          <ScrollView>
            <View style={{ backgroundColor: "white", padding: 16, gap: 16 }}>
              <List.Section title="Invited">
                {invitedContacts.map((contact, index) => {
                  return (
                    <List.Item
                      key={index}
                      style={{ alignItems: "center" }}
                      title={`${contact.firstName} ${contact.lastName}`}
                      //description={`${contact.firstName} ${contact.lastName}`}
                      left={() => <UserIcon contact={contact} />}
                      right={() =>
                        loadingContactIndex == `remove-${index}` ? (
                          <ActivityIndicator animating={true} />
                        ) : (
                          <IconButton
                            mode="contained-tonal"
                            size={24}
                            icon="account-remove"
                            onPress={() =>
                              handleInviteContact(
                                index,
                                "remove",
                                contact._partition
                              )
                            }
                          />
                        )
                      }
                    />
                  );
                })}
              </List.Section>
              <List.Section title="Other Contacts">
                {otherContacts.map((contact, index) => {
                  return (
                    <List.Item
                      key={index}
                      style={{ alignItems: "center" }}
                      title={`${contact.firstName} ${contact.lastName}`}
                      //description={`${contact.firstName} ${contact.lastName}`}
                      left={() => <UserIcon contact={contact} />}
                      right={() =>
                        loadingContactIndex == `add-${index}` ? (
                          <ActivityIndicator animating={true} />
                        ) : (
                          <IconButton
                            mode="contained-tonal"
                            size={24}
                            icon="account-plus"
                            onPress={() =>
                              handleInviteContact(
                                index,
                                "add",
                                contact._partition
                              )
                            }
                          />
                        )
                      }
                    />
                  );
                })}
              </List.Section>
            </View>
          </ScrollView>
        </Modal>
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
