import { ObjectId } from "bson";

class ProfileData {
  constructor({
    firstName,
    lastName,
    contacts,
    wishlists,
    partition,
    id = new ObjectId(),
  }) {
    this._partition = partition;
    this._id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.contacts = contacts;
    this.wishlists = wishlists;
  }

  static schema = {
    name: "ProfileData",
    properties: {
      _id: "objectId",
      _partition: "string",
      firstName: "string",
      lastName: "string",
      contacts: { type: "list", objectType: "string" },
      wishlists: "Wishlist[]",
    },
    primaryKey: "_id",
  };
}

class Wishlist {
  constructor({
    title,
    type,
    items,
    profile,
    complete,
    partition,
    id = new ObjectId(),
  }) {
    this._partition = partition;
    this._id = id;
    this.title = title;
    this.type = type;
    this.items = items;
    this.complete = complete;
    this.profile = profile;
  }

  static schema = {
    name: "Wishlist",
    properties: {
      _id: "objectId",
      _partition: "string",
      title: "string",
      type: "string",
      items: "WishlistItem[]",
      profile: {
        type: "linkingObjects",
        objectType: "ProfileData",
        property: "wishlists",
      },
      complete: "bool",
    },
    primaryKey: "_id",
  };
}

class WishlistItem {
  constructor({
    title,
    url,
    description,
    purchased,
    comments,
    wishlist,
    partition,
    id = new ObjectId(),
  }) {
    this._partition = partition;
    this._id = id;
    this.title = title;
    this.url = url;
    this.description = description;
    this.purchased = purchased;
    this.comments = comments;
    this.wishlist = wishlist;
  }

  static schema = {
    name: "WishlistItem",
    properties: {
      _id: "objectId",
      _partition: "string",
      title: "string",
      url: "string",
      description: "string",
      purchased: "bool",
      comments: "WishlistItemComment[]",
      wishlist: {
        type: "linkingObjects",
        objectType: "Wishlist",
        property: "items",
      },
    },
    primaryKey: "_id",
  };
}

class WishlistItemComment {
  constructor({ text, date, wishlistitem, partition, id = new ObjectId() }) {
    this._partition = partition;
    this._id = id;
    this.text = text;
    this.date = date;
    this.wishlistitem = wishlistitem;
  }

  static schema = {
    name: "WishlistItemComment",
    properties: {
      _id: "objectId",
      _partition: "string",
      text: "string",
      date: "date",
      wishlistitem: {
        type: "linkingObjects",
        objectType: "WishlistItem",
        property: "comments",
      },
    },
    primaryKey: "_id",
  };
}

export { ProfileData, Wishlist, WishlistItem, WishlistItemComment };
