"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import questionSmallObj from "../data/questions-small.json";

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

  const [index, setIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const videoEventCanPlayThrough = useCallback(() => {
    console.log("video canplaythrough");
  }, []);

  const nextQuestion = useCallback(() => {
    if (index === 31) return;

    timerIdRef.current = setTimeout(() => {
      setIndex((prevIndex) => prevIndex + 1);
    }, 500);
  }, [index]);

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
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
    };
  }, [index, isStarted, videoEventCanPlayThrough, videoEventEnded, imageEvent]);

  const startExam = () => {
    setIsStarted(true);
    setIndex(0);

    // request full page
    document.documentElement.requestFullscreen();
  };

  const isFileVideo = (m: string) => m.includes(".mp4");
  const currentQuestion = questions[index];

  if (!currentQuestion) return null;

  const { text, media } = currentQuestion;

  const src = `${MEDIA_FOLDER}${media}`;
  const isVideo = isFileVideo(src);

  return (
    <>
      <p onClick={nextQuestion}>index={index}</p>
      {isStarted && (
        <div className="border border-green-500 relative">
          <div className="fixed bottom-10">
            {isVideo ? (
              <video ref={videoRef} className="w-4/5" src={src} controls autoPlay />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img ref={imageRef} className="w-4/5" src={src} alt={text} />
            )}
          </div>
          <div className="w-4/5 p-1 fixed bottom-0 bg-slate-600 text-white">{text}</div>
        </div>
      )}

      {!isStarted && (
        <>
          <h1>Random Exam {questions.length} pytań.</h1>
          <p onClick={startExam}>Start</p>
          <ul>
            {questions.map((question, i) => {
              const src = `${MEDIA_FOLDER}${question.media}`;

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
    </>
  );
};

export default RandomExam;
