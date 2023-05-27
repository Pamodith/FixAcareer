import React, { useState } from "react";
import PropTypes from "prop-types";
import { Container, Menu, MenuItemProps } from "semantic-ui-react";

import Stats from "./Stats";
import QNA from "./QNA";

interface ResultProps {
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  questionsAndAnswers: {
    question: string;
    user_answer: string;
    correct_answer: string;
    point: number;
  }[];
  replayQuiz: () => void;
  resetQuiz: () => void;
}

const Result: React.FC<ResultProps> = ({
  totalQuestions,
  correctAnswers,
  timeTaken,
  questionsAndAnswers,
  replayQuiz,
  resetQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<"Stats" | "QNA">("Stats");

  const handleTabClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: MenuItemProps
  ) => {
    if (data.name === "Stats" || data.name === "QNA") {
      setActiveTab(data.name);
    }
  };

  return (
    <Container>
      <Menu fluid widths={2}>
        <Menu.Item
          name="Stats"
          active={activeTab === "Stats"}
          onClick={handleTabClick}
        />
        <Menu.Item
          name="QNA"
          active={activeTab === "QNA"}
          onClick={handleTabClick}
        />
      </Menu>
      {activeTab === "Stats" && (
        <Stats
          totalQuestions={totalQuestions}
          correctAnswers={correctAnswers}
          timeTaken={timeTaken}
          replayQuiz={replayQuiz}
          resetQuiz={resetQuiz}
        />
      )}
      {activeTab === "QNA" && <QNA questionsAndAnswers={questionsAndAnswers} />}
      <br />
    </Container>
  );
};

Result.propTypes = {
  totalQuestions: PropTypes.number.isRequired,
  correctAnswers: PropTypes.number.isRequired,
  timeTaken: PropTypes.number.isRequired,
  questionsAndAnswers: PropTypes.array.isRequired,
  replayQuiz: PropTypes.func.isRequired,
  resetQuiz: PropTypes.func.isRequired,
};

export default Result;
