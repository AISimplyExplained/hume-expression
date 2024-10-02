"use client"
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EmotionName, emotions } from '@/lib/types';
import { supabase } from '@/lib/utilities/supabase';
import { Point } from '@/lib/types';
import { EmotionMap } from '@/lib/data/emotion';

interface Props {
  emotionMap: EmotionMap | null
  engagementHistory: Point[]
  setEngagementHistory: React.Dispatch<React.SetStateAction<Point[]>>
}

export const colors = [
  { color: "#000", emotion: "Neutral" },
  { color: "#c66a26", emotion: "Confusion" },
  { color: "#998644", emotion: "Doubt" },
  { color: "#336cff", emotion: "Concentration" },
  { color: "#a9cce1", emotion: "Interest" },
  { color: "#a4a4a4", emotion: "Boredom" },
  { color: "#006c7c", emotion: "Disappointment" },
  { color: "#a9cce1", emotion: "Calmness" },
  { color: "#ffd600", emotion: "Joy" },
];

// @ts-ignore
const CustomizedDot = (props: any) => {
  const { cx, cy, payload } = props;
  const scaleFactor = Math.min(window.innerWidth / 1920, 1);

  let size = 0;

  if (payload.score <= 0.1) {
    size = 5;
  } else if (payload.score <= 0.2) {
    size = 15;
  } else if (payload.score <= 0.3) {
    size = 25;
  } else if (payload.score <= 0.4) {
    size = 35;
  } else if (payload.score <= 0.5) {
    size = 40;
  } else if (payload.score <= 0.6) {
    size = 45;
  } else if (payload.score <= 0.7) {
    size = 50;
  } else if (payload.score <= 0.8) {
    size = 55;
  } else if (payload.score <= 0.9) {
    size = 60;
  } else {
    size = 65;
  }

  // Adjust size by scaling factor
  size = size * scaleFactor;

  let color = "hsl(210, 70%, 50%)";
  colors.forEach((val) => {
    if (val.emotion === payload.emotion) {
      color = val.color;
    }
  });

  return (
    <g>
      {/* Outer circle with less opacity */}
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={color}
        fillOpacity={0.5}
      />
      {/* Inner circle with full opacity */}
      <circle
        cx={cx}
        cy={cy}
        r={6 * scaleFactor} // Inner circle scaled accordingly
        fill={color}
        stroke="white"
        strokeWidth={1 * scaleFactor} // Adjust stroke width as well
      />
    </g>
  );
};
const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const emotion = payload.value;
  const color = colors.find(c => c.emotion === emotion)?.color || "#000";

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-20} y={4} dy={0} textAnchor="end" className='text-xs lg:text-sm'>
        {emotion}
      </text>
      <circle cx={-10} cy={0} r={6} className='scale-50 lg:scale-100' fill={color} />
    </g>
  );
};


const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const emotionColor = colors.find(c => c.emotion === data.emotion)?.color || "#000";
    
    return (
      <div className="relative bg-white p-2 sm:p-3 border border-gray-200 rounded-md shadow-md text-xs sm:text-sm md:text-base">
        <p className="font-bold text-sm sm:text-base md:text-lg" style={{ color: emotionColor }}>
          {`${data.emotion} intensity: ${(data.score * 100).toFixed(0)}%`}
        </p>

        {/* Triangle pointer */}
        <div className="absolute w-0 h-0 left-1/2 -translate-x-1/2 bottom-[-8px] sm:bottom-[-10px] 
          border-l-[8px] border-r-[8px] border-t-[8px] 
          sm:border-l-[10px] sm:border-r-[10px] sm:border-t-[10px] 
          border-t-white border-l-transparent border-r-transparent">
        </div>
      </div>
    );
  }
  return null;
};

const insertData = async ({ date, emotion, score }: { date: string, emotion: string, score: number }) => {
  const { data, error } = await supabase
    .from('graph')
    .insert([
      {
        date: date,
        emotion: emotion,
        score: score
      }
    ]);

  if (error) {
    console.error('Error inserting data:', error);
  }
}

export default function ExpressionGraph({ engagementHistory }: Props) {

  
  
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setEngagementHistory(prevData => {
  //       if (sortedEmotion.length === 0) {
  //         return prevData;
  //       }

  //       let selectedEmotion: Point | null = null;

  //       for (let i = 0; i < sortedEmotion.length; i++) {
  //         const emotion = sortedEmotion[i].emotion;
  //         for (let j = 0; j < emotions.length; j++) {
  //           if (emotion === emotions[j]) {
  //             const date = new Date().toLocaleTimeString()
  //             selectedEmotion = {
  //               time: date,
  //               emotion: sortedEmotion[i].emotion as EmotionName,
  //               score: sortedEmotion[i].score
  //             }
  //             insertData({
  //               date: date,
  //               emotion: selectedEmotion.emotion,
  //               score: selectedEmotion.score
  //             }).then(() => { })
  //             break;
  //           }
  //         }
  //         if (selectedEmotion) {
  //           break;
  //         }
  //       }

  //       if (!selectedEmotion) {
  //         return prevData;
  //       }
  //       console.log(selectedEmotion)
  //       const newData = [...prevData, selectedEmotion];
  //       return newData.slice(-8);
  //     });
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [sortedEmotion]);

  return (
    <Card className="font-sans w-full h-full border-none">
      {/* <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-800">Emotion Flow Visualization</CardTitle>
      </CardHeader> */}
      {/* <CardContent className="w-full h-full"> */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={engagementHistory.slice(-8)} 
              margin={{ top: 20, right: 20, bottom: 10, left: 35 }}>
            <CartesianGrid strokeDasharray="5 5" horizontal={true} vertical={false} />
              <XAxis
                dataKey="date"
                type="category"
                interval="preserveStartEnd"
                className='text-xs lg:text-sm'
                padding={{ left: 60, right: 60 }}
              />
              <YAxis
                type="category"
                dataKey="emotion"
                domain={emotions}
                stroke="#888888"
                tick={<CustomYAxisTick />}
                width={100}
              />
              <Tooltip offset={-114} content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="emotion"
                stroke="hsl(210, 60%, 50%)"
                strokeWidth={2}
                dot={<CustomizedDot />}
                isAnimationActive={false}
              />
            </LineChart>
        </ResponsiveContainer>
      {/* </CardContent> */}
    </Card>
  );

}