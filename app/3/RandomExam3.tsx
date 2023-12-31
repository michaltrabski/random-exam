"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { generateSingleExam } from "@/helpers/helpers";
import { QuestionSmall, QuestionSmallObj } from "@/data/types";

import questionSmallObj from "../../data/questions-small.json";
import ExamEndedView from "../../components/ExamEndedView";

import { SingleQuestion3 } from "./SingleQuestion3";
import { MEDIA_FOLDER } from "@/constants/constants";
import { Mp3 } from "./Mp3";

const START_INDEX = 0;
const GO_FULL_SCREEN = true;
const NEXT_QUESTION_DELAY = 25 * 1000; // question will change every ...

const RandomExam3 = () => {
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

  const scoreSum = questions32.reduce((acc, curr) => acc + curr.score, 0);

  const endExam = useCallback(() => {
    setIsStarted(false);
    setIsEnded(true);

    setTimeout(() => {
      generate();
      setIndex(START_INDEX);
      setIsStarted(true);
      setIsEnded(false);
    }, 35 * 1000);
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

  const { a, b, c, r } = currentQuestion;

  let rightAnswerText = "";
  if (r === "t") rightAnswerText = "tak";
  if (r === "n") rightAnswerText = "nie";
  if (r === "a") rightAnswerText = a;
  if (r === "b") rightAnswerText = b;
  if (r === "c") rightAnswerText = c;

  return (
    <div>
      {isStarted && !isEnded && (
        <SingleQuestion3
          question={currentQuestion}
          index={index}
          nextQuestion={nextQuestion}
          rightAnswerText={rightAnswerText}
        />
      )}

      <div className={!isStarted && !isEnded ? "" : "hidden"}>
        <h1>
          Losowy egzamin składa się z {questions32.length} pytań. Należy zdobyć minimum 68 punktów na {scoreSum}.
        </h1>
        <p className="p-3">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={startExam}>
            Rozpocznij egzamin
          </button>
        </p>
        <ul>
          {questions32.map((question, i) => {
            const _src = question.media ? `${MEDIA_FOLDER}${question.media}` : "/placeholder_1.png";

            const { a, b, c, r } = question;

            let _rightAnswerText = "";
            if (r === "t") _rightAnswerText = "tak";
            if (r === "n") _rightAnswerText = "nie";
            if (r === "a") _rightAnswerText = a;
            if (r === "b") _rightAnswerText = b;
            if (r === "c") _rightAnswerText = c;

            return (
              <li key={question.id}>
                <div className="flex w-full pb-10">
                  <div>
                    {_src.endsWith(".mp4") ? (
                      <video className="w-[150px]" src={_src} controls />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="w-[150px]" src={_src} alt={question.text} />
                    )}
                  </div>
                  <div>
                    <p>
                      <Mp3 text={question.text} />
                      {i + 1}. {question.text} {question.score}pkt
                    </p>
                    <p className="pb-2">
                      <Mp3 text={_rightAnswerText} />
                      <span> Odpowiedź {a ? `${r.toUpperCase()}.` : ""} </span>
                      <span> {_rightAnswerText} </span>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RandomExam3;
