import React, { useState } from "react";
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
  Portal,
  RadioButton,
} from "react-native-paper";
import { format, getUnixTime } from "date-fns";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import ThemeAppbar from "../../../components/ThemeAppbar";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";

export default function CreateWishlist() {
  const router = useRouter();
  const theme = useTheme();

  const [itemExpanded, setItemExpanded] = useState();

  const [newWishlistData, setWishlistData] = useState({
    title: "",
    type: "Personal List",
    date: "",
    description: "",
  });
  const [newWishlistItems, setNewWishlistItems] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [typeDialogueVisible, setTypeDialogueVisible] = useState(false);
  const [typeChecked, setTypeChecked] = useState("Personal List");

  const showTypeDialog = () => setTypeDialogueVisible(true);

  const hideTypeDialog = () => setTypeDialogueVisible(false);

  const handleInput = (key, value) => {
    let newData = { ...newWishlistData };
    newData[key] = value;
    setWishlistData(newData);
  };

  const handleTypeDialogue = (value) => {
    hideTypeDialog();
    let newData = { ...newWishlistData };
    newData["type"] = value;
    setWishlistData(newData);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (newDate) => {
    hideDatePicker();
    let newData = { ...newWishlistData };
    newData["date"] = newDate;
    setWishlistData(newData);
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
  console.log(newWishlistData);
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
              value={newWishlistData.title}
              label="Title"
            />
          </View>
          <Divider />
          <View style={styles.inputRow}>
            <TouchableOpacity onPress={showTypeDialog}>
              <TextInput
                variant="flat"
                //onChangeText={(v) => handleInput("type", v)}
                value={newWishlistData.type}
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
                  newWishlistData.date
                    ? format(newWishlistData.date, "dd/MM/yyyy")
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
                date={newWishlistData.date || new Date()}
              />
            </TouchableOpacity>
          </View>
          <Divider />
          <View style={styles.inputRow}>
            <TextInput
              variant="flat"
              onChangeText={(v) => handleInput("description", v)}
              value={newWishlistData.description}
              label="Description"
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
                onPress={() => console.log("click")}
                mode="contained"
              >
                Add Item
              </Button>
            </View>

            {newWishlistItems.length > 0 &&
              newWishlistItems.map((item, index) => {
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
});
