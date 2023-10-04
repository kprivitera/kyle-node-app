import { GraphQLError } from "graphql";

import { sign, verify } from "../../utils/jwt";

import {
  acceptFriendRequest,
  createUser,
  deleteUser,
  getAllUsers,
  getFriendRequests,
  getUserByCredentials,
  getSingleUser,
  getUsersFriends,
  rejectFriendRequest,
  sendFriendRequest,
  updateUser,
  searchUsers,
} from "../../models/users";
import { updateCoverImage, updateProfileImage } from "../../models/file-upload";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const userResolver = {
  Query: {
    user: async (parent: any, { id }: { id: string }) => {
      const user = await getSingleUser(id);
      return {
        ...user,
        friends: async () => await getUsersFriends(id),
        receivedFriendRequests: async () => await getFriendRequests(id),
      };
    },
    users: async () => getAllUsers(),
    searchUsers: async (
      _parent: any,
      args: { searchTerm: string; currentUserId: number }
    ) => {
      return await searchUsers(args.searchTerm, args.currentUserId);
    },
  },
  Mutation: {
    createUser: async (_: unknown, { input }: { input: any }) => {
      const newUser = await createUser(input);
      return newUser;
    },
    updateUser: async (_: unknown, { input }: { input: any }) => {
      await updateUser(input);
      return "updated";
    },
    updateProfileImage: async (
      _: unknown,
      { id, imageUrl }: { id: number; imageUrl: string }
    ) => {
      const result = await updateProfileImage(id, imageUrl);
      return imageUrl;
    },
    updateCoverImage: async (
      _: unknown,
      { id, imageUrl }: { id: number; imageUrl: string }
    ) => {
      const result = await updateCoverImage(id, imageUrl);
      return imageUrl;
    },
    deleteUser: async (_: unknown, { id }: { id: string }) => {
      const result = await deleteUser(id);
      return `User id: ${id} removed`;
    },
    sendFriendRequest: async (
      _: unknown,
      { userId, friendId }: { userId: string; friendId: string }
    ) => {
      const result = await sendFriendRequest(userId, friendId);
      return "friend request sent";
    },
    acceptFriendRequest: async (
      _: unknown,
      { friendRequestId }: { friendRequestId: string }
    ) => {
      console.log("accept friend request");
      const result = acceptFriendRequest(friendRequestId);
      return "accepted friend request";
    },
    rejectFriendRequest: async (
      _: unknown,
      { friendRequestId }: { friendRequestId: string }
    ) => {
      const result = rejectFriendRequest(friendRequestId);
      return "friend request rejected";
    },
    authenticate: async (
      _: unknown,
      { username, password }: { username: string; password: string }
    ) => {
      try {
        const { id } = await getUserByCredentials(username, password);
        return await sign({ data: id }, JWT_SECRET, "1h");
        // return jwt.sign({ data: id }, JWT_SECRET, { expiresIn: "1h" });
      } catch (error) {
        console.log("error", error);
        throw new GraphQLError("Invalid credentials");
      }
    },
  },
};

export default userResolver;
