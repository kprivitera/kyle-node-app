import { 
    acceptFriendRequest,
    createUser, 
    deleteUser, 
    getAllUsers, 
    getFriendRequests, 
    getSingleUser, 
    getUsersFriends,
    sendFriendRequest,
    updateUser 
} from '../../models/users';

const userResolver = {
    Query: {
        user: async (parent, { id }: { id: string })  => {
            const user = await getSingleUser(id);
            return {
                ...user,
                friends: async () => await getUsersFriends(id),
                friendRequests: async () => await getFriendRequests(id)
            }
        },
        users: async () => getAllUsers(),
    },
    Mutation: {
        createUser: async (parent, { input }) => {
            const newUser = await createUser(input);
            return newUser;
        },
        updateUser: async (parent, { input }) => {
            await updateUser(input);
            return 'updated';
        },
        deleteUser: async (parent, { id }) => {
            const result = await deleteUser(id);
            return `User id: ${id} removed`
        },
        sendFriendRequest: async (parent, { userId, friendId }) => {
            const result = await sendFriendRequest(userId, friendId);
            return 'friend request sent';
        },
        acceptFriendRequest: async (parent, { friendRequestId }) => {
            console.log('accept friend request');
            const result = acceptFriendRequest(friendRequestId);
            return 'accepted friend request';
        }
    }
};
  
export default userResolver;
