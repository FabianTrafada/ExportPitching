/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import { ChartSpline } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

async function getPopularTemplate() {
  const response = await fetch('/api/popular-template');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

function AnimatedCount({ value }: { value: number }) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { duration: 0.7 });
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      motionValue.set(prevValue.current);
      spring.set(prevValue.current);
      motionValue.set(value);
      prevValue.current = value;
    }
  }, [value, motionValue, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return () => unsubscribe();
  }, [spring]);

  return <span>{display}</span>;
}

export default function PopularTemplate() {
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['popularTemplate'],
    queryFn: getPopularTemplate,
    refetchInterval: 5000, // Refetch setiap 5 detik
    retry: 3, // Mencoba ulang 3 kali jika gagal
  });

  // Function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'advanced':
        return 'bg-red-100 text-red-800';
      case 'intermediate':
        return 'bg-orange-100 text-orange-800';
      case 'beginner':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">🔥 Popular Template</h2>
        <Card className="p-4 md:p-6 overflow-hidden">
          <div className="flex flex-col gap-4 md:gap-6">
            <Skeleton className="w-full h-48 md:h-56 rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">🔥 Popular Template</h2>
        <Card className="p-4 md:p-6">
          <div className="text-center text-gray-500">
            Failed to load popular template. Please try again later.
          </div>
        </Card>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">🔥 Popular Template</h2>
        <Card className="p-4 md:p-6">
          <div className="text-center text-gray-500">
            No popular templates found.
          </div>
        </Card>
      </div>
    );
  }
    
  return (
    <div className="mb-6 md:mb-8">
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">🔥 Popular Template</h2>
      {templates.map((template: any) => (
        <Card key={template.id} className="p-4 md:p-6 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Konten di kiri */}
            <div className="flex-1 order-2 md:order-1 flex flex-col justify-between">
              <h3 className="text-lg md:text-xl font-semibold mb-2">About {template.title}</h3>
              <p className="text-sm md:text-base text-gray-600 mb-4">{template.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-xs md:text-sm text-gray-500">Difficulty</h4>
                  <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-xs md:text-sm text-gray-500">Industry</h4>
                  <p className="text-sm md:text-base truncate">{template.industry}</p>
                </div>
                <div>
                  <h4 className="font-medium text-xs md:text-sm text-gray-500">Target Market</h4>
                  <div className="flex items-center gap-2">
                    <Image
                      width={20}
                      height={20}
                      src={`https://flagcdn.com/${template.targetMarketCode.toLowerCase()}.svg`} 
                      alt={template.targetMarket}
                      className="shadow-sm"
                    />
                    <span className="text-sm md:text-base">{template.targetMarket}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-xs md:text-sm text-gray-500">Usage Count</h4>
                  <div className="flex items-center gap-2">
                    <ChartSpline size={16} />
                    <span className="text-sm md:text-base">
                      <AnimatedCount value={template.usageCount} /> times
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Gambar di kanan */}
            <div className="w-full md:w-1/3 h-48 md:h-56 rounded-lg relative overflow-hidden order-1 md:order-2 flex-shrink-0">
              {/* Duration badge */}
              <div className="absolute top-2 right-2 z-10 bg-white px-3 py-1 rounded-full shadow-md text-sm font-medium">
                {template.duration} minutes
              </div>
              {template.imageUrl ? (
                <Image
                  src={template.imageUrl}
                  alt={template.title}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                  <span className="text-gray-400">Image</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}