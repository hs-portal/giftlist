import React, { useContext, useState, useEffect, useRef } from "react";
import Realm from "realm";
import { ProfileData, Wishlist, WishlistItem } from "../schemas";
import { useAuth } from "./AuthProvider";
import { ObjectId } from "bson";

const DataContext = React.createContext(null);

const UserDataProvider = (props) => {
  const [profileData, setProfileData] = useState([]);
  const [userContacts, setUserContacts] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
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

    setProfileData(user.customData);
    //console.log("userID: ", user.id, "userCustomData: ", user.customData);
    // Enables offline-first: opens a local realm immediately without waiting
    // for the download of a synchronized realm to be completed.
    const OpenRealmBehaviorConfiguration = {
      type: "openImmediately",
    };

    const config = {
      schema: [ProfileData.schema, Wishlist.schema, WishlistItem.schema],
      sync: {
        user: user,
        flexible: true,
        //partitionValue: `${user.id}`,
        newRealmFileBehavior: OpenRealmBehaviorConfiguration,
        existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
      },
    };
    /*
    // open a realm for this particular project and get all Data
    Realm.open(config).then((realm) => {
      realmRef.current = realm;

      const syncWishlists = realm.objects("Wishlist");
      setWishlists([...syncWishlists]);
      syncWishlists.addListener(() => {
        //console.log("Got new Wishlists!:", JSON.stringify(syncWishlists, null, 2));
        setWishlists([...syncWishlists]);
      });

      const syncWishlistItems = realm.objects("WishlistItem");
      setWishlistItems([...syncWishlistItems]);
      syncWishlistItems.addListener(() => {
        //console.log("Got new Wishlist Items!:", JSON.stringify(syncWishlistItems, null, 2));
        setWishlistItems([...syncWishlistItems]);
      });

      const syncProfileData = realm
        .objects("ProfileData")
        .filtered("location = 'dallas' && price < 300000 && bedrooms = 3", {
          name: "home-search",
        });
      setProfileData([...syncProfileData]);
      syncProfileData.addListener(() => {
        console.log(
          "Got new Profie Data!:",
          JSON.stringify(syncProfileData, null, 2)
        );
        setProfileData([...syncProfileData]);
      });
    });

    return () => {
      // cleanup function
      closeRealm();
    };
  }, [user]);
*/

    // open a realm for this particular project and get all Data
    Realm.open(config).then((realm) => {
      realmRef.current = realm;

      realm.subscriptions.update((mutableSubscriptions) => {
        mutableSubscriptions.add(realm.objects("ProfileData"));
      });

      const contactIDs = user.customData.contacts
        .map((id) => "'" + id + "'")
        .join(", ");
      let syncedContactData = realm
        .objects("ProfileData")
        .filtered(`_partition IN { ${contactIDs} }`);
      let sortedContacts = syncedContactData.sorted("firstName");
      //console.log("NEW Contact DATA:, ", sortedContacts);
      setUserContacts([...sortedContacts]);

      /*
      const syncWishlists = realm.objects("Wishlist");
      setWishlists([...syncWishlists]);
      syncWishlists.addListener(() => {
        //console.log("Got new Wishlists!:", JSON.stringify(syncWishlists, null, 2));
        setWishlists([...syncWishlists]);
      });

      const syncWishlistItems = realm.objects("WishlistItem");
      setWishlistItems([...syncWishlistItems]);
      syncWishlistItems.addListener(() => {
        //console.log("Got new Wishlist Items!:", JSON.stringify(syncWishlistItems, null, 2));
        setWishlistItems([...syncWishlistItems]);
      });

      const syncProfileData = realm
        .objects("ProfileData")
        .filtered("location = 'dallas' && price < 300000 && bedrooms = 3", {
          name: "home-search",
        });
      setProfileData([...syncProfileData]);
      syncProfileData.addListener(() => {
        console.log(
          "Got new Profie Data!:",
          JSON.stringify(syncProfileData, null, 2)
        );
        setProfileData([...syncProfileData]);
      });
      */
    });

    return () => {
      // cleanup function
      closeRealm();
    };
  }, [user]);

  const updateProfileData = (objectID, fName, lName, contacts, avatarColor) => {
    console.log("update: ", objectID, fName, lName, contacts);
    const realm = realmRef.current;

    let objID = objectID;
    if (typeof objID === "string" || objID instanceof String) {
      objID = new ObjectId(objectID);
    }
    realm.write(() => {
      // Create a new entry in the same partition -- that is, using the same user id.
      realm.create(
        "ProfileData",
        new ProfileData({
          id: objID,
          firstName: fName || "",
          lastName: lName || "",
          contacts: contacts || [],
          partition: user.id,
          avatarColor: avatarColor || "#006b5e",
        }),
        "modified"
      );
    });
  };

  const createWishlist = (title, type, items, complete, description, date) => {
    const realm = realmRef.current;
    realm.write(() => {
      // Create a new entry in the same partition -- that is, using the same user id.
      realm.create(
        "Wishlist",
        new Wishlist({
          title: title || "New Title",
          type: type || "Personal List",
          items: items || [],
          complete: complete || false,
          partition: user.id,
          description: description || "Description",
          date: date || new Date(),
        })
      );
    });
  };

  // Define the function for deleting a document.
  /*
  const deleteEntry = (entry) => {
    const realm = realmRef.current;
    realm.write(() => {
      realm.delete(entry);
      // after deleting, we get the Links again and update them
      setUserData([...realm.objects("Wishlist").sorted("title")]);
    });
  };
*/

  const closeRealm = () => {
    const realm = realmRef.current;
    if (realm) {
      realm.close();
      realmRef.current = null;
      setWishlists([]);
    }
  };

  // Render the children within the DataContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useTasks hook.
  return (
    <DataContext.Provider
      value={{
        createWishlist,
        updateProfileData,
        //deleteEntry,
        closeRealm,
        profileData,
        userContacts,
        wishlists,
        wishlistItems,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

// The useTasks hook can be used by any descendant of the TasksProvider. It
// provides the tasks of the TasksProvider's project and various functions to
// create, update, and delete the tasks in that project.
const useUserData = () => {
  const userData = useContext(DataContext);
  if (userData == null) {
    throw new Error("useUserData() called outside of a TasksProvider?"); // an alert is not placed because this is an error for the developer not the user
  }
  return userData;
};

export { UserDataProvider, useUserData };
