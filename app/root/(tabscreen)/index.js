import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import {
  AppBar,
  Text,
  Stack,
  HStack,
  TextInput,
  Button,
} from "@react-native-material/core";
import {
  GestureHandlerRootView,
  FlatList,
  RectButton,
} from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { ListItem } from "react-native-elements";

import { useRouter } from "expo-router";
import { useUserData } from "../../../providers/UserDataProvider";
import { Logout } from "../../../components/Logout";

export default function TabScreen() {
  const router = useRouter();

  // controls the accordion
  const [expanded, setExpanded] = useState(false);

  // State to entry data
  const [entryTitle, setEntryTitle] = useState("");
  const [entryURL, setEntryURL] = useState("");
  const [entryDescription, setEntryDescription] = useState("");

  const { createEntry, deleteEntry, closeRealm, userData } = useUserData();

  const onClickEntry = (entry) => {
    console.log(entry.title);
  };
  const dummyData = [{ title: "poo", text: "wee" }];
  /*
  useEffect(() => {
    console.log(JSON.stringify(userData, null, 2));
  });
*/
  const SwipeableRow = ({ item, index }) => {
    console.log("item", item, item.title);
    const renderLeftActions = (progress, dragX) => {
      return (
        <RectButton
          style={styles.leftAction}
          onPress={() => console.log("Render Left")}
        >
          <Text>Render Left</Text>
        </RectButton>
      );
    };

    const renderRightActions = (progress, dragX) => {
      return (
        <RectButton
          style={styles.rightAction}
          onPress={() => deleteEntry(item)}
        >
          <Text>Delete</Text>
        </RectButton>
      );
    };

    return (
      <Swipeable
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
      >
        <RectButton style={styles.rectButton} onPress={() => alert(item.title)}>
          <Text style={styles.fromText}>{item.title}</Text>
          <Text numberOfLines={2} style={styles.messageText}>
            {item.text}
          </Text>
        </RectButton>
      </Swipeable>
    );
  };

  return (
    <>
      <AppBar
        title="Tab Screen"
        tintColor="white"
        trailing={(props) => (
          <HStack fill center>
            <Logout closeRealm={closeRealm} />
          </HStack>
        )}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ paddingBottom: 24 }}>
          <ListItem.Accordion
            content={
              <ListItem.Content>
                <ListItem.Title>Create new Entry</ListItem.Title>
              </ListItem.Content>
            }
            isExpanded={expanded}
            onPress={() => {
              setExpanded(!expanded);
            }}
          >
            {
              <Stack spacing={16} center style={{ padding: 24 }}>
                <TextInput
                  onChangeText={setEntryTitle}
                  label="Title"
                  style={{ width: "100%" }}
                  variant="outlined"
                  value={entryTitle}
                />
                <TextInput
                  onChangeText={setEntryURL}
                  label="Text"
                  style={{ width: "100%" }}
                  variant="outlined"
                  value={entryURL}
                />
                <TextInput
                  onChangeText={setEntryDescription}
                  label="Text"
                  style={{ width: "100%" }}
                  variant="outlined"
                  value={entryDescription}
                />
                <Button
                  title="Add Entry!"
                  tintColor="white"
                  style={{ alignSelf: "center" }}
                  onPress={() => {
                    createEntry(entryTitle, entryURL, entryDescription);
                  }}
                />
              </Stack>
            }
          </ListItem.Accordion>

          <FlatList
            data={userData}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item, index }) => {
              return <SwipeableRow item={item} index={index} />;
            }}
            keyExtractor={(_item, index) => `message ${index}`}
          />
        </SafeAreaView>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  rectButton: {
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    flexDirection: "column",
    backgroundColor: "white",
  },
  separator: {
    backgroundColor: "rgb(200, 199, 204)",
    height: StyleSheet.hairlineWidth,
  },
  fromText: {
    fontWeight: "bold",
    backgroundColor: "transparent",
  },
  messageText: {
    color: "#999",
    backgroundColor: "transparent",
  },
  dateText: {
    backgroundColor: "transparent",
    position: "absolute",
    right: 20,
    top: 10,
    color: "#999",
    fontWeight: "bold",
  },
  leftAction: {
    flex: 1,
    backgroundColor: "#388e3c",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10,
    backgroundColor: "plum",
    height: 20,
  },
  rightAction: {
    alignItems: "center",
    flexDirection: "row-reverse",
    backgroundColor: "#dd2c00",
    flex: 1,
    justifyContent: "flex-end",
  },
});
