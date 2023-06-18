import { ObjectId } from "bson";

class ProfileData {
  constructor({ id, firstName, lastName, contacts, avatarColor, partition }) {
    this._partition = partition;
    this._id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.contacts = contacts;
    this.avatarColor = avatarColor;
  }

  static schema = {
    name: "ProfileData",
    properties: {
      _id: "objectId",
      _partition: "string",
      firstName: "string",
      lastName: "string",
      contacts: { type: "list", objectType: "string" },
      avatarColor: "string",
    },
    primaryKey: "_id",
  };
}

class Wishlist {
  constructor({ title, type, complete, date, description, partition, id }) {
    this._partition = partition;
    this._id = id;
    this.title = title;
    this.type = type;
    this.complete = complete;
    this.date = date;
    this.description = description;
  }

  static schema = {
    name: "Wishlist",
    properties: {
      _id: "objectId",
      _partition: "string",
      title: "string",
      type: "string",
      date: "date",
      description: "string",
      complete: "bool",
    },
    primaryKey: "_id",
  };
}

class WishlistItem {
  constructor({
    title,
    url,
    price,
    description,
    purchased,
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
    this.price = price;
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
      price: "string",
      wishlist: "objectId",
    },
    primaryKey: "_id",
  };
}

export { ProfileData, Wishlist, WishlistItem };
