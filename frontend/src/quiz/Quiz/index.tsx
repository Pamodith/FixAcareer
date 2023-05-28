import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Segment,
  Item,
  Divider,
  Button,
  Icon,
  Message,
  Menu,
  Header,
} from "semantic-ui-react";
import he from "he";
import "./quiz.css";

import Countdown from "../Countdown";
import { getLetter } from "../../utils";

interface QuizProps {
  data: {
    question: string;
    correct_answer: string;
    options: string[];
  }[];
  countdownTime: number;
  endQuiz: (quizResults: {
    totalQuestions: number;
    correctAnswers: number;
    timeTaken: number | null;
    questionsAndAnswers: {
      question: string;
      user_answer: string | null;
      correct_answer: string;
      point: number;
    }[];
  }) => void;
}

const Quiz: React.FC<QuizProps> = ({ data, countdownTime, endQuiz }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userSelectedAns, setUserSelectedAns] = useState<string | null>(null);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState<
    {
      question: string;
      user_answer: string | null;
      correct_answer: string;
      point: number;
    }[]
  >([]);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);

  const handleItemClick = (
    e: React.MouseEvent,
    { name }: { name?: string }
  ) => {
    setUserSelectedAns(name || null);
  };

  const handleNext = () => {
    let point = 0;
    if (userSelectedAns === he.decode(data[questionIndex].correct_answer)) {
      point = 1;
    }

    const qna = [...questionsAndAnswers];
    qna.push({
      question: he.decode(data[questionIndex].question),
      user_answer: userSelectedAns,
      correct_answer: he.decode(data[questionIndex].correct_answer),
      point,
    });

    if (questionIndex === data.length - 1) {
      return endQuiz({
        totalQuestions: data.length,
        correctAnswers: correctAnswers + point,
        timeTaken,
        questionsAndAnswers: qna,
      });
    }

    setCorrectAnswers(correctAnswers + point);
    setQuestionIndex(questionIndex + 1);
    setUserSelectedAns(null);
    setQuestionsAndAnswers(qna);
  };

  const timeOver = (timeTaken: number) => {
    return endQuiz({
      totalQuestions: data.length,
      correctAnswers,
      timeTaken,
      questionsAndAnswers,
    });
  };

  return (
    <Item.Header>
      <Container>
        <Segment>
          <Item.Group divided>
            <Item>
              <Item.Content>
                <Item.Extra>
                  <Header as="h1" block floated="left">
                    <Icon name="info circle" />
                    <Header.Content>
                      {`Question No.${questionIndex + 1} of ${data.length}`}
                    </Header.Content>
                  </Header>
                  <Countdown
                    countdownTime={countdownTime}
                    timeOver={timeOver}
                    setTimeTaken={setTimeTaken}
                  />
                </Item.Extra>
                <br />
                <Item.Meta>
                  <Message size="huge" floating>
                    <b>{`Q. ${he.decode(data[questionIndex].question)}`}</b>
                  </Message>
                  <br />
                  <Item.Description>
                    <h3>Please choose one of the following answers:</h3>
                  </Item.Description>
                  <Divider />
                  <Menu vertical fluid size="massive">
                    {data[questionIndex].options.map((option, i) => {
                      const letter = getLetter(i);
                      const decodedOption = he.decode(option);

                      return (
                        <Menu.Item
                          key={decodedOption}
                          name={decodedOption}
                          active={userSelectedAns === decodedOption}
                          onClick={handleItemClick}
                        >
                          <b style={{ marginRight: "8px" }}>{letter}</b>
                          {decodedOption}
                        </Menu.Item>
                      );
                    })}
                  </Menu>
                </Item.Meta>
                <Divider />
                <Item.Extra>
                  <Button
                    primary
                    content="Next"
                    onClick={handleNext}
                    floated="right"
                    size="big"
                    icon="right chevron"
                    labelPosition="right"
                    disabled={!userSelectedAns}
                  />
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <br />
      </Container>
    </Item.Header>
  );
};

Quiz.propTypes = {
  data: PropTypes.array.isRequired,
  countdownTime: PropTypes.number.isRequired,
  endQuiz: PropTypes.func.isRequired,
};

export default Quiz;
