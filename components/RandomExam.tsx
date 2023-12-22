"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import questionSmallObj from "../data/questions-small.json";
import ExamEndedView from "./ExamEndedView";
import { Mp3 } from "./Mp3";

export interface CategoriesObj {
  categoriesCount: number;
  categories: string[];
  categoriesWithCount: { [key: string]: number };
}

export interface QuestionSmall {
  slug: string;
  isActive: boolean;

  id: string;
  text: string;
  a: string;
  b: string;
  c: string;
  r: string;
  media: string;
  categories: string[];
  score: number;
}

export interface QuestionSmallObj {
  questionsSmallCount: number;
  categoriesObj: CategoriesObj;
  questionsSmall: QuestionSmall[];
}

const MEDIA_FOLDER = `${process.env.NEXT_PUBLIC_MEDIA_LOCATION}size-720/`;
const START_INDEX = 0;
const GO_FULL_SCREEN = false;
const NEXT_QUESTION_DELAY = 999999;
const NEXT_QUESTION_DELAY_FALLBACK = 20 * 1000; // question will change ewery 20s

const RandomExam = () => {
  const [questions, setQuestions] = useState<QuestionSmall[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const { questionsSmall } = questionSmallObj as QuestionSmallObj;

    const questions32 = questionsSmall
      .filter((question) => question.categories.includes("b"))
      .sort(() => Math.random() - 0.5)
      .slice(0, 32);

    setQuestions(() => questions32);
  }, []);

  const [index, setIndex] = useState(START_INDEX);
  const [isStarted, setIsStarted] = useState(() => false);
  const [isEnded, setIsEnded] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const masterTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const videoEventCanPlayThrough = useCallback(() => {}, []);

  const handleShowAnswer = useCallback(() => {
    setShowAnswer(true);
  }, []);

  const endExam = useCallback(() => {
    setIsStarted(false);
    setIsEnded(true);
  }, []);

  const nextQuestion = useCallback(() => {
    if (!isStarted) {
      return;
    }

    if (index > 32) {
      endExam();
      return;
    }

    timerIdRef.current = setTimeout(() => {
      setIndex((prevIndex) => prevIndex + 1);
      setShowAnswer(false);
    }, NEXT_QUESTION_DELAY);
  }, [index, endExam, isStarted]);

  useEffect(() => {
    if (!isStarted) {
      return;
    }

    if (index > 31) {
      endExam();
      return;
    }

    masterTimerIdRef.current = setTimeout(() => {
      if (index > 31) {
        if (masterTimerIdRef.current) {
          clearTimeout(masterTimerIdRef.current);
        }

        return;
      }

      setIndex((prevIndex) => prevIndex + 1);
      setShowAnswer(false);
    }, NEXT_QUESTION_DELAY_FALLBACK);

    return () => {
      if (masterTimerIdRef.current) {
        clearTimeout(masterTimerIdRef.current);
      }
    };
  }, [index, isStarted, endExam]);

  const videoEventEnded = useCallback(() => {
    console.log("video ended");
    nextQuestion();
  }, [nextQuestion]);

  const imageEvent = useCallback(() => {
    console.log("image load");
    nextQuestion();
  }, [nextQuestion]);

  useEffect(() => {
    const cachedVideoRef = videoRef.current;
    const cachedImageRef = imageRef.current;

    cachedVideoRef?.addEventListener("canplaythrough", videoEventCanPlayThrough);
    cachedVideoRef?.addEventListener("ended", videoEventEnded);
    cachedImageRef?.addEventListener("load", imageEvent);

    return () => {
      cachedVideoRef?.removeEventListener("canplaythrough", videoEventCanPlayThrough);
      cachedVideoRef?.removeEventListener("ended", videoEventEnded);
      cachedImageRef?.removeEventListener("load", imageEvent);
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, [index, isStarted, videoEventCanPlayThrough, videoEventEnded, imageEvent]);

  const startExam = () => {
    setIsStarted(true);
    setIndex(START_INDEX);
    setShowAnswer(false);

    if (GO_FULL_SCREEN) {
      document.documentElement.requestFullscreen();
    }
  };

  const isFileVideo = (m: string) => m.includes(".mp4");
  const currentQuestion = questions[index];

  if (isEnded) {
    return <ExamEndedView />;
  }

  if (!currentQuestion) {
    return <div>Ładowanie pytań</div>;
  }

  const { text, media, r, a, b, c } = currentQuestion;

  const src = media ? `${MEDIA_FOLDER}${media}` : "/placeholder_1.png";
  const isVideo = isFileVideo(src);

  let secondaryText = "";
  if (r === "t") secondaryText = "tak";
  if (r === "n") secondaryText = "nie";
  if (r === "a") secondaryText = a;
  if (r === "b") secondaryText = b;
  if (r === "c") secondaryText = c;

  return (
    <div>
      {isStarted && !isEnded && (
        <>
          <div className="fixed bottom-10 w-4/5">
            {isVideo ? (
              <video ref={videoRef} className="w-full" src={src} autoPlay />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img ref={imageRef} className="w-full" src={src} alt={text} />
            )}
          </div>
          <div className="w-4/5 p-1 fixed bottom-0 bg-slate-600 text-white">
            <p className="pb-2">
              <span> {index + 1}. </span>
              <Mp3 text={text} secondaryText={secondaryText} secondaryTextCallback={handleShowAnswer} autoPlay /> {text}{" "}
            </p>
            {showAnswer && <p>Odpowiedź: {secondaryText} </p>}
          </div>

          <div
            className="fixed right-0"
            onClick={() => {
              setIndex((prev) => prev + 1);
              setShowAnswer(false);
            }}
          >
            next
          </div>
        </>
      )}
      {!isStarted && !isEnded && (
        <>
          <h1>Random Exam {questions.length} pytań.</h1>
          <p onClick={startExam}>Start</p>
          <ul>
            {questions.map((question, i) => {
              const src = question.media ? `${MEDIA_FOLDER}${question.media}` : "/placeholder_1.png";

              return (
                <li key={question.id}>
                  <div className="flex w-full pb-10">
                    {isFileVideo(src) ? (
                      <video className="w-[50px]" src={src} controls />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="w-[50px]" src={src} alt={question.text} />
                    )}
                    <Mp3 text={question.text} /> {i + 1}. {question.text}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default RandomExam;
