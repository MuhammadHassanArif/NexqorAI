// The access token lives only in memory (a plain variable), never in localStorage.
// Scripts cannot read it from storage, and it disappears when the page is refreshed.
// After a refresh, the httpOnly cookie is used to get a new one (see authService.restoreSession).
let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token) => {
  accessToken = token;
};
export const clearAccessToken = () => {
  accessToken = null;
};