import { Link } from 'react-router-dom';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Avatar from './Avatar';
import {
  getId,
  getPostOwner,
  getUserName,
  getUserPhoto,
  getPostImage,
  getPostBody,
  getCreatedAt,
  formatRelativeTime,
  isLikedByUser,
  getLikesArray,
} from '../utils/normalize';

export default function PostCard({
  post,
  currentUserId,
  onEdit,
  onDelete,
  onToggleLike,
  onToggleBookmark,
  onShare,
  commentCount,
  linkToDetails = true,
}) {
  const postId = getId(post);
  const owner = getPostOwner(post);
  const ownerId = getId(owner);
  const isOwner = currentUserId && ownerId && currentUserId === ownerId;
  const liked = isLikedByUser(post, currentUserId);
  const bookmarked = Boolean(post.bookmarked || post.isBookmarked);
  const likeCount = getLikesArray(post)?.length || post.likesCount || 0;
  const image = getPostImage(post);
  const bodyText = getPostBody(post);

  const Body = (
    <>
      <div className="post-head">
        <span className="post-author">{getUserName(owner)}</span>
        <span className="post-time">{formatRelativeTime(getCreatedAt(post))}</span>
      </div>
      {bodyText && <p className="post-body">{bodyText}</p>}
      {image && (
        <img
          src={image}
          alt="Post attachment"
          className="post-image"
          loading="lazy"
          width={720}
          height={420}
        />
      )}
    </>
  );

  return (
    <article className="post-card">
      <div className="post-pin">
        <Avatar
          src={getUserPhoto(owner)}
          name={getUserName(owner)}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {linkToDetails ? (
        <Link to={`/posts/${postId}`} state={{ post }} style={{ display: 'block', color: 'inherit' }}>
          {Body}
        </Link>
      ) : (
        Body
      )}

      <div className="post-actions">
        <button
          type="button"
          className={`post-action${liked ? ' liked' : ''}`}
          onClick={() => onToggleLike?.(postId)}
          aria-label={liked ? 'Unlike post' : 'Like post'}
        >
          {liked ? <FavoriteOutlinedIcon fontSize="small" /> : <FavoriteBorderOutlinedIcon fontSize="small" />}
          <span>{likeCount > 0 ? likeCount : 'Like'}</span>
        </button>
        {linkToDetails ? (
          <Link to={`/posts/${postId}`} state={{ post }} className="post-action">
            <CommentOutlinedIcon fontSize="small" />
            <span>{commentCount !== undefined ? commentCount : 'Comment'}</span>
          </Link>
        ) : (
          <span className="post-action">
            <CommentOutlinedIcon fontSize="small" />
            <span>{commentCount ?? ''}</span>
          </span>
        )}
        <button
          type="button"
          className={`post-action${bookmarked ? ' bookmarked' : ''}`}
          onClick={() => onToggleBookmark?.(postId)}
          aria-label={bookmarked ? 'Unsave post' : 'Save post'}
        >
          {bookmarked ? <BookmarkOutlinedIcon fontSize="small" /> : <BookmarkBorderOutlinedIcon fontSize="small" />}
          <span>{bookmarked ? 'Saved' : 'Save'}</span>
        </button>
        {onShare && (
          <button type="button" className="post-action" onClick={() => onShare(postId)} aria-label="Share post">
            <ShareOutlinedIcon fontSize="small" />
            <span>Share</span>
          </button>
        )}
        {isOwner && (onEdit || onDelete) && (
          <span className="post-owner-menu">
            {onEdit && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(post)} aria-label="Edit post">
                <EditOutlinedIcon fontSize="small" />
                <span>Edit</span>
              </button>
            )}
            {onDelete && (
              <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(postId)} aria-label="Delete post">
                <DeleteOutlineOutlinedIcon fontSize="small" />
                <span>Delete</span>
              </button>
            )}
          </span>
        )}
      </div>
    </article>
  );
}
