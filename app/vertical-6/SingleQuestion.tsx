"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";

import { QuestionSmall } from "@/data/types";
import { Mp3 } from "./Mp3";
import { MEDIA_FOLDER } from "@/constants/constants";
import { NEXT_QUESTION_DELAY } from "./RandomExam";

interface SingleQuestionProps {
  question: QuestionSmall;
  index: number;
  nextQuestion: () => void;
}

export const SingleQuestion: FC<SingleQuestionProps> = ({ question, index, nextQuestion }) => {
  const [scale, setScale] = useState("");

  const isVideoEndedRef = useRef(false);
  const isMp3EndedRef = useRef(false);

  useEffect(() => {
    isVideoEndedRef.current = false;
    isMp3EndedRef.current = false;
  }, [index]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const nextQuestionTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { text, media } = question;

  const src = media ? `${MEDIA_FOLDER}${media}` : "/placeholder_1.png";

  const hendleNextQuestionWithDelay = () => {
    nextQuestionTimerIdRef.current = setTimeout(() => {
      nextQuestion();
    }, NEXT_QUESTION_DELAY);
  };

  const mp3Ended = () => {
    isMp3EndedRef.current = true;
    const isVideo = src.endsWith(".mp4");

    console.log("mp3Ended");
    if (isVideoEndedRef.current || !isVideo) {
      hendleNextQuestionWithDelay();
    }
  };

  const videoEnded = useCallback(() => {
    console.log("videoEnded");
    isVideoEndedRef.current = true;

    if (isMp3EndedRef.current) {
      hendleNextQuestionWithDelay();
    }
  }, [index]);

  useEffect(() => {
    setScale("scale-[1.8]");
    const cachedVideoRef = videoRef.current;

    cachedVideoRef?.addEventListener("ended", videoEnded);

    return () => {
      cachedVideoRef?.removeEventListener("ended", videoEnded);

      nextQuestionTimerIdRef.current && clearTimeout(nextQuestionTimerIdRef.current);
    };
  }, [index, videoEnded]);

  return (
    <div className="flex flex-col justify-evenly h-screen bg-slate-600">
      <Logo />

      <div className={`duration-[40s] ${scale} w-full`}>
        {src.endsWith(".mp4") ? (
          <video ref={videoRef} className="w-full" src={src} autoPlay />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="w-full" src={src} alt={text} />
        )}
      </div>

      <div className="p-3 text-2xl w-full marker:p-1 text-white">
        <p className="pb-2 pr-20">
          <Mp3
            hidden
            text={text}
            onEndedCallback={mp3Ended}
            autoPlayWithdelay={1300}
            onErrorCallback={hendleNextQuestionWithDelay}
          />
          <span> {text} </span>
        </p>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="p-3 text-3xl text-white w-full text-center">
      <strong>poznaj</strong>
      <strong className="text-red-600">-testy</strong>
      <strong>.pl</strong>
    </div>
  );
};
