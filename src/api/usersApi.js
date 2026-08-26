import axiosClient from './axiosClient';

/**
 * NOTE ON FIELD NAMES
 * -------------------
 * The public docs page (route-posts.routemisr.com) lists the endpoint
 * table but not the exact request-body field names -- those live inside
 * the Postman collection at:
 *   https://documenter.getpostman.com/view/5709532/2sBXcBnNAq
 * (a JS-rendered page, so it couldn't be scraped automatically here).
 *
 * The bodies below use the field names that match this API's own
 * conventions ("Sign in by login/email/username" from the docs, plus the
 * standard { success, message, data } response contract). Open the
 * Postman collection's "signup" / "signin" requests once, and if a field
 * name differs, it only needs to change in the small object literals
 * below -- every page in the app calls through these functions.
 */

export const signup = (payload) =>
  // payload: { name, email, username, password, rePassword }
  axiosClient.post('/users/signup', payload).then((res) => res.data);

export const signin = (payload) =>
  // payload: { login, password }  -- `login` accepts email OR username
  axiosClient.post('/users/signin', payload).then((res) => res.data);

export const changePassword = ({ password, newPassword }) =>
  // payload: { password, newPassword }
  axiosClient.patch('/users/change-password', { password, newPassword }).then((res) => res.data);

export const getProfile = () =>
  axiosClient.get('/users/profile-data').then((res) => res.data);

export const uploadProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append('photo', file);
  return axiosClient
    .put('/users/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};

export const getSuggestions = (page = 1, limit = 10) =>
  axiosClient
    .get('/users/suggestions', { params: { page, limit } })
    .then((res) => res.data);
