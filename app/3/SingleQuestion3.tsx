"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";

import { QuestionSmall } from "@/data/types";
import { Mp3 } from "./Mp3";
import { MEDIA_FOLDER } from "@/constants/constants";

interface SingleQuestion3Props {
  question: QuestionSmall;
  index: number;
  nextQuestion: () => void;
  rightAnswerText: string;
}

const SHOW_ANSWER_DELAY = 2.5 * 1000; // answer will show after

export const SingleQuestion3: FC<SingleQuestion3Props> = ({ question, index, nextQuestion, rightAnswerText }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setShowAnswer(false);
  }, [index]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const showAnswerTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { text, a, r, media } = question;

  const src = media ? `${MEDIA_FOLDER}${media}` : "/placeholder_1.png";

  const handleShowAnswer = () => {
    showAnswerTimerIdRef.current = setTimeout(() => {
      setShowAnswer(true);
    }, SHOW_ANSWER_DELAY);
  };

  const mp3Ended = () => {
    const isVideo = src.endsWith(".mp4");

    if (!isVideo) {
      handleShowAnswer();
    }
  };

  const videoEnded = useCallback(() => {
    handleShowAnswer();
  }, [index]);

  useEffect(() => {
    const cachedVideoRef = videoRef.current;

    cachedVideoRef?.addEventListener("ended", videoEnded);

    return () => {
      cachedVideoRef?.removeEventListener("ended", videoEnded);
      showAnswerTimerIdRef.current && clearTimeout(showAnswerTimerIdRef.current);
    };
  }, [index, videoEnded]);

  return (
    <>
      <div className="fixed bottom-10 w-full">
        {src.endsWith(".mp4") ? (
          <video ref={videoRef} className="w-full" src={src} autoPlay />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="w-full" src={src} alt={text} />
        )}
      </div>

      <div className="p-3 text-3xl fixed top-0 bg-slate-800 opacity-80 text-white ">
        <strong>poznaj</strong>
        <strong className="text-red-600">-testy</strong>
        <strong>.pl</strong>
      </div>

      <div onClick={nextQuestion} className="p-3 text-3xl  fixed top-0 right-0 bg-slate-800 opacity-80 text-yellow-300">
        <span>Odwiedź naszą stronę!</span>
      </div>

      <div className="p-2 text-3xl w-full marker:p-1 fixed bottom-0 bg-slate-600 text-white">
        <p className="pb-2">
          <span> {index + 1}. </span>
          <Mp3 text={text} onEndedCallback={mp3Ended} autoPlayWithdelay={1000} />
          <span> {text} </span>
        </p>
        {showAnswer && (
          <p className="pb-2">
            <span> {rightAnswerText} </span>
          </p>
        )}
      </div>
    </>
  );
};
