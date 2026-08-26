import { useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Avatar from './Avatar';
import {
  getId,
  getUserName,
  getUserPhoto,
  formatRelativeTime,
  getCreatedAt,
  pick,
} from '../utils/normalize';

export default function CommentItem({
  comment,
  postId,
  currentUserId,
  postOwnerId,
  onEdit,
  onDelete,
}) {
  const commentId = getId(comment);
  const author = pick(comment, ['user', 'owner', 'author', 'createdBy', 'commentCreator']);
  const authorId = getId(author);
  const isOwner = currentUserId && authorId && currentUserId === authorId;
  const canDelete = isOwner || (currentUserId && postOwnerId && currentUserId === postOwnerId);
  const text = pick(comment, ['text', 'body', 'content'], '');
  const image = pick(comment, ['image', 'imageUrl'], null);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  const handleSaveEdit = async () => {
    if (!draft.trim()) return;
    await onEdit(commentId, draft.trim());
    setEditing(false);
  };

  return (
    <div className="comment-item">
      <div className="comment-avatar">
        <Avatar
          src={getUserPhoto(author)}
          name={getUserName(author)}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div className="comment-bubble">
          <div className="comment-author-row">
            <span className="comment-author">{getUserName(author)}</span>
            <span className="comment-time">{formatRelativeTime(getCreatedAt(comment))}</span>
          </div>

          {editing ? (
            <div style={{ marginTop: '0.35rem' }}>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem' }}
                rows={2}
                aria-label="Edit comment"
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveEdit}>
                  Save
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {text && <p className="comment-text">{text}</p>}
              {image && (
                <img
                  src={image}
                  alt="Comment attachment"
                  className="comment-image"
                  loading="lazy"
                  width={720}
                  height={420}
                />
              )}
            </>
          )}
        </div>

        {!editing && (
          <div className="comment-meta-row">
            {isOwner && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(true)} aria-label="Edit comment">
                <EditOutlinedIcon fontSize="small" />
                <span>Edit</span>
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(commentId)}
                aria-label="Delete comment"
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
