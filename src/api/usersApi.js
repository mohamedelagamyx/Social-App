import axiosClient from './axiosClient';

export const signup = (payload) =>
  axiosClient.post('/users/signup', payload).then((res) => res.data);

export const signin = (payload) =>
  axiosClient.post('/users/signin', payload).then((res) => res.data);

export const changePassword = ({ password, newPassword }) =>
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
