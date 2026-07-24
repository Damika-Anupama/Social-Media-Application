import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Pulse — A next-level social network';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#07070b',
          backgroundImage:
            'radial-gradient(at 22% 18%, rgba(124,92,255,0.45), transparent 55%), radial-gradient(at 78% 12%, rgba(61,219,179,0.28), transparent 50%), radial-gradient(at 72% 92%, rgba(255,107,107,0.28), transparent 55%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          color: '#f5f5fa',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, color: '#a7a7b8' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #a18cff, #6435ff 55%, #3ddbb3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 30, height: 30, borderRadius: 9, background: '#07070b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: 8, background: '#3ddbb3' }} />
            </div>
          </div>
          <div style={{ fontSize: 32, color: '#f5f5fa', fontWeight: 600, letterSpacing: -0.5 }}>Pulse</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: -1.5,
              maxWidth: 1000,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            A social network that acts like a city, not a slot machine.
          </div>
          <div style={{ fontSize: 28, color: '#a7a7b8', maxWidth: 900 }}>
            Frontend demonstration · Next.js 16 · React 19 · Tailwind
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 22,
            color: '#6e6e80',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 10, background: '#3ddbb3' }} />
            <div>Live preview — frontend demo</div>
          </div>
          <div>pulse / damika-anupama</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
