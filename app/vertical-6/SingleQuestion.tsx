"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";

import { QuestionSmall } from "@/data/types";
import { Mp3 } from "./Mp3";
import { MEDIA_FOLDER } from "@/constants/constants";
import { NEXT_QUESTION_DELAY, SHOW_ANSWER_DELAY } from "./RandomExam";
import { introductionContent } from "./Content";

interface SingleQuestionProps {
  question: QuestionSmall;
  index: number;
  nextQuestion: () => void;
}

export const SingleQuestion: FC<SingleQuestionProps> = ({ question, index, nextQuestion }) => {
  const isVideoEndedRef = useRef(false);
  const isMp3EndedRef = useRef(false);

  useEffect(() => {
    isVideoEndedRef.current = false;
    isMp3EndedRef.current = false;
  }, [index]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const nextQuestionTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { text, media, a, b, c, r } = question;

  const src = media ? `${MEDIA_FOLDER}${media}` : "/placeholder_1.png";

  const hendleNextQuestionWithDelay = () => {
    nextQuestionTimerIdRef.current = setTimeout(() => {
      nextQuestion();
    }, NEXT_QUESTION_DELAY);
  };

  const mp3Ended = () => {
    isMp3EndedRef.current = true;
    const isVideo = src.endsWith(".mp4");

    if (isVideoEndedRef.current || !isVideo) {
      hendleNextQuestionWithDelay();
    }
  };

  const videoEnded = useCallback(() => {
    isVideoEndedRef.current = true;

    if (isMp3EndedRef.current) {
      hendleNextQuestionWithDelay();
    }
  }, [index]);

  useEffect(() => {
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

      <div className="scale-150 w-full">
        {src.endsWith(".mp4") ? (
          <video ref={videoRef} className="w-full" src={src} autoPlay />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="w-full duration-[10s]XXX scale-150XXX" src={src} alt={text} />
        )}
      </div>

      <div className="p-3 text-3xl w-full marker:p-1 text-white">
        <p className="pb-2">
          <span> {index + 1}. </span>
          <Mp3
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
