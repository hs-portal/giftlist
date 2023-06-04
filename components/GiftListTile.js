import * as React from "react";
import { useRouter } from "expo-router";
import { Pressable, HStack, VStack, Text } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
export function GiftlistTile(
  {
    /*data*/
  }
) {
  const router = useRouter();

  var data = {
    title: "Birthday List",
    type: "Personal List",
    owner: "Me",
    items: [{}, {}, {}, {}, {}, {}, {}, {}],
    complete: false,
  };

  return (
    <Pressable style={{ width: "100%", height: 80, backgroundColor: "grey" }}>
      <HStack>
        <Icon name="list-box-outline" color="white" {...props} />
        <VStack>
          <Text variant="body1">{data.title}</Text>
          <Text variant="caption">{data.type}</Text>
          <Text variant="overline">{data.items.length} Items</Text>
        </VStack>
      </HStack>
    </Pressable>
  );
}
