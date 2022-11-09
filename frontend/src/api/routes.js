export const home = '/';
export const loginRoute = '/user/login';
export const signupRoute = '/user/signup';
export const changePasswordRoute = '/user/update-password';

export const myRecipesRoute = '/recipes/all/';
export const allRecipesRoute = '/recipes/all/public';

export const newRecipeRoute = `/recipes/new/`;
export const recipesRoute = (id) => `/recipes/${id}/`;

export const myCollectionsRoute = '/collections/all/';
export const allCollectionsRoute = '/collections/all/public';

export const newCollectionsRoute = `/collections/new`;
export const collectionsRoute = (id) => `/collections/${id}/`;
export const addToCollectionsRoute = (id) => `/collections/${id}/add`;
export const removeFromCollectionsRoute = (id) => `/collections/${id}/remove`;

export const publicListingRoute = '/listing/public';
export const myListingRoute = '/listing/user';
