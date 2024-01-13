"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { generateSingleExam } from "@/helpers/helpers";
import { QuestionSmall, QuestionSmallObj } from "@/data/types";

import questionSmallObj from "../../data/questions-small.json";
import { SingleQuestion } from "./SingleQuestion";
import QuestionsList from "./QuestionsList";
import ExamEndedView from "./ExamEndedView";

const CATEGORY = "b";
let START_INDEX = 0;
let GO_FULL_SCREEN = true;
const NEXT_EXAM_DELAY = 30 * 1000;
export const SHOW_ANSWER_DELAY = 2 * 1000;
export const NEXT_QUESTION_DELAY = 5 * 1000;

const RandomExam = () => {
  const [questions32, setQuestions32] = useState<QuestionSmall[]>([]);
  const [index, setIndex] = useState(START_INDEX);
  const [isStarted, setIsStarted] = useState(() => false);
  const [isEnded, setIsEnded] = useState(false);
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    setUnmount(true);

    setTimeout(() => {
      setUnmount(false);
    }, 1000);
  }, [index]);

  const generate = useCallback(() => {
    const { questionsSmall } = questionSmallObj as QuestionSmallObj;
    const questions32 = generateSingleExam(questionsSmall, CATEGORY, 0);
    setQuestions32(() => questions32);
  }, []);

  useEffect(() => {
    generate();
  }, [generate]);

  const nextExamTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prepareExamTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scoreSum = questions32.reduce((acc, curr) => acc + curr.score, 0);

  const endExam = useCallback(() => {
    setIsStarted(false);
    setIsEnded(true);
  }, []);

  useEffect(() => {
    if (!isEnded) return;

    prepareExamTimerIdRef.current = setTimeout(() => {
      generate();
      setIndex(START_INDEX);
      setIsEnded(false);
    }, NEXT_EXAM_DELAY / 3);

    nextExamTimerIdRef.current = setTimeout(() => {
      setIsStarted(true);
    }, NEXT_EXAM_DELAY); // this starts new exam
  }, [generate, isEnded]);

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
    }

    return () => {
      if (nextExamTimerIdRef.current) clearTimeout(nextExamTimerIdRef.current);
      if (prepareExamTimerIdRef.current) clearTimeout(prepareExamTimerIdRef.current);
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

  const isStartedAndNotEnded = isStarted && !isEnded;
  const isNotStartedAndNotEnded = !isStarted && !isEnded;

  return (
    <div>
      {isStartedAndNotEnded && !unmount && (
        <SingleQuestion question={currentQuestion} index={index} nextQuestion={nextQuestion} />
      )}

      <div className={isNotStartedAndNotEnded ? "" : "hidden"}>
        <h1>
          Losowy egzamin składa się z {questions32.length} pytań. Należy zdobyć minimum 68 punktów na {scoreSum}.
        </h1>
        <p className="p-3">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={startExam}>
            Rozpocznij egzamin
          </button>
        </p>
        <QuestionsList questions32={questions32} />
      </div>
    </div>
  );
};

export default RandomExam;
