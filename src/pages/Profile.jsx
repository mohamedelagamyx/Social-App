import { useCallback, useEffect, useRef, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import * as usersApi from '../api/usersApi';
import * as postsApi from '../api/postsApi';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import Avatar from '../components/Avatar';
import Loader from '../components/Loader';
import {
  getId,
  getUserName,
  getUserHandle,
  getUserPhoto,
  extractList,
} from '../utils/normalize';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const currentUserId = getId(user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const loadMyPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await postsApi.getFeed('me', 1, 30);
      setPosts(extractList(res.data, ['posts', 'docs', 'items']));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyPosts();
  }, [loadMyPosts]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const res = await usersApi.uploadProfilePhoto(file);
      const updated = res.data || { ...user, photo: URL.createObjectURL(file) };
      updateUser(updated);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdatePost = async ({ body, image, removeImage }) => {
    const postId = getId(editingPost);
    const res = await postsApi.updatePost(postId, { body, image, removeImage });
    setPosts((prev) => prev.map((p) => (getId(p) === postId ? res.data : p)));
    setEditingPost(null);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    await postsApi.deletePost(postId);
    setPosts((prev) => prev.filter((p) => getId(p) !== postId));
  };

  const handleToggleLike = async (postId) => {
    setPosts((prev) => prev.map((post) => {
      if (getId(post) !== postId) return post;
      const likes = post.likes || [];
      const liked = likes.includes(currentUserId);
      return { ...post, likes: liked ? likes.filter((id) => id !== currentUserId) : [...likes, currentUserId] };
    }));
    try {
      await postsApi.toggleLikePost(postId);
    } catch {
      loadMyPosts();
    }
  };

  const handleToggleBookmark = async (postId) => {
    setPosts((prev) => prev.map((post) => (
      getId(post) === postId ? { ...post, bookmarked: !post.bookmarked } : post
    )));
    try {
      await postsApi.toggleBookmarkPost(postId);
    } catch {
      loadMyPosts();
    }
  };

  const handleShare = async (postId) => {
    try {
      const res = await postsApi.sharePost(postId);
      setPosts((prev) => [res.data, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page">
      <section className="profile-hero" aria-labelledby="profile-heading">
        <div className="profile-identity-row">
          <div className="profile-avatar-wrap">
            <Avatar
              src={getUserPhoto(user)}
              name={getUserName(user)}
              className="profile-avatar"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
          </div>
          <div className="profile-identity-copy">
            <p className="profile-eyebrow">Your profile</p>
            <h1 className="profile-name" id="profile-heading">{getUserName(user)}</h1>
            {getUserHandle(user) && <p className="profile-handle">@{getUserHandle(user)}</p>}
            {user?.email && (
              <span className="profile-email"><MailOutlineOutlinedIcon fontSize="small" />{user.email}</span>
            )}
          </div>
          <button
            className="profile-edit-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
          >
            <EditOutlinedIcon fontSize="small" />
            <span>{uploadingPhoto ? 'Uploading' : 'Edit photo'}</span>
          </button>
        </div>
      </section>

      <div className="profile-posts-heading" id="posts">
        <div>
          <p className="profile-eyebrow">Your activity</p>
          <h2>Your posts</h2>
        </div>
      </div>

      {editingPost && (
        <div className="post-card" style={{ paddingLeft: '1.25rem' }}>
          <PostForm
            initialBody={editingPost.body || editingPost.text || ''}
            initialImageUrl={editingPost.image || null}
            onSubmit={handleUpdatePost}
            onCancel={() => setEditingPost(null)}
            submitLabel="Save changes"
            busyLabel="Saving…"
          />
        </div>
      )}

      {loading && <Loader label="Loading your posts…" />}
      {!loading && error && <div className="form-error-banner">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="empty-state">
          <h3>No posts yet</h3>
          <p>Anything you post will show up here.</p>
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="feed">
          {posts.map((post, index) => (
            <PostCard
              key={getId(post) || `post-${index}`}
              post={post}
              currentUserId={currentUserId}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              onShare={handleShare}
              onEdit={setEditingPost}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
}
