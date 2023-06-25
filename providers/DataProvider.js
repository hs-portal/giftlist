import React, { useEffect, useState, useContext } from "react";
import { useUser } from "@realm/react";
import { ObjectId } from "bson";
import { ProfileData, Wishlist, WishlistItem } from "../schemas";

const DataContext = React.createContext(null);

function DataProvider({ useRealm, useObject, useQuery, children }) {
  const user = useUser();
  const realm = useRealm();

  const [snackMessage, setSnackMessage] = useState("");

  let contactIDArray = user.customData?.contacts || [];

  const contactIDs = contactIDArray.map((id) => "'" + id + "'").join(", ");

  let userContacts = useQuery("ProfileData")
    .filtered(`_partition IN { ${contactIDs} }`)
    .sorted("firstName");

  let wishlists = useQuery("Wishlist").filtered(`_partition == "${user.id}"`);

  let wishlistItems = useQuery("WishlistItem")
    .filtered(`_partition == "${user.id}"`)
    .filter((obj) => obj.isValid());

  let sharedWishlists = useQuery("Wishlist").filtered(
    `contacts = "${user.customData._partition}"`
  );

  const getSharedWishlistItems = (wlID) => {
    let objID = wlID;
    if (typeof objID === "string" || objID instanceof String) {
      objID = new ObjectId(wlID);
    }

    let newItems = useQuery("WishlistItem")
      .filtered(`wishlist == $0`, objID)
      .filter((obj) => obj.isValid());
    return newItems;
  };

  // Update Profile data
  const updateProfileData = (objectID, fName, lName, contacts, avatarColor) => {
    let objID = objectID;
    if (typeof objID === "string" || objID instanceof String) {
      objID = new ObjectId(objectID);
    }
    realm.write(() => {
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

  // Add Wishlist Item
  const createWishlistItem = (itemData) => {
    realm.write(() => {
      realm.create(
        "WishlistItem",
        new WishlistItem({
          title: itemData.title,
          url: itemData.url || "N/A",
          price:
            itemData.price !== "" && itemData.price !== "N/A"
              ? `$${itemData.price}`
              : "N/A",
          description: itemData.description || "",
          cancelled: false,
          purchased: false,
          wishlist: itemData.wishlist,
          partition: user.id,
        })
      );
    });
  };

  // Purchase Wishlist Item
  const purchaseWishlistItem = (itemData) => {
    realm.write(() => {
      realm.create(
        "WishlistItem",
        new WishlistItem({
          title: itemData.title,
          url: itemData.url || "N/A",
          price:
            itemData.price !== "" && itemData.price !== "N/A"
              ? `$${itemData.price}`
              : "N/A",
          description: itemData.description || "",
          cancelled: itemData.cancelled || false,
          purchased: true,
          wishlist: itemData.wishlist,
          partition: user.id,
          id: itemData._id,
        }),
        "modified"
      );
    });
  };

  // Cancel Wishlist Item
  const cancelWishlistItem = (itemData) => {
    realm.write(() => {
      realm.create(
        "WishlistItem",
        new WishlistItem({
          title: itemData.title,
          url: itemData.url || "N/A",
          price:
            itemData.price !== "" && itemData.price !== "N/A"
              ? `$${itemData.price}`
              : "N/A",
          description: itemData.description || "",
          cancelled: true,
          purchased: itemData.purchased || false,
          wishlist: itemData.wishlist,
          partition: user.id,
          id: itemData._id,
        }),
        "modified"
      );
    });
  };

  // Remove Wishlist Item
  const removeWishlistItem = (item) => {
    realm.write(() => {
      realm.delete(item);
    });
    return "complete";
  };

  // Create New Wishlist
  const createNewWishlist = (title) => {
    let newWishlist;
    realm.write(() => {
      newWishlist = realm.create(
        "Wishlist",
        new Wishlist({
          title: title,
          type: "Personal List",
          complete: false,
          date: new Date(),
          description: "",
          contacts: [],
          partition: user.id,
          id: new ObjectId(),
        })
      );
    });
    return newWishlist._id;
  };

  // Update Wishlist data
  const updateWishlistData = (wishlistData) => {
    let objID = wishlistData._id;
    if (typeof objID === "string" || objID instanceof String) {
      objID = new ObjectId(objID);
    }
    realm.write(() => {
      realm.create(
        "Wishlist",
        new Wishlist({
          title: wishlistData.title || "",
          type: wishlistData.type || "Personal List",
          complete: wishlistData.complete || false,
          date: wishlistData.date || new Date(),
          description: wishlistData.description || "",
          contacts: wishlistData.contacts || [],
          partition: user.id,
          id: objID,
        }),
        "modified"
      );
    });
    return "complete";
  };

  return (
    <DataContext.Provider
      value={{
        realm,
        updateProfileData,
        createNewWishlist,
        updateWishlistData,
        createWishlistItem,
        purchaseWishlistItem,
        cancelWishlistItem,
        removeWishlistItem,
        sharedWishlists,
        wishlists,
        wishlistItems,
        getSharedWishlistItems,
        userContacts,
        snackMessage,
        setSnackMessage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

const useData = () => {
  const data = useContext(DataContext);
  if (data == null) {
    throw new Error("useData() called outside of a DataProvider?");
  }
  return data;
};

export { DataProvider, useData };
