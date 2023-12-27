"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Mp3 } from "./Mp3";
import { QuestionSmall } from "@/data/types";

interface SingleQuestionProps {
  question: QuestionSmall;
  index: number;
  nextQuestion: () => void;
}

const MEDIA_FOLDER = `${process.env.NEXT_PUBLIC_MEDIA_LOCATION}size-720/`;

export const SingleQuestion: FC<SingleQuestionProps> = ({ question, index, nextQuestion }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setShowAnswer(false);
  }, [index]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { text, a, b, c, r, media } = question;

  const src = media ? `${MEDIA_FOLDER}${media}` : "/placeholder_1.png";

  let rightAnswerText = "";
  if (r === "t") rightAnswerText = "tak";
  if (r === "n") rightAnswerText = "nie";
  if (r === "a") rightAnswerText = a;
  if (r === "b") rightAnswerText = b;
  if (r === "c") rightAnswerText = c;

  const mp3Ended = () => {
    const isVideo = src.endsWith(".mp4");

    if (!isVideo) {
      setShowAnswer(true);
    }
  };

  const videoEnded = useCallback(() => {
    setShowAnswer(true);
  }, [index]);

  useEffect(() => {
    const cachedVideoRef = videoRef.current;

    cachedVideoRef?.addEventListener("ended", videoEnded);

    return () => {
      cachedVideoRef?.removeEventListener("ended", videoEnded);
    };
  }, [index, videoEnded]);

  return (
    <>
      <div className="fixed bottom-10 w-10/12">
        {src.endsWith(".mp4") ? (
          <video ref={videoRef} className="w-full" src={src} autoPlay />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="w-full" src={src} alt={text} />
        )}
      </div>

      <div className="p-2 fixed top-0 bg-slate-800 opacity-80 text-white">
        <strong>poznaj</strong>
        <strong className="text-red-600">-testy</strong>
        <strong>.pl</strong>
      </div>

      <div className="p-2 fixed top-0 left-2/3 w-1/2 bg-slate-800 opacity-80 text-yellow-300">
        <span>Odwiedź naszą stronę!</span>
      </div>

      <div className="w-10/12 p-1 fixed bottom-0 bg-slate-600 text-white">
        <p className="pb-2">
          <span> {index + 1}. </span>
          <Mp3
            text={text}
            autoPlay
            onEndedCallback={() => {
              mp3Ended();
            }}
          />
          <span> {text} </span>
        </p>
        {showAnswer && (
          <p>
            <Mp3 text={rightAnswerText} autoPlay />
            <span> Odpowiedź {a ? `${r.toUpperCase()}.` : ""} </span>
            <span> {rightAnswerText} </span>
          </p>
        )}
      </div>

      <div className="fixed right-0" onClick={nextQuestion}>
        next
      </div>
      <div className="fixed right-0 bottom-0">
        <video className="w-[50px]" src="/placeholder.mp4" autoPlay loop controls />
      </div>
    </>
  );
};
