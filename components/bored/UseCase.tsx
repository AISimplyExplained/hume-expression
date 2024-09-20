import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ThumbsDown, ThumbsUp, X } from "lucide-react";
import { ExplorationOptionType } from "@/lib/types";
import { DialogDescription, DialogTitle } from "../ui/dialog";
import { shuffleArray } from "@/lib/shuffleArray";

interface Props {
  topic: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setBoredTime: React.Dispatch<React.SetStateAction<number>>;
  setExploreOpt: Dispatch<SetStateAction<ExplorationOptionType>>;
}

export default function UseCase({
  setIsOpen,
  topic,
  setBoredTime,
  setExploreOpt,
}: Props) {
  const [uses, setUses] = useState<string[]>([]);

  const getRes = async () => {
    setUses([]);
    try {
      const res = await fetch("/api/use-case", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topic }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const points = data.res.points as string[]
      const shuffle = shuffleArray(points).slice(0, Math.min(4, points.length));
      setUses(shuffle);
      console.log("Res", data.res.points)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (uses.length === 0) {
      getRes();
    }
  }, []);

  return (
    <div className="p-1">
      <DialogTitle className="text-2xl font-bold text-center text-gray-800 mb-4">
        Real-world Application
      </DialogTitle>
      <DialogDescription></DialogDescription>
      <h1 className="text-xl font-semibold text-center text-blue-600 mb-4">
        {topic}
      </h1>

      {uses.length <= 0 ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {uses.map((val, i) => (
              <li key={i + "val"} className="pl-2 text-lg">
                {val}
              </li>
            ))}
          </ul>
          <div className=" flex justify-around mt-4">
            <Button
              onClick={() => {
                setExploreOpt("");
              }}
            >
              <ThumbsDown className="w-6 h-6 text-white outline-none border-none" />
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false);
                setBoredTime(0);
              }}
            >
              <ThumbsUp className="w-6 h-6 text-white outline-none border-none" />
            </Button>
          </div>
          {/* <Button className="w-full mt-4" onClick={getRes}>
            New Use Case
          </Button> */}
        </>
      )}
    </div>
  );
}
