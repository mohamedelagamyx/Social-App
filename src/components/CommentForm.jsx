import { useState } from 'react';

export default function CommentForm({ onSubmit, placeholder = 'Write a comment…', autoFocus }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({ text: text.trim() });
      setText('');
    } catch (err) {
      setError(err.message || 'Could not send the comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      {error && <div className="form-error-banner">{error}</div>}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={1}
        aria-label="Write a comment"
      />
      <button type="submit" className="btn btn-secondary btn-sm" disabled={submitting} aria-label="Send comment">
        {submitting ? '…' : 'Send'}
      </button>
    </form>
  );
}
