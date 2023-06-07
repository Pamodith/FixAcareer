import { Question } from "../../interfaces";

interface QuizQuestionProps {
  question: Question;
  mood?: "add" | "edit" | "view";
  setAddQuestion: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  mood = "view",
  setAddQuestion,
}) => {
  if (mood === "add") {
    return (
      <>
        <h1>Add</h1>
      </>
    );
  }

  if (mood === "edit") {
    return (
      <>
        <h1>Edit</h1>
      </>
    );
  }

  return (
    <>
      <h1>View</h1>
    </>
  );
};

export default QuizQuestion;
