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
import { useRouter, useNavigation } from "expo-router";
import { myWishlists } from "../../../dummyData";
import navigateWithBackParam from "../../../utils/navigateWithBackParam";

export default function Home() {
  const router = useRouter();
  const navigation = useNavigation();
  const theme = useTheme();

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
          onPress={() =>
            navigateWithBackParam({
              router,
              navigation,
              route: "/root/(home)/createWishlist",
            })
          }
        >
          Create Wishlist
        </Button>
        <List.Section>
          {myWishlists.map((wishlist, index) => {
            return (
              <>
                {index > 0 && <Divider />}
                <List.Item
                  onPress={() =>
                    navigateWithBackParam({
                      router,
                      navigation,
                      route: "/root/(home)/viewWishlist",
                      extraParams: { wishlistID: index },
                    })
                  }
                  key={`wishlist-${index}`}
                  title={wishlist.title}
                  description={(props) => (
                    <ListDescription
                      {...props}
                      type={wishlist.type}
                      items={wishlist.items.length}
                    />
                  )}
                  left={(props) => (
                    <List.Icon {...props} icon="playlist-check" />
                  )}
                  right={() => <DueDate date={wishlist.date} />}
                />
              </>
            );
          })}
        </List.Section>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  descriptionText: {
    flexDirection: "column",
  },
});
