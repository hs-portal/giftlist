import React, { useContext, useState, useEffect, useRef } from "react";
import Realm from "realm";
import {
  ProfileData,
  Wishlist,
  WishlistItem,
  WishlistItemComment,
} from "../schemas";
import { useAuth } from "./AuthProvider";

const UserContext = React.createContext(null);

const UserDataProvider = (props) => {
  const [userData, setUserData] = useState([]);
  const { user } = useAuth();

  // Use a Ref to store the realm rather than the state because it is not
  // directly rendered, so updating it should not trigger a re-render as using
  // state would.
  const realmRef = useRef(null);

  useEffect(() => {
    if (user == null) {
      console.error("Null user? Needs to log in!");
      return;
    }

    // Enables offline-first: opens a local realm immediately without waiting
    // for the download of a synchronized realm to be completed.
    const OpenRealmBehaviorConfiguration = {
      type: "openImmediately",
    };
    const config = {
      schema: [
        ProfileData.schema,
        Wishlist.schema,
        WishlistItem.schema,
        WishlistItemComment.schema,
      ],
      sync: {
        user: user,
        partitionValue: `${user.id}`,
        newRealmFileBehavior: OpenRealmBehaviorConfiguration,
        existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
      },
    };

    // open a realm for this particular project and get all Data
    Realm.open(config).then((realm) => {
      realmRef.current = realm;

      const syncUserData = realm.objects("Wishlist");
      let sortedUserData = syncUserData.sorted("title");
      setUserData([...sortedUserData]);

      // we observe changes on the Data, in case Sync informs us of changes
      // started in other devices (or the cloud)
      sortedUserData.addListener(() => {
        console.log("Got new data!:", sortedUserData);
        setUserData([...sortedUserData]);
      });
    });

    return () => {
      // cleanup function
      closeRealm();
    };
  }, [user]);

  const createEntry = (newEntryTitle, newEntryURL, newEntryDescription) => {
    const realm = realmRef.current;
    realm.write(() => {
      // Create a new entry in the same partition -- that is, using the same user id.
      realm.create(
        "Wishlist",
        new Wishlist({
          title: newEntryTitle || "New Title",
          url: newEntryURL || "New Url",
          description: newEntryDescription || "New Description",
          partition: user.id,
        })
      );
    });
  };

  // Define the function for deleting a link.
  const deleteEntry = (entry) => {
    const realm = realmRef.current;
    realm.write(() => {
      realm.delete(entry);
      // after deleting, we get the Links again and update them
      setUserData([...realm.objects("Wishlist").sorted("title")]);
    });
  };

  const closeRealm = () => {
    const realm = realmRef.current;
    if (realm) {
      realm.close();
      realmRef.current = null;
      setUserData([]);
    }
  };

  // Render the children within the UserContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useTasks hook.
  return (
    <UserContext.Provider
      value={{
        createEntry,
        deleteEntry,
        closeRealm,
        userData,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

// The useTasks hook can be used by any descendant of the TasksProvider. It
// provides the tasks of the TasksProvider's project and various functions to
// create, update, and delete the tasks in that project.
const useUserData = () => {
  const userData = useContext(UserContext);
  if (userData == null) {
    throw new Error("useUserData() called outside of a TasksProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return userData;
};

export { UserDataProvider, useUserData };
