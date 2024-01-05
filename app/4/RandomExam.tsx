"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { generateSingleExam } from "@/helpers/helpers";
import { QuestionSmall, QuestionSmallObj } from "@/data/types";

import questionSmallObj from "../../data/questions-small.json";
import ExamEndedView from "../../components/ExamEndedView";

import { SingleQuestion } from "./SingleQuestion";
import QuestionsList from "./QuestionsList";

const START_INDEX = 0;
const GO_FULL_SCREEN = true;
const NEXT_QUESTION_DELAY_FALLBACK = 30 * 1000;
const NEXT_EXAM_DELAY = NEXT_QUESTION_DELAY_FALLBACK * 2 * 1000;

const RandomExam = () => {
  const [questions32, setQuestions32] = useState<QuestionSmall[]>([]);

  const generate = useCallback(() => {
    const { questionsSmall } = questionSmallObj as QuestionSmallObj;
    const questions32 = generateSingleExam(questionsSmall, "b", 0);
    setQuestions32(() => questions32);
  }, []);

  useEffect(() => {
    generate();
  }, [generate]);

  const [index, setIndex] = useState(START_INDEX);
  const [isStarted, setIsStarted] = useState(() => false);
  const [isEnded, setIsEnded] = useState(false);

  const nextQuestionTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextExamTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scoreSum = questions32.reduce((acc, curr) => acc + curr.score, 0);

  const endExam = useCallback(() => {
    setIsStarted(false);
    setIsEnded(true);

    setTimeout(() => {
      generate();
      setIndex(START_INDEX);
      setIsEnded(false);
    }, NEXT_EXAM_DELAY / 3);

    nextExamTimerIdRef.current = setTimeout(() => {
      setIsStarted(true);
    }, NEXT_EXAM_DELAY); // this starts new exam
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
    }, NEXT_QUESTION_DELAY_FALLBACK);

    return () => {
      if (nextQuestionTimerIdRef.current) clearTimeout(nextQuestionTimerIdRef.current);
      if (nextExamTimerIdRef.current) clearTimeout(nextExamTimerIdRef.current);
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

      <div className={!isStarted && !isEnded ? "" : "hidden"}>
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
