'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import { uploadData } from 'aws-amplify/storage';
import { type Schema } from '@/amplify/data/resource';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const client = generateClient<Schema>();

const memorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
  cost: z.number().min(0).optional(),
  location: z.string().optional(),
});

type MemoryFormValues = z.infer<typeof memorySchema>;

interface AddMemoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any; 
}

export default function AddMemoryForm({ open, onOpenChange, initialData }: AddMemoryFormProps) {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<MemoryFormValues>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      cost: 0,
      title: '',
      date: '',
      description: '',
      location: ''
    }
  });

  useEffect(() => {
    if (open) {
      reset(initialData ? {
        title: initialData.title,
        description: initialData.description,
        date: initialData.date,
        cost: initialData.cost,
        location: initialData.location,
      } : {
        title: '',
        date: '',
        description: '',
        cost: 0,
        location: '',
      });
      setExistingImages(initialData?.images || []); 
      setNewFiles([]);
      setFilePreviews([]);
    }
  }, [open, initialData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setFilePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExisting = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: MemoryFormValues) => {
    setIsSubmitting(true);

    try {
      let imagePaths: string[] = [...existingImages];

      for (const file of newFiles) {
        const path = `media/memories/${Date.now()}-${file.name}`;
        await uploadData({
          path,
          data: file,
        }).result;
        imagePaths.push(path);
      }

      if (initialData) {
         await client.models.Memory.update({
          id: initialData.id,
          title: data.title,
          description: data.description || '',
          date: data.date,
          cost: data.cost || 0,
          location: data.location || '',
          images: imagePaths,
        });
      } else {
        await client.models.Memory.create({
          title: data.title,
          description: data.description || '',
          date: data.date,
          cost: data.cost || 0,
          location: data.location || '',
          images: imagePaths,
        });
      }

      console.log('Memory saved successfully!');
      reset();
      setNewFiles([]);
      setFilePreviews([]);
      onOpenChange(false);
      window.location.reload(); 
    } catch (error) {
      console.error('Error saving memory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card bg-black/80 backdrop-blur-xl border-white/10 text-white sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {initialData ? 'Edit Memory ✏️' : 'Add New Memory ✨'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div>
            <label className="block text-white/80 text-sm mb-1 font-medium">Title</label>
            <input 
              {...register('title')}
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
              placeholder="e.g. Dinner at..."
            />
            {errors.title && <p className="text-red-300 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1 font-medium">Date</label>
            <input 
              type="date" 
              {...register('date')}
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
            />
            {errors.date && <p className="text-red-300 text-xs mt-1">{errors.date.message}</p>}
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1 font-medium">Description</label>
            <textarea 
              {...register('description')}
              className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all h-24 resize-none"
              placeholder="How did it feel...?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-1 font-medium">Cost (VND)</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="1000"
                  {...register('cost', { valueAsNumber: true })}
                  className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all pl-8"
                  placeholder="0"
                />
                <span className="absolute left-3 top-3 text-white/50 text-xs">₫</span>
              </div>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1 font-medium">Location(s)</label>
              <input 
                {...register('location')}
                className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/30 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all"
                placeholder="Place A, Place B..."
              />
              <p className="text-[10px] text-white/40 mt-1">Separate multiple places with commas</p>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2 font-medium">Photos</label>
            
            {/* Recent/Existing Files Grid */}
            {(existingImages.length > 0 || filePreviews.length > 0) && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {initialData?.imageUrls && existingImages.map((path, i) => {
                   return (
                    <div key={`exist-${i}`} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                      <div className="w-full h-full bg-white/5 flex items-center justify-center text-xs text-white/50">
                         <i className="fas fa-image text-2xl"></i>
                      </div> 
                       {initialData.imageUrls && initialData.imageUrls[i] && (
                          <img src={initialData.imageUrls[i]} alt="existing" className="absolute inset-0 w-full h-full object-cover" />
                       )}
                      <button 
                        type="button"
                        onClick={() => removeExisting(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                   )
                })}

                {filePreviews.map((src, i) => (
                  <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-white/20 border-dashed rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <i className="fas fa-cloud-upload-alt text-2xl text-pink-300 mb-2"></i>
                <p className="text-sm text-white/70">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-white/50">{newFiles.length} new files selected</p>
              </div>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                className="hidden" 
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="flex-1 py-3 px-4 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <i className="fas fa-spinner fa-spin mr-2"></i> Saving...
                </span>
              ) : 'Save Memory'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
