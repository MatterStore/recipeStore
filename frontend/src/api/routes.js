export const loginRoute = '/user/login';
export const signupRoute = '/user/signup';
export const allRecipesRoute = '/recipes/all/public';
export const listingRoute = '/listing';
export const myRecipesRoute = '/recipes/all/';
export const allCollectionsRoute = '/collections/all/public';
export const myCollectionsRoute = '/collections/all/';
export const collectionsRoute = (id) => `/collections/${id}/`;
export const addToCollectionsRoute = (id) => `/collections/${id}/add`;
export const newCollectionsRoute = `/collections/new`;

export const removeFromCollectionsRoute = (id) => `/collections/${id}/remove`;
export const recipesRoute = (id) => `/recipes/${id}/`;
export const newRecipeRoute = `/recipes/new/`;
export const changePasswordRoute = '/user/update-password';
