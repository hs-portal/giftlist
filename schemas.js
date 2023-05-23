import { ObjectId } from "bson";

// Here we will define our DB document schemas
class GiftListItem {
  constructor({ title, url, description, partition, id = new ObjectId() }) {
    this._partition = partition;
    this._id = id;
    this.title = title;
    this.url = url;
    this.description = description;
  }

  static schema = {
    name: "GiftListItem",
    properties: {
      _id: "objectId",
      _partition: "string",
      title: "string",
      url: "string",
      description: "string",
    },
    primaryKey: "_id",
  };
}

export { GiftListItem };
