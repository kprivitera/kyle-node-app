import fs from 'fs';
import _ from 'lodash';
import path from 'path';

type SchemaType = 'resolvers' | 'type-defs';

const setDirectories = ({ apolloDirectory, apolloSubDirectories }: { apolloDirectory: string, apolloSubDirectories: string[] }) => 
  async ({ type }: { type: SchemaType }) => {
    const resources = await Promise.all(_.map(apolloSubDirectories, async (directoryName: string) => {
      const typeDefs = await import(path.join(apolloDirectory, directoryName, `${type}.js`));
      return typeDefs.default;
    }));
    console.log('resource:', resources);
    return resources;
}

const getApolloResolvers = async ({ apolloDirectory }: { apolloDirectory: string }) => {
  const apolloSubDirectories: string[] = fs.readdirSync(apolloDirectory);
  const getSchema = setDirectories({ apolloDirectory, apolloSubDirectories })
  const resolvers = await getSchema({ type: 'resolvers' });
  const typeDefs = await getSchema({ type: 'type-defs' });
  return {
    resolvers,
    typeDefs
  };
};

export default getApolloResolvers;
