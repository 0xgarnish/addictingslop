import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bubble Trouble - Addicting Slop',
  description: 'Pop the bubbles! A classic arcade game.',
};

export default function BubbleTroubleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
