import { useState } from 'react';

export default function PostForm({
  initialBody = '',
  initialImageUrl = null,
  onSubmit,
  onCancel,
  submitLabel = 'Post',
  busyLabel = 'Posting…',
}) {
  const [body, setBody] = useState(initialBody);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) {
      setError('Write something before posting.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ body: body.trim() });
    } catch (err) {
      setError(err.message || 'Could not save this post.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error-banner">{error}</div>}
      <div className="field">
        <label htmlFor="post-body">What's on your mind?</label>
        <textarea
          id="post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share an update with the board…"
        />
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.4rem' }}>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? busyLabel : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
