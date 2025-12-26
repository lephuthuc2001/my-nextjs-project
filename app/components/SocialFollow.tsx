'use client';

import Script from 'next/script';
import { motion } from "motion/react";

export default function SocialFollow() {
  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <motion.div 
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="glass-card rounded-3xl p-4 md:p-8 max-w-2xl mx-auto overflow-hidden"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-pink-600 mb-6 drop-shadow-sm">
          <i className="fab fa-tiktok mr-2"></i> Follow Our Journey
        </h3>
        <div className="flex justify-center w-full min-h-[400px]">
          <div className="w-full h-full overflow-x-hidden flex justify-center">
            <blockquote 
              className="tiktok-embed" 
              cite="https://www.tiktok.com/@thucvoihane" 
              data-unique-id="thucvoihane" 
              data-embed-type="creator" 
              style={{ width: '100%', maxWidth: '780px', minWidth: '288px' }}
            >
              <section className="bg-white/50 animate-pulse rounded-xl h-[400px] flex items-center justify-center">
                <a target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/@thucvoihane?refer=creator_embed" className="text-pink-500 font-bold">
                  @thucvoihane
                </a>
              </section>
            </blockquote>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
