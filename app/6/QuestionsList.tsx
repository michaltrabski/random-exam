"use client";

import { MEDIA_FOLDER } from "@/constants/constants";
import { QuestionSmall } from "@/data/types";
import { Mp3 } from "./Mp3";

interface QuestionsListProps {
  questions32: QuestionSmall[];
}

const QuestionsList = ({ questions32 }: QuestionsListProps) => {
  return (
    <ul>
      {questions32.map((question, i) => {
        const src = question.media ? `${MEDIA_FOLDER}${question.media}` : "/placeholder_1.png";

        const { a, b, c, r } = question;

        let rightAnswerText = "";
        if (r === "t") rightAnswerText = "Odpowiedź tak!";
        if (r === "n") rightAnswerText = "Odpowiedź nie!";
        if (r === "a") rightAnswerText = `Odpowiedź A! ${a}`;
        if (r === "b") rightAnswerText = `Odpowiedź B! ${b}`;
        if (r === "c") rightAnswerText = `Odpowiedź C! ${c}`;

        return (
          <li key={question.id}>
            <div className="flex w-full pb-10">
              <div className="shrink-0 pr-2">
                {src.endsWith(".mp4") ? (
                  <video className="w-[150px]" src={src} controls />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="w-[150px]" src={src} alt={question.text} />
                )}
              </div>
              <div>
                <p>
                  <Mp3 text={question.text} />
                  {i + 1}. {question.text} {question.score}pkt
                </p>
                <p className="pb-2">
                  <Mp3 text={rightAnswerText} />
                  <span> {rightAnswerText} </span>
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default QuestionsList;
