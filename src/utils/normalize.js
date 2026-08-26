export function pick(obj, keys, fallback = undefined) {
  if (!obj) return fallback;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return obj[key];
    }
  }
  return fallback;
}

export function getId(entity) {
  return pick(entity, ['_id', 'id', 'postId', 'commentId']);
}

export function getUserName(user) {
  return pick(user, ['name', 'username', 'fullName'], 'Someone');
}

export function getUserHandle(user) {
  return pick(user, ['username', 'handle'], '');
}

export function getUserPhoto(user) {
  return pick(user, ['photo', 'profileImage', 'avatar', 'image'], null);
}

export function getPostOwner(post) {
  return pick(post, ['user', 'owner', 'author', 'createdBy']);
}

export function getPostImage(post) {
  return pick(post, ['image', 'imageUrl', 'photo'], null);
}

export function getPostBody(post) {
  return pick(post, ['body', 'text', 'content'], '');
}

export function getLikesArray(entity) {
  return pick(entity, ['likes', 'likedBy'], []) || [];
}

export function isLikedByUser(entity, userId) {
  const likes = getLikesArray(entity);
  if (!Array.isArray(likes)) return false;
  return likes.some((like) => {
    if (typeof like === 'string') return like === userId;
    return getId(like) === userId;
  });
}

export function getCreatedAt(entity) {
  return pick(entity, ['createdAt', 'created_at', 'date'], null);
}

export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 60) return 'just now';
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function extractList(payload, hintKeys = []) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  for (const key of hintKeys) {
    if (Array.isArray(payload[key])) return payload[key];
  }
  for (const value of Object.values(payload)) {
    if (Array.isArray(value)) return value;
  }
  return [];
}
