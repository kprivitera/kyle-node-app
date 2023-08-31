import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server";
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
} from "../../models/users";
import { refreshTokens } from "./refresh-tokens";

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
      console.log("resolver authenticate run", username, password);
      try {
        const { id } = await getUserByCredentials(username, password);
        return jwt.sign({ data: id }, JWT_SECRET, { expiresIn: "5s" });
      } catch (error) {
        throw new AuthenticationError("Invalid credentials");
      }
    },
    refresh: async (
      _parent: unknown,
      _args: unknown,
      { refreshToken }: { refreshToken: string }
    ) => {
      try {
        const token = jwt.verify(refreshToken, JWT_SECRET) as {
          data: string;
        };

        if (token.data in refreshTokens) {
          const newToken = jwt.sign(
            { data: refreshTokens[token.data] },
            JWT_SECRET,
            {
              expiresIn: "5s",
            }
          );

          console.log("refresh mutation new token", newToken);
          return newToken;
        }
      } catch (error) {
        throw new AuthenticationError("Auth expired");
      }
    },
  },
};

export default userResolver;
