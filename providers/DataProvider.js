import React, { useEffect, useContext } from "react";
import { useUser } from "@realm/react";
import { ObjectId } from "bson";
import { ProfileData, Wishlist, WishlistItem } from "../schemas";

const DataContext = React.createContext(null);

function DataProvider({ useRealm, useObject, useQuery, children }) {
  const user = useUser();
  const realm = useRealm();

  let contactIDArray = user.customData?.contacts || [];

  const contactIDs = contactIDArray.map((id) => "'" + id + "'").join(", ");

  let userContacts = useQuery("ProfileData")
    .filtered(`_partition IN { ${contactIDs} }`)
    .sorted("firstName");

  let wishlists = useQuery("Wishlist").filtered(`_partition == "${user.id}"`);

  let wishlistItems = useQuery("WishlistItem").filtered(
    `_partition == "${user.id}"`
  );

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
          price: itemData.price !== "" ? `$${itemData.price}` : "N/A",
          description: itemData.description || "",
          purchased: false,
          wishlist: itemData.wishlist,
          partition: user.id,
        })
      );
    });
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
          partition: user.id,
          id: objID,
        }),
        "modified"
      );
    });
  };

  // Define the function for deleting a document (old)
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
  return (
    <DataContext.Provider
      value={{
        realm,
        updateProfileData,
        createNewWishlist,
        updateWishlistData,
        createWishlistItem,
        wishlists,
        wishlistItems,
        userContacts,
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
