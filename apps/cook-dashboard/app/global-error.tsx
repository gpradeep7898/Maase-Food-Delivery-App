'use client';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', padding: '2rem', background: '#fdf6ec' }}>
        <h2 style={{ color: '#5C3A21' }}>Something went wrong</h2>
        <pre style={{
          background: '#fff',
          border: '1px solid #f4a300',
          borderRadius: 8,
          padding: '1rem',
          fontSize: 13,
          overflowX: 'auto',
          color: '#c0392b',
        }}>
          {error?.message ?? 'Unknown error'}
          {'\n\n'}
          {error?.stack ?? ''}
        </pre>
        <p style={{ color: '#888', fontSize: 12 }}>Digest: {error?.digest}</p>
      </body>
    </html>
  );
}
