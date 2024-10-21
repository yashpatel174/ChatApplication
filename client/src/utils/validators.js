import { isValidUsername } from "6pp";

export const usernameValidator = (userName) => {
  if (!isValidUsername(userName)) return { isValid: false, errorMessage: "Username is Invalid" };
};
