'use client';

import LoveHeader from './LoveHeader';
import TimeCounters from './TimeCounters';
import MemoriesGallery from './MemoriesGallery';
import Milestones from './Milestones';
import SocialFollow from './SocialFollow';

interface MainPageProps {
  startDate: Date;
  nextMilestoneDate: Date;
  images: string[];
}

export default function MainPage({ startDate, nextMilestoneDate, images }: MainPageProps) {
  return (
    <div className="container mx-auto px-4 py-8 relative z-10 animate-fade-in-up text-white">
      <LoveHeader />

      <main className="max-w-5xl mx-auto space-y-16">
        <TimeCounters startDate={startDate} />
        <MemoriesGallery images={images} />
        <Milestones nextMilestoneDate={nextMilestoneDate} />
        <SocialFollow />
      </main>

      <footer className="text-center mt-16 pb-8 text-white/80">
        <p>Made with <i className="fas fa-heart text-red-500 animate-pulse"></i> for Thu Hà</p>
      </footer>
    </div>
  );
}
