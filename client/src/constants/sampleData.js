export const sampleChats = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Yash Patel",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Ketul Patel",
    _id: "2",
    groupChat: true,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Yash Patel",
    _id: "1",
  },
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Ketul Patel",
    _id: "2",
  },
];

export const sampleNotification = [
  {
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "Yash Patel",
    },
    _id: "1",
  },
  {
    sender: {
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      name: "Ketul Patel",
    },
    _id: "2",
  },
];

export const sampleMessages = [
  {
    attachments: [],
    content: "this is a message",
    _id: "1",
    sender: {
      _id: "user._id",
      name: "Chaman",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.630Z",
  },
  {
    attachments: [
      {
        publicId: "Hardik",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "this is a second message",
    _id: "2",
    sender: {
      _id: "22101998",
      name: "Chaman",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.630Z",
  },
];
