import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center' }}>
      <div className="empty-state">
        <h3>This note isn't on the board</h3>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to the feed
        </Link>
      </div>
    </div>
  );
}
