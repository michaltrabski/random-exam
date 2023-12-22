"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import questionSmallObj from "../data/questions-small.json";
import ExamEndedView from "./ExamEndedView";

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

export const MEDIA_FOLDER = `${process.env.NEXT_PUBLIC_MEDIA_LOCATION}size-720/`;
const START_INDEX = 25;
const GO_FULL_SCREEN = true;
const NEXT_QUESTION_DELAY = 999999;
const NEXT_QUESTION_DELAY_FALLBACK = 15 * 1000;

const RandomExam = () => {
  const [questions, setQuestions] = useState<QuestionSmall[]>([]);

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
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const masterTimerIdRef = useRef<NodeJS.Timeout | null>(null);

  const videoEventCanPlayThrough = useCallback(() => {
    console.log("video canplaythrough");
  }, []);

  const endExam = useCallback(() => {
    setIsStarted(false);
    setIsEnded(true);
  }, []);

  const nextQuestion = useCallback(() => {
    console.log("nextQuestion", { index, isStarted });
    if (!isStarted) {
      return;
    }

    if (index > 32) {
      endExam();
      return;
    }

    timerIdRef.current = setTimeout(() => {
      setIndex((prevIndex) => prevIndex + 1);
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

  const { text, media } = currentQuestion;

  const src = media ? `${MEDIA_FOLDER}${media}` : "/placeholder_1.png";
  const isVideo = isFileVideo(src);

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
            {index + 1}. {text}
          </div>

          <div className="fixed right-0" onClick={() => setIndex((prev) => prev + 1)}>
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
                    {i + 1}. {question.text}
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
