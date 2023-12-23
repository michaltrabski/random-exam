import { QuestionSmall } from "@/components/RandomExam";

export function textToSlug160(text: string) {
  text = text.toLowerCase().trim();

  const from = ["ę", "ó", "ą", "ś", "ł", "ż", "ź", "ć", "ń"];
  const to__ = ["e", "o", "a", "s", "l", "z", "z", "c", "n"];

  for (let i = 0; i < from.length; i++) {
    text = text.replace(new RegExp(from[i], "g"), to__[i]);
  }

  text = text
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return text.slice(0, 160);
}

const rnd = () => Math.random() - 0.5;

export const generateSingleExam = (
  _questions: QuestionSmall[],
  _category: string,
  howManyPngOnFront = 0
): QuestionSmall[] => {
  const questions = _questions.filter((question) => question.categories.includes(_category)).sort(rnd);
  const questionsCopy = [...questions];

  const yesNo_Score1_count4: QuestionSmall[] = []; // 4 questions with score 1 and answer yesNo
  const yesNo_Score2_count6: QuestionSmall[] = []; // 6 questions with score 2 and answer yesNo
  const yesNo_Score3_count10: QuestionSmall[] = []; // 10 questions with score 3 and answer yesNo

  const abc_Score1_count2: QuestionSmall[] = []; // 2 questions with score 1 and answer ABC
  const abc_Score2_count4: QuestionSmall[] = []; // 4 questions with score 2 and answer ABC
  const abc_Score3_count6: QuestionSmall[] = []; // 6 questions with score 3 and answer ABC

  for (let i = 0; i < 4; i++) {
    const question = questions.find((q) => q.a === "" && q.score === 1);
    if (question) {
      yesNo_Score1_count4.push(question);
      questions.splice(questions.indexOf(question), 1);
    } else {
      const qcs = questionsCopy.sort(rnd);
      const questionFromCopy = qcs.find((q) => q.a === "" && q.score === 1) || qcs[0];
      yesNo_Score1_count4.push(questionFromCopy);
    }
  }

  for (let i = 0; i < 6; i++) {
    const question = questions.find((q) => q.a === "" && q.score === 2);
    if (question) {
      yesNo_Score2_count6.push(question);
      questions.splice(questions.indexOf(question), 1);
    } else {
      const qcs = questionsCopy.sort(rnd);
      const questionFromCopy = qcs.find((q) => q.a === "" && q.score === 2) || qcs[0];
      yesNo_Score2_count6.push(questionFromCopy);
    }
  }

  for (let i = 0; i < 10; i++) {
    const question = questions.find((q) => q.a === "" && q.score === 3);
    if (question) {
      yesNo_Score3_count10.push(question);
      questions.splice(questions.indexOf(question), 1);
    } else {
      const qcs = questionsCopy.sort(rnd);
      const questionFromCopy = qcs.find((q) => q.a === "" && q.score === 3) || qcs[0];
      yesNo_Score3_count10.push(questionFromCopy);
    }
  }

  for (let i = 0; i < 2; i++) {
    const question = questions.find((q) => q.a !== "" && q.score === 1);
    if (question) {
      abc_Score1_count2.push(question);
      questions.splice(questions.indexOf(question), 1);
    } else {
      const qcs = questionsCopy.sort(rnd);
      const questionFromCopy = qcs.find((q) => q.a !== "" && q.score === 1) || qcs[0];
      abc_Score1_count2.push(questionFromCopy);
    }
  }

  for (let i = 0; i < 4; i++) {
    const question = questions.find((q) => q.a !== "" && q.score === 2);
    if (question) {
      abc_Score2_count4.push(question);
      questions.splice(questions.indexOf(question), 1);
    } else {
      const qcs = questionsCopy.sort(rnd);
      const questionFromCopy = qcs.find((q) => q.a !== "" && q.score === 2) || qcs[0];
      abc_Score2_count4.push(questionFromCopy);
    }
  }

  for (let i = 0; i < 6; i++) {
    const question = questions.find((q) => q.a !== "" && q.score === 3);
    if (question) {
      abc_Score3_count6.push(question);
      questions.splice(questions.indexOf(question), 1);
    } else {
      const qcs = questionsCopy.sort(rnd);
      const questionFromCopy = qcs.find((q) => q.a !== "" && q.score === 3) || qcs[0];
      abc_Score3_count6.push(questionFromCopy);
    }
  }

  const yesNo = [...yesNo_Score1_count4, ...yesNo_Score2_count6, ...yesNo_Score3_count10].sort(rnd);

  const yesNo_3png: QuestionSmall[] = []; // 3 questions with score 1 and answer yesNo and media png
  const yesNo_17rest: QuestionSmall[] = []; // 17 questions with score 1 and answer yesNo and media mp4

  yesNo.forEach((q) => {
    if (q.media.endsWith(".png") && yesNo_3png.length < howManyPngOnFront) {
      yesNo_3png.push(q);
    } else {
      yesNo_17rest.push(q);
    }
  });

  const abc = [...abc_Score1_count2, ...abc_Score2_count4, ...abc_Score3_count6].sort(rnd);

  const examQuestions32 = [...yesNo_3png, ...yesNo_17rest, ...abc];

  const allPossiblePoints = examQuestions32.reduce((acc, q) => acc + q.score, 0);

  if (74 !== allPossiblePoints) {
    console.log(`maxPoints ${74} !== allPossiblePoints ${allPossiblePoints}`);
  }

  return examQuestions32;
};
