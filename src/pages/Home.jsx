import { useCallback, useEffect, useState } from 'react';
import * as postsApi from '../api/postsApi';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import Loader from '../components/Loader';
import { getId, extractList } from '../utils/normalize';

export default function Home() {
  const { user } = useAuth();
  const currentUserId = getId(user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const loadPosts = useCallback(
    async () => {
      setLoading(true);
      setError('');
      try {
        const res = await postsApi.getAllPosts(1, 20);
        setPosts(extractList(res.data, ['posts', 'docs', 'items']));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleCreate = async ({ body, image }) => {
    const res = await postsApi.createPost({ body, image });
    const newPost = res.data;
    setPosts((prev) => [newPost, ...prev]);
    setShowComposer(false);
  };

  const handleUpdate = async ({ body, image, removeImage }) => {
    const postId = getId(editingPost);
    const res = await postsApi.updatePost(postId, { body, image, removeImage });
    const updated = res.data;
    setPosts((prev) => prev.map((p) => (getId(p) === postId ? updated : p)));
    setEditingPost(null);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await postsApi.deletePost(postId);
      setPosts((prev) => prev.filter((p) => getId(p) !== postId));
    } catch (err) {
      alert(err.message);
    }
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
      loadPosts();
    }
  };

  const handleToggleBookmark = async (postId) => {
    setPosts((prev) => prev.map((post) => (
      getId(post) === postId ? { ...post, bookmarked: !post.bookmarked } : post
    )));
    try {
      await postsApi.toggleBookmarkPost(postId);
    } catch {
      loadPosts();
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
      <h1 className="page-title">The board</h1>
      <p className="page-subtitle">Every post here is pinned and threaded to the next.</p>

      {!showComposer && !editingPost && (
        <button className="btn btn-primary" style={{ marginBottom: '1.5rem' }} onClick={() => setShowComposer(true)}>
          + New post
        </button>
      )}

      {showComposer && (
        <div className="post-card" style={{ paddingLeft: '1.25rem' }}>
          <PostForm
            onSubmit={handleCreate}
            onCancel={() => setShowComposer(false)}
            submitLabel="Pin it"
            busyLabel="Pinning…"
          />
        </div>
      )}

      {editingPost && (
        <div className="post-card" style={{ paddingLeft: '1.25rem' }}>
          <PostForm
            initialBody={editingPost.body || editingPost.text || ''}
            initialImageUrl={editingPost.image || null}
            onSubmit={handleUpdate}
            onCancel={() => setEditingPost(null)}
            submitLabel="Save changes"
            busyLabel="Saving…"
          />
        </div>
      )}

      {loading && <Loader label="Fetching posts…" />}
      {!loading && error && <div className="form-error-banner">{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div className="empty-state">
          <h3>Nothing pinned yet</h3>
          <p>Be the first to post something on the board.</p>
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
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
