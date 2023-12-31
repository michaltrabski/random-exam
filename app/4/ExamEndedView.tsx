import React from "react";
import { Mp3 } from "./Mp3";

type ExamEndedViewProps = {
  // Define your props here
};

const ExamEndedView: React.FC<ExamEndedViewProps> = (props) => {
  // Implement your component logic here

  return (
    <div className="bg-slate-600 w-full h-screen text-center text-white flex justify-center items-center">
      <div>
        <h1 className="text-4xl pb-5">
          <Mp3 text="Egzamin zakończony tekst 1" autoPlayWithdelay={2000} />
          <span>Egzamin zakończony!</span>
        </h1>
        <p className="text-xl text-green-500 pb-2">Zdałem i zdobyłem 74 punkty na 74 możliwe.</p>
        <p className="text-l pb-3">Zapraszam do nauki pytań testowych na stronie:</p>
        <p className="text-5xl">
          poznaj-<span className="text-red-700">testy</span>.pl
        </p>
      </div>
    </div>
  );
};

export default ExamEndedView;
