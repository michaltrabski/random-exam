"use client";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import { textToSlug160 } from "@/helpers/helpers";

import { PlayIcon } from "./PlayIcon";
import { PauseIcon } from "./PauseIcon";

interface Mp3Props {
  text: string;
  autoPlay?: boolean;
  onEndedCallback?: () => void;
}

type Mp3State = "loadeddata" | "playing" | "play" | "pause" | "error" | "ended" | "";
const MP3_FOLDER = `${process.env.NEXT_PUBLIC_MEDIA_LOCATION}mp3/`;

export const Mp3: FC<Mp3Props> = ({ text, autoPlay = false, onEndedCallback }) => {
  const [mp3State, setMp3State] = useState<Mp3State>("");

  const mp3Ref = useRef<HTMLAudioElement | null>(null);

  const handleLoadedData = () => setMp3State(() => "loadeddata");
  const handlePlaying = () => setMp3State(() => "playing");
  const handlePlay = () => setMp3State(() => "play");
  const handlePause = () => setMp3State(() => "pause");
  const handleError = () => setMp3State(() => "error");

  const handleEnded = useCallback(() => {
    setMp3State(() => "ended");

    if (onEndedCallback) {
      onEndedCallback();
    }
  }, [onEndedCallback]);

  useEffect(() => {
    const mp3 = mp3Ref.current;

    if (mp3) {
      mp3.addEventListener("loadeddata", handleLoadedData);
      mp3.addEventListener("playing", handlePlaying);
      mp3.addEventListener("play", handlePlay);
      mp3.addEventListener("pause", handlePause);
      mp3.addEventListener("error", handleError);
      mp3.addEventListener("ended", handleEnded);
    }

    return () => {
      if (mp3) {
        mp3.removeEventListener("loadeddata", handleLoadedData);
        mp3.removeEventListener("playing", handlePlaying);
        mp3.removeEventListener("play", handlePlay);
        mp3.removeEventListener("pause", handlePause);
        mp3.removeEventListener("error", handleError);
        mp3.removeEventListener("ended", handleEnded);
      }
    };
  }, [mp3Ref, handleEnded]);

  const handleMp3Play = async () => {
    const mp3 = mp3Ref.current;

    if (!mp3) return;

    if (!mp3.paused) {
      mp3.pause();
      return;
    }

    mp3.currentTime = 0;
    await mp3.play();
  };

  const src = `${MP3_FOLDER}${textToSlug160(text)}.mp3`;

  return (
    <>
      <audio ref={mp3Ref} className="hidden" src={src} controls autoPlay={autoPlay} />

      <button style={{ top: "-3px" }} onClick={handleMp3Play} disabled={mp3State === ""}>
        {mp3State === "" && <PlayIcon />}
        {mp3State === "pause" && <PlayIcon />}
        {mp3State === "loadeddata" && <PlayIcon />}
        {mp3State === "ended" && <PlayIcon />}

        {mp3State === "playing" && <PauseIcon />}
        {mp3State === "play" && <PauseIcon />}
      </button>
    </>
  );
};
