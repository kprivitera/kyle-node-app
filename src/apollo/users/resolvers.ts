import jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server";

import { 
    acceptFriendRequest,
    createUser, 
    deleteUser, 
    getAllUsers, 
    getFriendRequests, 
    getSingleUser, 
    getUsersFriends,
    rejectFriendRequest,
    sendFriendRequest,
    updateUser 
} from '../../models/users';
import { refreshTokens } from "./refresh-tokens";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const userResolver = {
    Query: {
        user: async (parent, { id }: { id: string })  => {
            const user = await getSingleUser(id);
            return {
                ...user,
                friends: async () => await getUsersFriends(id),
                receivedFriendRequests: async () => await getFriendRequests(id)
            }
        },
        users: async () => getAllUsers(),
    },
    Mutation: {
        createUser: async (_: unknown, { input }) => {
            const newUser = await createUser(input);
            return newUser;
        },
        updateUser: async (_: unknown, { input }) => {
            await updateUser(input);
            return 'updated';
        },
        deleteUser: async (_: unknown, { id }) => {
            const result = await deleteUser(id);
            return `User id: ${id} removed`
        },
        sendFriendRequest: async (_: unknown, { userId, friendId }) => {
            const result = await sendFriendRequest(userId, friendId);
            return 'friend request sent';
        },
        acceptFriendRequest: async (_: unknown, { friendRequestId }) => {
            console.log('accept friend request');
            const result = acceptFriendRequest(friendRequestId);
            return 'accepted friend request';
        },
        rejectFriendRequest: async (_: unknown, { friendRequestId }) => {
            const result = rejectFriendRequest(friendRequestId);
            return 'friend request rejected'
        },
        authenticate: (
            _: unknown,
            { username, password }: { username: string; password: string }
        ) => {
            // check if user exists in database and then check their password
            // if (users[username] && users[username].password === password) {
            if (true) {
                return jwt.sign({ data: username }, JWT_SECRET, { expiresIn: "5s" });
            } else {
                throw new AuthenticationError("Invalid credentials");
            }
        },
        refresh: (
            _parent: unknown,
            _args: unknown,
            { refreshToken }: { refreshToken: string }
        ) => {
            const token = jwt.verify(refreshToken, JWT_SECRET) as {
                data: string;
            };
            if (token.data in refreshTokens) {
                return jwt.sign({ data: refreshTokens[token.data] }, JWT_SECRET, {
                    expiresIn: "5s",
                });
            }
        },
    }
};
  
export default userResolver;
