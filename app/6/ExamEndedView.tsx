import React, { use, useEffect, useState } from "react";
import { Mp3 } from "./Mp3";
import { examEndedContent, persons } from "./Content";

type ExamEndedViewProps = {
  // Define your props here
};

const ExamEndedView: React.FC<ExamEndedViewProps> = (props) => {
  const [content, setContent] = useState("");
  const [person, setPerson] = useState("");

  useEffect(() => {
    const content = examEndedContent[Math.floor(Math.random() * examEndedContent.length)];
    const person = persons[Math.floor(Math.random() * persons.length)];
    setContent(content);
    setPerson(person);
  }, []);

  return (
    <div className="bg-slate-600 w-full h-screen text-center text-white flex justify-center p-3">
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-4xl pb-5">
            <Mp3 text={content} autoPlayWithdelay={2000} />
            <span>Egzamin zakończony!</span>
          </h1>
          <p className="text-xl text-green-500 pb-2">Zdałem i zdobyłem 74 punkty na 74 możliwe.</p>
          <p className="text-l pb-3">Zapraszam do nauki pytań testowych na stronie:</p>
          <p className="text-5xl">
            poznaj-<span className="text-red-700">testy</span>.pl
          </p>
        </div>
        <div className="text-sm text-start">
          <p>
            <strong>{person}</strong>
          </p>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default ExamEndedView;
