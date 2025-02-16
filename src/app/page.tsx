"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";

interface Caption {
  text: string;
  start: number;
  end: number;
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [newCaption, setNewCaption] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [currentCaption, setCurrentCaption] = useState<Caption | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const convertToSeconds = (time: string) => {
    const match = time.match(/^([0-5]?\d):([0-5]?\d)$/);
    return match ? parseInt(match[1]) * 60 + parseInt(match[2]) : null;
  };

  const addCaption = () => {
    const start = convertToSeconds(startTime);
    const end = convertToSeconds(endTime);
    if (newCaption.trim() && start !== null && end !== null && start < end) {
      setCaptions([...captions, { text: newCaption, start, end }]);
      setNewCaption(""), setStartTime(""), setEndTime("");
    }
  };

  useEffect(() => {
    const updateCaption = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        setCurrentCaption(
          captions.find((c) => currentTime >= c.start && currentTime <= c.end) || null
        );
      }
    };
    videoRef.current?.addEventListener("timeupdate", updateCaption);
    return () => videoRef.current?.removeEventListener("timeupdate", updateCaption);
  }, [captions]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const resetVideo = () => {
    setVideoUrl(""), setCaptions([]), setNewCaption(""), setStartTime(""), setEndTime("");
    setCurrentCaption(null);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
      <Card className="max-w-md w-full p-6 bg-gray-900 text-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">Set up your captions</h2>
        <Input
          placeholder="Enter video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="bg-gray-800 text-white border-gray-700"
        />
        {videoUrl && (
          <>
            <div className="relative mt-4 w-full max-w-lg">
              <video
                ref={videoRef}
                controls
                className="w-full rounded-lg shadow-lg border-2 border-gray-700"
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
              {currentCaption && (
                <p className="absolute bottom-10 w-full text-center text-white bg-black bg-opacity-50 p-2 rounded-lg">
                  {currentCaption.text}
                </p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="bg-gray-700" onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</Button>
              <Button className="bg-gray-700" onClick={restartVideo}>Restart</Button>
              <Button className="bg-gray-700" onClick={resetVideo}>Reset</Button>
            </div>
          </>
        )}
        <div className="flex justify-between items-center gap-2 mt-4">
          <Input
            placeholder="Start time (mm:ss)"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="bg-gray-800 text-white border-gray-700"
          />
          <Input
            placeholder="End time (mm:ss)"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>
        <Textarea
          placeholder="Enter caption"
          value={newCaption}
          onChange={(e) => setNewCaption(e.target.value)}
          className="bg-gray-800 text-white border-gray-700 mt-2"
          rows={4}
        />
        <Button className="bg-gray-700 mt-4 w-full" onClick={addCaption}>
          Add Caption
        </Button>
      </Card>
    </div>
  );
}