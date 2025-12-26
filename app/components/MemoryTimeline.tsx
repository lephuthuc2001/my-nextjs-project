'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';
import { type Schema } from '@/amplify/data/resource';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AddMemoryForm from './AddMemoryForm';

const client = generateClient<Schema>();

type MemoryWithUrls = Schema['Memory']['type'] & { imageUrls?: string[] };

export default function MemoryTimeline() {
  const [memories, setMemories] = useState<MemoryWithUrls[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMemory, setEditingMemory] = useState<MemoryWithUrls | null>(null);

  useEffect(() => {
    const sub = client.models.Memory.observeQuery().subscribe({
      next: async ({ items }) => {
        // Sort by date descending (newest first)
        const sortedItems = items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        // Fetch image URLs for each memory
        const itemsWithUrls = await Promise.all(
          sortedItems.map(async (item) => {
            if (item.images && item.images.length > 0) {
              const urls = await Promise.all(
                item.images.map(async (path) => {
                  try {
                    const result = await getUrl({ path: path as string });
                    return result.url.toString();
                  } catch (e) {
                    return null;
                  }
                })
              );
              return { ...item, imageUrls: urls.filter(Boolean) as string[] };
            }
            return { ...item, imageUrls: [] };
          })
        );

        setMemories(itemsWithUrls);
        setIsLoading(false);
      },
      error: (error) => {
        console.error("Error observing memories:", error);
        setIsLoading(false);
      }
    });

    return () => sub.unsubscribe();
  }, []);

  // Helper to group memories
  const groupedMemories = memories.reduce((acc, memory) => {
    const date = new Date(memory.date);
    const year = date.getFullYear().toString();
    const month = date.toLocaleString('default', { month: 'long' });

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    
    acc[year][month].push(memory);
    return acc;
  }, {} as Record<string, Record<string, MemoryWithUrls[]>>);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling if needed
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="space-y-8 pb-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl text-white drop-shadow-md mb-3 script-font">Our Journey</h2>
        <div className="h-1 w-24 bg-white mx-auto rounded-full opacity-50"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {Object.keys(groupedMemories).sort((a, b) => Number(b) - Number(a)).map(year => (
          <div key={year} className="mb-12">
            {/* Year Header */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
              <h3 className="text-3xl md:text-4xl font-bold text-white/90 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                {year}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
            </motion.div>

            <div className="space-y-6">
              {Object.keys(groupedMemories[year]).map(month => (
                <div key={month}>
                  {/* Month Header */}
                  <div className="flex items-center gap-3 mb-4 ml-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span className="text-lg font-semibold text-pink-200 capitalize">{month}</span>
                  </div>

                  {/* Memory Cards */}
                  <div className="space-y-4">
                    {groupedMemories[year][month].map((memory) => (
                      <motion.div
                        layout
                        key={memory.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onClick={(e) => toggleExpand(memory.id, e)}
                        className={`group cursor-pointer bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${
                          expandedId === memory.id ? 'border-pink-400 shadow-pink-500/30' : 'border-white/50'
                        }`}
                      >
                        {/* Card Header with Image */}
                        {memory.imageUrls && memory.imageUrls.length > 0 ? (
                          <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
                            <img 
                              src={memory.imageUrls[0]} 
                              alt={memory.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            
                            {/* Date Badge on Image */}
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/50">
                              <div className="text-center">
                                <div className="text-3xl font-bold text-pink-600 leading-none">{new Date(memory.date).getDate()}</div>
                                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-1">
                                  {new Date(memory.date).toLocaleString('default', { month: 'short' })}
                                </div>
                              </div>
                            </div>

                            {/* Title on Image */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                              <h4 className="text-xl md:text-2xl font-bold drop-shadow-lg line-clamp-2">
                                {memory.title}
                              </h4>
                            </div>
                          </div>
                        ) : (
                          // No Image Layout
                          <div className="relative bg-gradient-to-br from-pink-50 to-purple-50 p-6">
                            <div className="flex items-start gap-4">
                              <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-pink-200">
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-pink-600 leading-none">{new Date(memory.date).getDate()}</div>
                                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-1">
                                    {new Date(memory.date).toLocaleString('default', { month: 'short' })}
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xl md:text-2xl font-bold text-gray-800 line-clamp-2">
                                  {memory.title}
                                </h4>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Card Content */}
                        <div className="p-5 bg-white">
                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            {memory.location && (
                              <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                                <i className="fas fa-map-marker-alt text-pink-500"></i>
                                <span className="font-medium">{memory.location}</span>
                              </div>
                            )}
                            {memory.cost && memory.cost > 0 && (
                              <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                                <i className="fas fa-coins text-green-600"></i>
                                <span className="font-bold">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(memory.cost)}
                                </span>
                              </div>
                            )}
                            <button className="ml-auto text-pink-500 hover:text-pink-600 transition-colors">
                              <i className={`fas ${expandedId === memory.id ? 'fa-chevron-up' : 'fa-chevron-down'} text-lg`}></i>
                            </button>
                          </div>

                          {/* Expanded Content */}
                          <AnimatePresence>
                            {expandedId === memory.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-5 space-y-4 border-t border-gray-100 mt-4">
                                  {memory.description && (
                                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-2xl border border-pink-100">
                                      <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap italic">
                                        "{memory.description}"
                                      </p>
                                    </div>
                                  )}

                                  {/* Image Gallery */}
                                  {memory.imageUrls && memory.imageUrls.length > 1 && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Gallery</h5>
                                      <div className="grid grid-cols-3 gap-2">
                                        {memory.imageUrls.slice(1).map((url, i) => (
                                          <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-white shadow-md hover:shadow-lg transition-shadow">
                                            <img src={url} alt={`${memory.title} ${i + 2}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Edit Button */}
                                  <div className="flex justify-end pt-2">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setEditingMemory(memory); }}
                                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-medium text-sm"
                                    >
                                      <i className="fas fa-edit"></i>
                                      <span>Edit Memory</span>
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/80 rounded-3xl overflow-hidden">
                <Skeleton className="h-48 w-full bg-gray-200" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-gray-200" />
                  <Skeleton className="h-4 w-1/2 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <i className="fas fa-heart text-3xl text-white/60"></i>
            </div>
            <p className="text-white/70 text-lg italic">Ready to start your journey? Add your first memory!</p>
          </div>
        ) : null}
      </div>

      {/* Edit Memory Modal */}
      <AddMemoryForm 
        open={!!editingMemory}
        onOpenChange={(open) => !open && setEditingMemory(null)}
        initialData={editingMemory}
      />
    </section>
  );
}
