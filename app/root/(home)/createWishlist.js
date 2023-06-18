import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  List,
  Text,
  TextInput,
  Chip,
  Divider,
  useTheme,
  IconButton,
  Dialog,
  Modal,
  Portal,
  RadioButton,
} from "react-native-paper";
import { format } from "date-fns";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import ThemeAppbar from "../../../components/ThemeAppbar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { useData } from "../../../providers/DataProvider";
import { useUser } from "@realm/react";

export default function CreateWishlist() {
  const router = useRouter();
  const theme = useTheme();
  const user = useUser();
  const { wishlistID } = useLocalSearchParams();
  const { wishlists, updateWishlistData, wishlistItems, createWishlistItem } =
    useData();

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

  const [editWishlistData, setEditWishlistData] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [typeDialogueVisible, setTypeDialogueVisible] = useState(false);
  const [typeChecked, setTypeChecked] = useState("Personal List");

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
      _partition: currWishlist._partition || user.id,
      _id: currWishlist._id,
    };
    console.log("testData", currWishlistData);
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
  return (
    <>
      <ThemeAppbar
        hasBack
        title="New Wishlist"
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

          <List.Section /*title="Items"*/>
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

            {aciveWishlistItems.length > 0 &&
              aciveWishlistItems.map((item, index) => {
                return (
                  <>
                    {index > 0 && <Divider />}

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
});
