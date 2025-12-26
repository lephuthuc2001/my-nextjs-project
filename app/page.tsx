'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './love-story.css';
import MainPage from '@/app/components/MainPage';
import { getUrl } from 'aws-amplify/storage';
import { useState, useEffect } from 'react';

export default function LoveStory() {
  const startDate = new Date('2025-07-01T00:00:00');
  const nextMilestoneDate = new Date('2026-01-01T00:00:00');

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const imagePaths = [
        'media/img/thuhaphuthuc1.jpg',
        'media/img/thuhaphuthuc2.jpg',
        'media/img/z7042330849323_207ac349674544b234c66d23ac13edab.jpg',
        'media/img/z7042330752446_54830a242bddacb88c3f661c27e97ad4.jpg',
        'media/img/z7009844772256_e508e44b18834a47a9cde6feabaa6ef9.jpg',
        'media/img/z7009844806378_8aaea5f609fd24909c54f10802df55d3.jpg',
        'media/img/z7009844756980_804c0253bc94f68291d04bffa62cb4a9.jpg',
        'media/img/z7007306627913_29d7656ae33e30ce5829a69d809653b5.jpg',
        'media/img/z7008123793908_afefd62fedef050cfa34227d737776b9.jpg',
      ];
      
      try {
        console.log('Attempting to fetch images from path:', imagePaths[0]);
        const urls = await Promise.all(
          imagePaths.map(async (path) => {
            try {
              const result = await getUrl({ path });
              console.log(`Fetched URL for ${path}:`, result.url.toString());
              return result.url.toString();
            } catch (innerError) {
              console.error(`Failed to get URL for ${path}`, innerError);
              return ''; // Return empty string or placeholder on failure
            }
          })
        );
        console.log('All fetched URLs:', urls);
        setImages(urls.filter(url => url !== ''));
      } catch (error) {
        console.error('Critical Error loading images from storage:', error);
      }
    };

    fetchImages();
  }, []);

  const components = {
    Header() {
      return (
        <div className="text-center p-6 pb-2">
          <h1 className="text-4xl font-bold text-[#ff9a9e] drop-shadow-sm" style={{ fontFamily: 'Dancing Script, cursive' }}>
            Love Story
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-light">
            Only for Us
          </p>
        </div>
      );
    },
  };

  return (
    <div className="text-white min-h-screen relative z-10 flex flex-col items-center justify-center p-4">
      <Authenticator hideSignUp={true} components={components}>
        {({ signOut, user }) => (
          <div className="w-full h-full">
            <MainPage 
              startDate={startDate}
              nextMilestoneDate={nextMilestoneDate}
              images={images}
            />
          </div>
        )}
      </Authenticator>
    </div>
  );
}
