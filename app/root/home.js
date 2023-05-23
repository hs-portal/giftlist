import {
  AppBar,
  Text,
  HStack,
  Stack,
  IconButton,
} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <AppBar
        title="Giftlist"
        tintColor="white"
        trailing={(props) => (
          <HStack fill center>
            <IconButton
              icon={(props) => (
                <Icon name="dots-vertical" color="white" {...props} />
              )}
              {...props}
            />
          </HStack>
        )}
      />
      <Stack
        m={24}
        spacing={16}
        fill
        center
        direction="column"
        style={{ justifyContent: "space-around" }}
      >
        <Text variant="h4" style={{ fontWeight: 600 }}>
          Welcome to the HS App Template!
        </Text>
      </Stack>
    </>
  );
}
