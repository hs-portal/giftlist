import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
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
} from "react-native-paper";

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

  const handleInput = ({ key, value }) => {
    let newData = { ...newWishlistData };
    newData[key] = value;
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
            <TextInput
              variant="flat"
              onChangeText={(v) => handleInput("type", v)}
              value={newWishlistData.type}
              label="List Type"
            />
          </View>
          <Divider />
          <View style={styles.inputRow}>
            <TextInput
              variant="flat"
              onChangeText={(v) => handleInput("date", v)}
              value={newWishlistData.date}
              label="Event Date"
            />
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
