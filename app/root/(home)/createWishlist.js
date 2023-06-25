import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
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
  RadioButton,
} from "react-native-paper";
import { format } from "date-fns";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import ThemeAppbar from "../../../components/ThemeAppbar";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { useData } from "../../../providers/DataProvider";
import { useUser } from "@realm/react";

export default function CreateWishlist() {
  const router = useRouter();
  const theme = useTheme();
  const user = useUser();
  const { wishlistID } = useLocalSearchParams();
  const {
    userContacts,
    wishlists,
    updateWishlistData,
    wishlistItems,
    createWishlistItem,
    removeWishlistItem,
  } = useData();

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

  const [editWishlistData, setEditWishlistData] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [typeDialogueVisible, setTypeDialogueVisible] = useState(false);
  const [typeChecked, setTypeChecked] = useState("Personal List");

  const [removeItemDialogueVisible, setRemoveItemDialogueVisible] =
    useState(false);
  const [removeItemIndex, setRemoveItemIndex] = useState(0);
  const [removeItemTitle, setRemoveItemTitle] = useState("");

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

    setEditWishlistData(currWishlistData);
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
    newItemData.wishlist = editWishlistData._id;
    createWishlistItem(newItemData);
    hideNewItemModal();
    triggerSnackBar("New wishlist item created!");
  };

  const showTypeDialog = () => setTypeDialogueVisible(true);

  const hideTypeDialog = () => setTypeDialogueVisible(false);

  const handleInput = (key, value) => {
    let newData = { ...editWishlistData };
    newData[key] = value;
    setEditWishlistData(newData);
  };

  const handleTypeDialogue = (value) => {
    hideTypeDialog();
    let newData = { ...editWishlistData };
    newData["type"] = value;
    setEditWishlistData(newData);
    updateWishlist(newData);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (newDate) => {
    hideDatePicker();
    let newData = { ...editWishlistData };
    newData["date"] = newDate;
    setEditWishlistData(newData);
    updateWishlist(newData);
  };

  const updateWishlist = (newData = editWishlistData) => {
    updateWishlistData(newData);
  };

  const Price = ({ price }) => {
    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Chip
          style={{ backgroundColor: theme.colors.surfaceVariant }}
          textStyle={{ fontSize: 12, color: theme.colors.primary }}
          compact
          mode="flat"
        >
          ${price}
        </Chip>
        <Text variant="labelMedium">Approx Price</Text>
      </View>
    );
  };

  const SaveWishlist = () => {
    return (
      <IconButton
        iconColor="#fff"
        icon="content-save"
        onPress={() => console.log("Save")}
      >
        Save
      </IconButton>
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
          Remove Item
        </Chip>
      </View>
    );
  };

  const triggerRemoveAction = (item, index) => {
    let title = "";
    if (item.title) {
      title = item.title;
    }
    setRemoveItemIndex(index);
    setRemoveItemTitle(title);
    setRemoveItemDialogueVisible(true);
  };

  const confirmRemoveItem = async () => {
    swipeableRefs[removeItemIndex].close();
    setRemoveItemDialogueVisible(false);
    const removeWishlistItemCallback = await removeWishlistItem(
      activeWishlistItems[removeItemIndex]
    );
    if (removeWishlistItemCallback == "complete") {
      let modifiedActiveWishlistItems = [...activeWishlistItems];
      modifiedActiveWishlistItems.splice(removeItemIndex, 1);
      setActiveWishlistItems(modifiedActiveWishlistItems);
      triggerSnackBar("Item removed!");
    }
  };

  const cancelRemoveItem = () => {
    swipeableRefs[removeItemIndex].close();
    setRemoveItemDialogueVisible(false);
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
    if (editWishlistData.contacts && userContacts) {
      if (
        invitedContacts.length != editWishlistData.contacts.length ||
        invitedContacts.length <= 0
      ) {
        let filteredUserContactsInvited = userContacts.filter((contact) => {
          return editWishlistData.contacts.indexOf(contact._partition) >= 0;
        });
        let filteredUserContactsOther = userContacts.filter(
          (contact) =>
            editWishlistData.contacts.indexOf(contact._partition) == -1
        );
        setInvitedContacts(filteredUserContactsInvited);
        setOtherContacts(filteredUserContactsOther);
      }
    }
  }, [editWishlistData, userContacts]);

  const handleInviteContact = (index, type, contact) => {
    setLoadingContactIndex(`${type}-${index}`);
    setLoadingContactData({ type: type, contact: contact });
  };
  useEffect(() => {
    if (Object.keys(loadingContactData).length > 0) {
      let { type, contact } = loadingContactData;
      const updateWishlistContacts = async () => {
        let updatedWishlistData = { ...editWishlistData };
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
      <ThemeAppbar
        hasBack
        title={editWishlistData.title || "View Wishlist"}
        customAction={<SaveWishlist />}
      />
      <ScrollView>
        <SafeAreaView style={{ gap: 16 }}>
          <View style={styles.inputRow}>
            <TextInput
              variant="flat"
              onChangeText={(v) => handleInput("title", v)}
              value={editWishlistData.title}
              label="Title"
              onBlur={() => updateWishlist()}
            />
          </View>
          <Divider />
          <View style={styles.inputRow}>
            <TouchableOpacity onPress={showTypeDialog}>
              <TextInput
                variant="flat"
                //onChangeText={(v) => handleInput("type", v)}
                value={editWishlistData.type}
                label="List Type"
                editable={false}
              />
            </TouchableOpacity>
          </View>
          <Divider />

          <View style={styles.inputRow}>
            <TouchableOpacity onPress={showDatePicker}>
              <TextInput
                variant="flat"
                //onChangeText={(v) => handleInput("date", v)}
                value={
                  editWishlistData.date
                    ? format(editWishlistData.date, "dd/MM/yyyy")
                    : ""
                }
                label="Event Date"
                editable={false}
              />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                date={editWishlistData.date || new Date()}
              />
            </TouchableOpacity>
          </View>

          <Divider />
          <View style={styles.infoRow}>
            <Text>Invited Contacts:</Text>
            <Chip
              mode="outlined"
              icon="account-search-outline"
              onPress={showContactsModal}
            >
              {(editWishlistData.contacts &&
                editWishlistData.contacts.length) ||
                0}{" "}
              {(editWishlistData.contacts &&
              editWishlistData.contacts.length == 1
                ? "Contact"
                : "Contacts") || "Contacts"}
            </Chip>
          </View>
          <Divider />
          <View style={styles.inputRow}>
            <TextInput
              variant="flat"
              multiline
              onChangeText={(v) => handleInput("description", v)}
              value={editWishlistData.description}
              label="Description"
              onBlur={() => updateWishlist()}
            />
          </View>
          <Divider />

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

            {activeWishlistItems.length > 0 &&
              activeWishlistItems.map((item, index) => {
                if (!item.isValid()) {
                  return null;
                }
                return (
                  <GestureHandlerRootView
                    key={`item-${index}`}
                    style={{ flex: 1 }}
                  >
                    {index > 0 && <Divider />}
                    <Swipeable
                      ref={(ref) => (swipeableRefs[index] = ref)}
                      onSwipeableOpen={() => triggerRemoveAction(item, index)}
                      renderRightActions={() => renderRightActions()}
                    >
                      <List.Accordion
                        key={`item-${index}`}
                        onPress={() =>
                          setItemExpanded(itemExpanded == index ? null : index)
                        }
                        expanded={itemExpanded == index}
                        title={item.title}
                        left={(props) => (
                          <List.Icon {...props} icon="gift-outline" />
                        )}
                        right={() => <Price price={item.price} />}
                      >
                        <View style={{ backgroundColor: "white" }}>
                          <Divider />
                          <List.Item
                            title="Description"
                            description={item.description}
                          />
                          <List.Item title="URL" description={item.url} />
                        </View>{" "}
                      </List.Accordion>
                    </Swipeable>
                  </GestureHandlerRootView>
                );
              })}
          </List.Section>
        </SafeAreaView>
      </ScrollView>
      <Portal>
        <Dialog visible={typeDialogueVisible} onDismiss={hideTypeDialog}>
          <Dialog.Title>Wishlist Type</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) => setTypeChecked(value)}
              value={typeChecked}
            >
              <RadioButton.Item label="Personal List" value="Personal List" />
              <RadioButton.Item
                label="Representitive List"
                value="Representitive List"
              />
              <RadioButton.Item label="Group List" value="Group List" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideTypeDialog}>Cancel</Button>
            <Button onPress={() => handleTypeDialogue(typeChecked)}>
              Confirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Modal
          visible={itemModalVisible}
          onDismiss={hideNewItemModal}
          contentContainerStyle={{ padding: 24 }}
        >
          <View style={{ backgroundColor: "white", padding: 16, gap: 16 }}>
            <Text>New Item</Text>
            <View style={styles.itemInputRow}>
              <TextInput
                variant="flat"
                onChangeText={(v) => handleNewItemInput("title", v)}
                value={newWishlistItemData.title || ""}
                label={`Title ${newWishlistItemDataError ? "*required" : ""}`}
                error={newWishlistItemDataError}
              />
            </View>
            <View style={styles.itemInputRow}>
              <TextInput
                variant="flat"
                multiline
                onChangeText={(v) => handleNewItemInput("description", v)}
                value={newWishlistItemData.description || ""}
                label="Description"
              />
            </View>
            <View style={styles.itemInputRow}>
              <TextInput
                variant="flat"
                onChangeText={(v) => handleNewItemInput("url", v)}
                value={newWishlistItemData.url || ""}
                label="URL"
              />
            </View>
            <View style={styles.itemInputRow}>
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
        <Dialog
          visible={removeItemDialogueVisible}
          onDismiss={cancelRemoveItem}
        >
          <Dialog.Title>Remove Item</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Remove {removeItemTitle || "Item"}?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => cancelRemoveItem()}>Cancel</Button>
            <Button onPress={() => confirmRemoveItem()}>Confirm</Button>
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
  inputRow: {
    width: "100%",
    paddingHorizontal: 16,
  },
  descriptionText: {
    flexDirection: "column",
  },
  itemInputRow: {
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
