export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cork: { DEFAULT: '#f5f5f7', dark: '#e7e7eb' },
        paper: { DEFAULT: '#ffffff', dim: '#f7f7fa', strong: '#f2f2f7' },
        ink: { DEFAULT: '#1d1d1f', soft: '#4a4a4d' },
        muted: '#6e6e73',
        string: { DEFAULT: '#0a84ff', dark: '#005ecb' },
        pin: { DEFAULT: '#5ac8fa', dark: '#48b1e4' },
        good: '#34c759',
        danger: '#ff3b30',
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      boxShadow: {
        pin: '0 8px 18px rgba(10, 132, 255, 0.18)',
        card: '0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        card: '22px',
      },
    },
  },
  plugins: [],
};
