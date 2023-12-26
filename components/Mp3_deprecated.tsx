"use client";

import { textToSlug160 } from "@/helpers/helpers";
import { FC, useCallback, useEffect, useRef, useState } from "react";

interface Mp3Props {
  text: string;
  secondaryText?: string; // play it after primary text is ended
  secondaryTextCallback?: () => void;
  autoPlay?: boolean;
}

const MP3_FOLDER = `${process.env.NEXT_PUBLIC_MEDIA_LOCATION}mp3/`;
const SECONDARY_TEXT_DELAY = 2000;

export const Mp3_deprecated: FC<Mp3Props> = ({ text, secondaryText, secondaryTextCallback, autoPlay = false }) => {
  const [textToPlay, setTextToPlay] = useState(text);
  const [mp3State, setMp3State] = useState<"loadeddata" | "playing" | "play" | "pause" | "error" | "ended" | "">("");
  const mp3Ref = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLoadedData = () => setMp3State(() => "loadeddata");
  const handlePlaying = () => setMp3State(() => "playing");
  const handlePlay = () => setMp3State(() => "play");
  const handlePause = () => setMp3State(() => "pause");
  const handleError = () => setMp3State(() => "error");

  const handleEnded = useCallback(() => {
    if (secondaryText) {
      timeoutRef.current = setTimeout(() => {
        setTextToPlay(() => secondaryText);
        secondaryTextCallback && secondaryTextCallback();
      }, SECONDARY_TEXT_DELAY);
    }
    setMp3State(() => "ended");
  }, [secondaryText, secondaryTextCallback]);

  useEffect(() => {
    console.log(text, "\n", secondaryText);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, secondaryText]);

  useEffect(() => {
    setTextToPlay(() => text);
  }, [text]);

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

  const src = `${MP3_FOLDER}${textToSlug160(textToPlay)}.mp3`;

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

const PlayIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-play-circle"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
    </svg>
  );
};

const PauseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-pause-circle"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z" />
    </svg>
  );
};
