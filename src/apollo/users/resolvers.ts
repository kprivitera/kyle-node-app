import { deleteUser, getAllUsers, getSingleUser } from '../../models/users';

const userResolver = {
    Query: {
        user: async (parent, { id }: { id: string })  => getSingleUser(id),
        users: async () => getAllUsers(),
    },
    Mutation: {
        deleteUser: async (parent, { id }) => {
            const result = await deleteUser(id);
            return `User id: ${id} removed`
        }
    }
};
  
export default userResolver;
