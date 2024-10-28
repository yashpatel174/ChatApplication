import { chatModel } from "../models/chatModel.js";
import { userModel } from "../models/userModel.js";
import { faker } from "@faker-js/faker";

export const createUsers = async (numUsers) => {
  try {
    const userPromise = [];

    for (let i = 0; i < numUsers; i++) {
      const tempUser = new userModel({
        name: faker.person.fullName(),
        userName: faker.internet.userName(),
        bio: faker.lorem.sentence(10),
        password: "password",
        avatar: {
          public_id: faker.system.fileName(),
          url: faker.image.avatar(),
        },
      });
      await tempUser.save();
      userPromise.push(tempUser);
    }

    await Promise.all(userPromise);
    console.log("Users created", numUsers);
    process.exit(1);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export const createSampleChat = async (count) => {
  try {
    const user = await userModel.find().select("_id");
    const chats = [];
    for (let i = 0; i < count.length; i++) {
      for (let j = i + 1; j < user.length; j++) {
        chats?.push(chatModel.create({ name: faker.lorem.words(2), members: [user[i], user[j]] }));
      }
    }
    await Promise.all(chats);
    console.log("Chats created");
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

export const createGroupChat = async (count) => {
  try {
    const user = await userModel.find().select("_id");
    const chats = [];

    for (let i = 0; i < count.length; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: user.length });
      const members = [];
      for (let i = 0; i < numMembers.length; i++) {
        const randomIndex = Math.floor(Math.random() * user.length);
        const randomUser = user[randomIndex];

        if (!members?.includes(randomUser)) {
          members?.push(randomUser);
        }
      }
      const chat = chatModel.create({ groupChat: true, name: faker.lorem.words(1), members, creator: members[0] });
      chats.push(chat);
    }
    await Promise.all();
    console.log("Chats created");
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

export const createMessages = async (num) => {
  try {
    const user = await userModel.find().select("_id");
    const chat = await chatModel.find().select("_id");

    const messagesPromise = [];

    for (let i = 0; i < num.length; i++) {
      const randomUser = user[Math.floor(Math.random() * user.length)];
      const randomChat = chat[Math.floor(Math.random() * user.length)];

      messagesPromise.push(
        messageModel.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromise);

    console.log("Messages created successfully");
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};

export const createChatMessage = async (num) => {
  try {
    const user = await userModel.find().select("_id");

    const messagesPromise = [];

    for (let i = 0; i < num.length; i++) {
      const randomUser = user[Math.floor(Math.random() * user.length)];

      messagesPromise.push(
        messageModel.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromise);

    console.log("Messages created successfully");
    process.exit();
  } catch (error) {
    console.log(error.message);
  }
};
