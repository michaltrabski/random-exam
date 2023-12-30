"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { generateSingleExam } from "@/helpers/helpers";
import { QuestionSmall, QuestionSmallObj } from "@/data/types";

import questionSmallObj from "../../data/questions-small.json";
import ExamEndedView from "../../components/ExamEndedView";
import { Mp3 } from "../../components/Mp3";
import { SingleQuestion3 } from "./SingleQuestion3";
import { MEDIA_FOLDER } from "@/constants/constants";

const START_INDEX = 0;
const GO_FULL_SCREEN = true;
const NEXT_QUESTION_DELAY = 25 * 1000; // question will change ewery 20s

const RandomExam3 = () => {
  const [questions32, setQuestions32] = useState<QuestionSmall[]>([]);

  useEffect(() => {
    const { questionsSmall } = questionSmallObj as QuestionSmallObj;

    const questions32 = generateSingleExam(questionsSmall, "b", 0);

    setQuestions32(() => questions32);
  }, []);

  const [index, setIndex] = useState(START_INDEX);
  const [isStarted, setIsStarted] = useState(() => false);
  const [isEnded, setIsEnded] = useState(false);

  const nextQuestionTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    nextQuestionTimerIdRef.current = setTimeout(() => {
      if (index > 31) {
        if (nextQuestionTimerIdRef.current) clearTimeout(nextQuestionTimerIdRef.current);

        return;
      }

      setIndex((prevIndex) => prevIndex + 1);
    }, NEXT_QUESTION_DELAY);

    return () => {
      if (nextQuestionTimerIdRef.current) clearTimeout(nextQuestionTimerIdRef.current);
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
      {isStarted && !isEnded && (
        <SingleQuestion3 question={currentQuestion} index={index} nextQuestion={nextQuestion} />
      )}
      {!isStarted && !isEnded && (
        <>
          <h1>
            Losowy egzamin składa się z {questions32.length} pytań. Należy zdobyć minimum 68 punktów na {scoreSum}.
          </h1>
          <p className="p-3">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={startExam}
            >
              Rozpocznij egzamin
            </button>
          </p>
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
                    <p>
                      <Mp3 text={question.text} />
                    </p>
                    {i + 1}. {question.text} {question.score}pkt
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

export default RandomExam3;
