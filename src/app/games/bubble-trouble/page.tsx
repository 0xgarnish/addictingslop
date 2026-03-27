'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with canvas
const BubbleTroubleGame = dynamic(
  () => import('@/components/games/BubbleTrouble/BubbleTroubleGame'),
  { ssr: false }
);

export default function BubbleTroublePage() {
  return <BubbleTroubleGame />;
}
