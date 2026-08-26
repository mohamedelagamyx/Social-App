import { useEffect, useState } from 'react';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as postsApi from '../api/postsApi';
import * as commentsApi from '../api/commentsApi';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import CommentForm from '../components/CommentForm';
import CommentItem from '../components/CommentItem';
import Loader from '../components/Loader';
import { getId, getPostOwner, extractList } from '../utils/normalize';

export default function PostDetails() {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = getId(user);
  const passedPost = location.state?.post;

  const [post, setPost] = useState(passedPost || null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(!passedPost);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(false);

  const load = async () => {
    setError('');
    // Only fetch the post itself if we didn't already get it from the
    // feed via router state (e.g. on a hard refresh or a shared link).
    if (!passedPost) setLoading(true);
    try {
      const requests = [commentsApi.getComments(postId, 1, 50)];
      if (!passedPost) requests.unshift(postsApi.getPostById(postId));

      if (passedPost) {
        const [commentsRes] = await Promise.all(requests);
        setComments(extractList(commentsRes.data, ['comments', 'docs', 'items']));
      } else {
        const [postRes, commentsRes] = await Promise.all(requests);
        setPost(postRes.data);
        setComments(extractList(commentsRes.data, ['comments', 'docs', 'items']));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const postOwnerId = getId(getPostOwner(post));

  const handleToggleLike = async () => {
    setPost((currentPost) => {
      const likes = currentPost.likes || [];
      const liked = likes.includes(currentUserId);
      return { ...currentPost, likes: liked ? likes.filter((id) => id !== currentUserId) : [...likes, currentUserId] };
    });
    try {
      await postsApi.toggleLikePost(postId);
    } catch {
      load();
    }
  };

  const handleToggleBookmark = async () => {
    setPost((currentPost) => ({ ...currentPost, bookmarked: !currentPost.bookmarked }));
    try {
      await postsApi.toggleBookmarkPost(postId);
    } catch {
      load();
    }
  };

  const handleShare = async () => {
    try {
      await postsApi.sharePost(postId);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdatePost = async ({ body, image, removeImage }) => {
    const res = await postsApi.updatePost(postId, { body, image, removeImage });
    setPost(res.data);
    setEditingPost(false);
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    await postsApi.deletePost(postId);
    navigate('/');
  };

  const handleAddComment = async ({ text, image }) => {
    const res = await commentsApi.createComment(postId, { text, image });
    setComments((prev) => [res.data?.comment || res.data, ...prev]);
  };

  const handleEditComment = async (commentId, text) => {
    const res = await commentsApi.updateComment(postId, commentId, { text });
    const updatedComment = res.data?.comment || res.data;
    setComments((prev) =>
      prev.map((c) => (getId(c) === commentId ? updatedComment : c))
    );
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    await commentsApi.deleteComment(postId, commentId);
    setComments((prev) => prev.filter((c) => getId(c) !== commentId));
  };

  if (loading) return <Loader label="Loading post…" />;

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowBackOutlinedIcon fontSize="small" />
        <span>Back</span>
      </button>

      {error && <div className="form-error-banner">{error}</div>}

      {post && !editingPost && (
        <PostCard
          post={post}
          currentUserId={currentUserId}
          onToggleLike={handleToggleLike}
          onToggleBookmark={handleToggleBookmark}
          onShare={handleShare}
          onEdit={() => setEditingPost(true)}
          onDelete={handleDeletePost}
          linkToDetails={false}
        />
      )}

      {post && editingPost && (
        <div className="post-card" style={{ paddingLeft: '1.25rem' }}>
          <PostForm
            initialBody={post.body || post.text || ''}
            initialImageUrl={post.image || null}
            onSubmit={handleUpdatePost}
            onCancel={() => setEditingPost(false)}
            submitLabel="Save changes"
            busyLabel="Saving…"
          />
        </div>
      )}

      <div className="comment-list">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          Comments {comments.length > 0 ? `(${comments.length})` : ''}
        </h3>

        <CommentForm onSubmit={handleAddComment} />

        {comments.length === 0 ? (
          <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>
            No comments yet — start the conversation.
          </p>
        ) : (
          comments.map((comment, index) => (
            <CommentItem
              key={getId(comment) || `comment-${index}`}
              comment={comment}
              postId={postId}
              currentUserId={currentUserId}
              postOwnerId={postOwnerId}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
}
