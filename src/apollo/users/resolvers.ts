import { createUser, deleteUser, getAllUsers, getSingleUser, updateUser } from '../../models/users';

const userResolver = {
    Query: {
        user: async (parent, { id }: { id: string })  => getSingleUser(id),
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
        }
    }
};
  
export default userResolver;
