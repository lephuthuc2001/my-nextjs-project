'use client';

import { useRef } from 'react';
import { motion } from "motion/react";
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

interface MemoriesGalleryProps {
  images: string[];
}

export default function MemoriesGallery({ images }: MemoriesGalleryProps) {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  )

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl text-white drop-shadow-md mb-2">Our Memories</h2>
        <div className="h-1 w-24 bg-white mx-auto rounded-full opacity-50"></div>
      </div>
      
      <div className="flex justify-center w-full px-4">
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-md lg:max-w-4xl"
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {images.map((img, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="border-none bg-transparent shadow-none">
                    <CardContent className="flex aspect-[3/4] items-center justify-center p-0">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full p-2 glass-card rounded-2xl overflow-hidden"
                      >
                        <img 
                          src={img} 
                          alt={`Memory ${index + 1}`} 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </motion.div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex bg-white/20 hover:bg-white/40 border-none text-white" />
          <CarouselNext className="hidden md:flex bg-white/20 hover:bg-white/40 border-none text-white" />
        </Carousel>
      </div>
    </section>
  );
}
