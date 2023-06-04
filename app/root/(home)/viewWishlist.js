import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  List,
  Text,
  Chip,
  Divider,
  useTheme,
} from "react-native-paper";

import ThemeAppbar from "../../../components/ThemeAppbar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { myWishlists } from "../../../dummyData";
import { ScrollView } from "react-native-gesture-handler";

export default function ViewWishlist() {
  const router = useRouter();
  const theme = useTheme();
  const { wishlistID } = useLocalSearchParams();

  const [itemExpanded, setItemExpanded] = useState();

  let activeWishlist = myWishlists[wishlistID];

  let items = [
    {
      title: "Xbox Series X",
      description: "Might need a few people to collaborate on this one :)",
      url: "www.microsoft.com/purchase/series-x",
      price: "699.99",
    },
    {
      title: "Halo Infinite",
      description: "Need an actual game to play on the Xbox ya know",
      url: "www.mightyape.co.nz/games/xbox/halo-infinite",
      price: "10.99",
    },
  ];

  const Price = ({ price }) => {
    return (
      <View style={{ flexDirection: "column", justifyContent: "center" }}>
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

  return (
    <>
      <ThemeAppbar hasBack title={activeWishlist.title} />
      <ScrollView>
        <SafeAreaView style={{ gap: 16 }}>
          <View style={styles.infoRow}>
            <Text>List Type:</Text>
            <Chip>{activeWishlist.type}</Chip>
          </View>
          <Divider />
          <View style={styles.infoRow}>
            <Text>Event Date:</Text>
            <Chip>{activeWishlist.date}</Chip>
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

            {items.map((item, index) => {
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  descriptionText: {
    flexDirection: "column",
  },
});
