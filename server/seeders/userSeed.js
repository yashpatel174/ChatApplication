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
