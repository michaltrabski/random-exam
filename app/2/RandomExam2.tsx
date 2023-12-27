"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { generateSingleExam } from "@/helpers/helpers";
import { QuestionSmall, QuestionSmallObj } from "@/data/types";

import questionSmallObj from "../../data/questions-small.json";
import ExamEndedView from "../../components/ExamEndedView";
import { Mp3 } from "../../components/Mp3";
import { SingleQuestion } from "../../components/ExamQuestion";

const MEDIA_FOLDER = `${process.env.NEXT_PUBLIC_MEDIA_LOCATION}size-720/`;
const START_INDEX = 0;
const GO_FULL_SCREEN = true;
const NEXT_QUESTION_DELAY_FALLBACK = 20 * 1000; // question will change ewery 20s

const RandomExam2 = () => {
  const [questions32, setQuestions32] = useState<QuestionSmall[]>([]);

  useEffect(() => {
    const { questionsSmall } = questionSmallObj as QuestionSmallObj;

    const questions32 = generateSingleExam(questionsSmall, "b", 0);

    setQuestions32(() => questions32);
  }, []);

  const [index, setIndex] = useState(START_INDEX);
  const [isStarted, setIsStarted] = useState(() => false);
  const [isEnded, setIsEnded] = useState(false);

  const masterTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scoreSum = questions32.reduce((acc, curr) => acc + curr.score, 0);

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

    setIndex((prevIndex) => prevIndex + 1);
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

  const startExam = () => {
    setIsStarted(true);
    setIndex(START_INDEX);

    if (GO_FULL_SCREEN) {
      document.documentElement.requestFullscreen();
    }
  };

  const currentQuestion = questions32[index];

  if (isEnded) {
    return <ExamEndedView />;
  }

  if (!currentQuestion) {
    return <div>Ładowanie pytań</div>;
  }

  return (
    <div>
      {isStarted && !isEnded && <SingleQuestion question={currentQuestion} index={index} nextQuestion={nextQuestion} />}
      {!isStarted && !isEnded && (
        <>
          <h1>
            Losowy egzamin składa się z {questions32.length} pytań. Należy zdobyć minimum 68 punktów na {scoreSum}.
          </h1>
          <div className="p-3">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={startExam}
            >
              Rozpocznij egzamin
            </button>
          </div>
          <ul>
            {questions32.map((question, i) => {
              const _src = question.media ? `${MEDIA_FOLDER}${question.media}` : "/placeholder_1.png";

              return (
                <li key={question.id}>
                  <div className="flex w-full pb-10">
                    {_src.endsWith(".mp4") ? (
                      <video className="w-[150px]" src={_src} controls />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="w-[150px]" src={_src} alt={question.text} />
                    )}
                    <Mp3 text={question.text} /> {i + 1}. {question.text} {question.score}pkt
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

export default RandomExam2;
