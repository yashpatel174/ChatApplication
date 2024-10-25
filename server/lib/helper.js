export const otherMember = (members, userId) => {
  return members.find((m) => m._id.toString() !== userId.toString());
};
