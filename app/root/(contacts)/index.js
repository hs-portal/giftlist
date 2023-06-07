import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeAppbar from "../../../components/ThemeAppbar";
import {
  Button,
  Text,
  TextInput,
  List,
  Avatar,
  useTheme,
  Dialog,
  Portal,
} from "react-native-paper";

import { useRouter } from "expo-router";
import { contacts } from "../../../dummyData";
import { useUserData } from "../../../providers/UserDataProvider";
import { ScrollView } from "react-native-gesture-handler";

export default function Contacts() {
  const router = useRouter();
  const theme = useTheme();
  const { userContacts } = useUserData();

  //console.log("userContacts:", userContacts);

  const [contactEmail, setContactEmail] = useState("");
  const [inviteDialogueVisible, setInviteDialogueVisible] = useState(false);

  const showInviteDialog = () => setInviteDialogueVisible(true);

  const hideInviteDialog = () => setInviteDialogueVisible(false);

  const UserIcon = ({ contact }) => {
    var firstInitial = Array.from(contact.firstName)[0];
    var lastInitial = Array.from(contact.lastName)[0];

    return (
      <Avatar.Text
        style={{ backgroundColor: contact.avatarColor }}
        size={48}
        label={`${firstInitial}${lastInitial}`}
      />
    );
  };
  return (
    <>
      <ThemeAppbar hasDefaultAction title="Contacts" />
      <ScrollView>
        <SafeAreaView style={{ paddingHorizontal: 16 }}>
          <Button
            mode="contained"
            style={{ alignSelf: "center" }}
            icon="account-plus"
            onPress={showInviteDialog}
          >
            Invite Contact
          </Button>
          <List.Section>
            {userContacts &&
              userContacts.length > 0 &&
              userContacts.map((contact, index) => {
                return (
                  <List.Item
                    key={index}
                    title={`${contact.firstName} ${contact.lastName}`}
                    description={`${contact.firstName}${contact.lastName}@email.com`}
                    left={() => <UserIcon contact={contact} />}
                  />
                );
              })}
          </List.Section>
        </SafeAreaView>
      </ScrollView>
      <Portal>
        <Dialog visible={inviteDialogueVisible} onDismiss={hideInviteDialog}>
          <Dialog.Title>Invite Contact</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Please enter the email of the contact you would like to invite.
            </Text>
            <TextInput
              variant="flat"
              onChangeText={(v) => setContactEmail(v)}
              value={contactEmail}
              label="Email"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideInviteDialog}>Cancel</Button>
            <Button onPress={() => console.log("Invite Contact")}>
              Invite
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
