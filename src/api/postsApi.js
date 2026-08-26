import axiosClient from './axiosClient';

export const getAllPosts = (page = 1, limit = 10) =>
  axiosClient.get('/posts', { params: { page, limit } }).then((res) => res.data);

export const getFeed = (only = 'all', page = 1, limit = 10) =>
  axiosClient
    .get('/posts/feed', { params: { only, page, limit } })
    .then((res) => res.data);

export const getPostById = async (postId) => {
  // No dedicated "GET /posts/:postId" endpoint is documented -- only
  // GET /posts and GET /posts/feed are listed. Try the direct path first
  // (in case it's supported but just undocumented), and if that 404s,
  // fall back to searching the general listing and then the feed.
  try {
    const res = await axiosClient.get(`/posts/${postId}`);
    return res.data;
  } catch (err) {
    if (err.status !== 404) throw err;
  }

  const tryFind = async (fetcher) => {
    const res = await fetcher();
    const list =
      res.data?.data?.posts || res.data?.data?.docs || res.data?.data || [];
    const arr = Array.isArray(list) ? list : [];
    return arr.find((p) => (p._id || p.id) === postId);
  };

  const found =
    (await tryFind(() => axiosClient.get('/posts', { params: { page: 1, limit: 50 } }))) ||
    (await tryFind(() =>
      axiosClient.get('/posts/feed', { params: { only: 'all', page: 1, limit: 50 } })
    ));

  if (!found) {
    throw { message: 'This post could not be found.', status: 404 };
  }
  return { success: true, message: 'success', data: found };
};

export const createPost = ({ body, image }) => {
  const formData = new FormData();
  if (body) formData.append('body', body);
  if (image) formData.append('image', image);
  return axiosClient
    .post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};

export const updatePost = (postId, { body, image, removeImage }) => {
  const formData = new FormData();
  if (body !== undefined) formData.append('body', body);
  if (image) formData.append('image', image);
  if (removeImage) formData.append('removeImage', 'true');
  return axiosClient
    .put(`/posts/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data);
};

export const deletePost = (postId) =>
  axiosClient.delete(`/posts/${postId}`).then((res) => res.data);

export const toggleLikePost = (postId) =>
  axiosClient.put(`/posts/${postId}/like`).then((res) => res.data);

export const getPostLikes = (postId, page = 1, limit = 10) =>
  axiosClient
    .get(`/posts/${postId}/likes`, { params: { page, limit } })
    .then((res) => res.data);

export const toggleBookmarkPost = (postId) =>
  axiosClient.put(`/posts/${postId}/bookmark`).then((res) => res.data);

export const sharePost = (postId) =>
  axiosClient.post(`/posts/${postId}/share`).then((res) => res.data);
