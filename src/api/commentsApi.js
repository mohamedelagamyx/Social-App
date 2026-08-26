import axiosClient from './axiosClient';

export const getComments = (postId, page = 1, limit = 20) =>
  axiosClient
    .get(`/posts/${postId}/comments`, { params: { page, limit } })
    .then((res) => res.data);

export const createComment = (postId, { text, image }) => {
  const formData = new FormData();
  if (text) formData.append('content', text);
  if (image) formData.append('image', image);
  return axiosClient
    .post(`/posts/${postId}/comments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};

export const updateComment = (postId, commentId, { text }) =>
  axiosClient
    .put(`/posts/${postId}/comments/${commentId}`, { content: text })
    .then((res) => res.data);

export const deleteComment = (postId, commentId) =>
  axiosClient
    .delete(`/posts/${postId}/comments/${commentId}`)
    .then((res) => res.data);

export const toggleLikeComment = (postId, commentId) =>
  axiosClient
    .put(`/posts/${postId}/comments/${commentId}/like`)
    .then((res) => res.data);

export const getReplies = (postId, commentId, page = 1, limit = 20) =>
  axiosClient
    .get(`/posts/${postId}/comments/${commentId}/replies`, {
      params: { page, limit },
    })
    .then((res) => res.data);

export const createReply = (postId, commentId, { text, image }) => {
  const formData = new FormData();
  if (text) formData.append('content', text);
  if (image) formData.append('image', image);
  return axiosClient
    .post(`/posts/${postId}/comments/${commentId}/replies`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};
