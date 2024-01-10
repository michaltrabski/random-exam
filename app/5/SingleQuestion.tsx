"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";

import { QuestionSmall } from "@/data/types";
import { Mp3 } from "./Mp3";
import { MEDIA_FOLDER } from "@/constants/constants";
import { NEXT_QUESTION_DELAY, SHOW_ANSWER_DELAY } from "./RandomExam";

interface SingleQuestionProps {
  question: QuestionSmall;
  index: number;
  nextQuestion: () => void;
}

export const SingleQuestion: FC<SingleQuestionProps> = ({ question, index, nextQuestion }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const isVideoEndedRef = useRef(false);
  const isMp3EndedRef = useRef(false);

  useEffect(() => {
    setShowAnswer(false);
    isVideoEndedRef.current = false;
    isMp3EndedRef.current = false;
  }, [index]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const showAnswerTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextQuestionTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { text, media, a, b, c, r } = question;

  const src = media ? `${MEDIA_FOLDER}${media}` : "/placeholder_1.png";

  const handleShowAnswer = () => {
    showAnswerTimerIdRef.current = setTimeout(() => {
      setShowAnswer(true);
    }, SHOW_ANSWER_DELAY);
  };

  const hendleNextQuestionWithDelay = () => {
    nextQuestionTimerIdRef.current = setTimeout(() => {
      nextQuestion();
    }, NEXT_QUESTION_DELAY);
  };

  const mp3Ended = () => {
    isMp3EndedRef.current = true;
    const isVideo = src.endsWith(".mp4");

    if (!isVideo) {
      handleShowAnswer();
      return;
    }

    if (isVideoEndedRef.current) {
      handleShowAnswer();
    }
  };

  const videoEnded = useCallback(() => {
    console.log({ index });
    isVideoEndedRef.current = true;

    if (isMp3EndedRef.current) {
      handleShowAnswer();
    }
  }, [index]);

  useEffect(() => {
    console.log({ index });
    const cachedVideoRef = videoRef.current;

    cachedVideoRef?.addEventListener("ended", videoEnded);

    return () => {
      cachedVideoRef?.removeEventListener("ended", videoEnded);
      showAnswerTimerIdRef.current && clearTimeout(showAnswerTimerIdRef.current);
      nextQuestionTimerIdRef.current && clearTimeout(nextQuestionTimerIdRef.current);
    };
  }, [index, videoEnded]);

  let rightAnswerText = "";
  if (r === "t") rightAnswerText = "Odpowiedź tak!";
  if (r === "n") rightAnswerText = "Odpowiedź nie!";
  if (r === "a") rightAnswerText = `Odpowiedź A! ${a}`;
  if (r === "b") rightAnswerText = `Odpowiedź B! ${b}`;
  if (r === "c") rightAnswerText = `Odpowiedź C! ${c}`;

  return (
    <>
      <div className="fixed bottom-16 w-full">
        {src.endsWith(".mp4") ? (
          <video ref={videoRef} className="w-full" src={src} autoPlay />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="w-full" src={src} alt={text} />
        )}
      </div>

      <Logo />

      <OdwiedzNaszaStrone nextQuestion={nextQuestion} />

      {index === 0 && <Overly />}

      <div className="p-3 text-4xl w-full marker:p-1 fixed bottom-0 bg-slate-600 text-white border-b-blue-600 border-b-4">
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
        {showAnswer && (
          <p className="pb-2 hidden">
            <Mp3 text={rightAnswerText} onEndedCallback={hendleNextQuestionWithDelay} autoPlayWithdelay={0} />
            <span> {rightAnswerText} </span>
          </p>
        )}

        <div className="flex justify-center">
          {index < 20 && (
            <div className="flex gap-3">
              <button
                className={`${
                  showAnswer && r === "t" ? "bg-green-700" : "bg-slate-500"
                } text-white font-bold py-2 px-4 rounded`}
              >
                Tak
              </button>
              <button
                className={`${
                  showAnswer && r === "n" ? "bg-green-700" : "bg-slate-500"
                } text-white font-bold py-2 px-4 rounded`}
              >
                Nie
              </button>
            </div>
          )}

          {index >= 20 && (
            <div className="flex gap-3 flex-col w-full ">
              {["a", "b", "c"].map((answer) => (
                <button
                  key={answer}
                  className={`${
                    showAnswer && r === answer ? "bg-green-700" : "bg-slate-500"
                  } text-white font-bold py-2 px-4 rounded text-start`}
                >
                  <span>{answer.toUpperCase()}) </span>
                  <span> {question[answer as keyof QuestionSmall]} </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const OdwiedzNaszaStrone = ({ nextQuestion }: { nextQuestion: () => void }) => {
  return (
    <div onClick={nextQuestion} className="p-3 text-3xl fixed top-0 right-0 bg-slate-800 opacity-80 text-yellow-300">
      <span>Odwiedź naszą stronę!</span>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="p-3 text-3xl fixed top-0 bg-slate-800 opacity-80 text-white ">
      <strong>poznaj</strong>
      <strong className="text-red-600">-testy</strong>
      <strong>.pl</strong>
    </div>
  );
};

const Overly = () => {
  const [show, setShow] = useState(false);
  const showRefTimerId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideRefTimerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    showRefTimerId.current = setTimeout(() => {
      setShow(true);
    }, 5000);

    hideRefTimerId.current = setTimeout(() => {
      setShow(false);
    }, 8000);

    return () => {
      showRefTimerId.current && clearTimeout(showRefTimerId.current);
      hideRefTimerId.current && clearTimeout(hideRefTimerId.current);
    };
  }, []);

  return (
    <div className={show ? "" : "hidden"}>
      <div className="top-[130px] left-[120px] text-center fixed text-white transform -rotate-6">
        <div className="w-[700px] mb-2 p-3 pb-4 text-yellow-500 text-6xl bg-slate-800 shadow-lg">
          Egzamin na prawo jazdy
        </div>
        <div className="w-[500px] p-3 pb-4 text-red-700 text-5xl bg-slate-800 shadow-lg">STYCZEŃ 2024</div>
      </div>
    </div>
  );
};
