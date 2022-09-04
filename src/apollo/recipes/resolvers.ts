const recipes = [
    {
      title: "The Awakening",
      author: "Kate Chopin",
    },
    {
      title: "City of Glass",
      author: "Paul Auster",
    }
  ];
  
  const recipeResolver = {
    Query: {
      recipes: () => recipes,
    }
  };
  
  export default recipeResolver;