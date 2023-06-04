export const contacts = [
  {
    firstName: "Matthew",
    lastName: "Zalewski",
    email: "matthew@hotsource.io",
    color: "primary",
  },
  {
    firstName: "Andrew",
    lastName: "Blake",
    email: "andrewblakenz@hotmail.com",
    color: "secondary",
  },
  {
    firstName: "Jenny",
    lastName: "Zalewski",
    email: "jenny@hotsource.io",
    color: "tertiary",
  },
];

export const myWishlists = [
  {
    title: "Birthday List",
    description: "",
    type: "Personal List",
    items: ["", "", "", "", "", "", "", ""],
    complete: false,
    owner: "me",
    date: "11/10/2023",
  },
  {
    title: "Christmas List",
    description: "",
    type: "Personal List",
    items: ["", "", "", ""],
    complete: false,
    owner: "me",
    date: "25/12/2023",
  },
  {
    title: "Twins Birthday List",
    description: "The boys are turning 2, how time has flown!",
    type: "Representitive List",
    items: ["", "", "", "", "", "", "", "", "", ""],
    complete: false,
    owner: "me",
    date: "13/16/2023",
  },
  {
    title: "Camping Trip",
    description:
      "The jitsu crew are going camping! We need the following items, between us all we should be able to get everything in time!",
    type: "Group List",
    items: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    complete: false,
    owner: "me",
    date: "26/03/2024",
  },
];

export const sharedWishlists = [
  {
    title: "Birthday List",
    type: "Personal List",
    items: [
      { purchased: false },
      { purchased: false },
      { purchased: false },
      { purchased: true },
      { purchased: false },
      { purchased: false },
      { purchased: true },
      { purchased: true },
    ],
    complete: false,
    owner: "matthew@hotsource.io",
    date: "11/10/2023",
  },
  {
    title: "Christmas List",
    type: "Personal List",
    items: [
      { purchased: false },
      { purchased: false },
      { purchased: true },
      { purchased: false },
      { purchased: true },
    ],
    complete: false,
    owner: "jenny@hotsource.io",
    date: "25/12/2023",
  },
  {
    title: "James' Birthday List",
    type: "Representitive List",
    items: [
      { purchased: false },
      { purchased: false },
      { purchased: false },
      { purchased: true },
      { purchased: false },
      { purchased: false },
      { purchased: true },
      { purchased: true },
      { purchased: true },
      { purchased: true },
      { purchased: true },
      { purchased: true },
    ],
    complete: false,
    owner: "matthew@hotsource.io",
    date: "13/16/2023",
  },
  {
    title: "Tramping Trip",
    type: "Group List",
    items: [
      { purchased: false },
      { purchased: false },
      { purchased: false },
      { purchased: true },
      { purchased: false },
      { purchased: false },
      { purchased: true },
      { purchased: true },
      { purchased: false },
      { purchased: true },
      { purchased: true },
    ],
    complete: false,
    owner: "jenny@hotsource.io",
    date: "26/03/2024",
  },
];
