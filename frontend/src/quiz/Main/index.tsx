import React, { useState } from "react";
import PropTypes from "prop-types";
import { Container, Segment, Item, Button, Message } from "semantic-ui-react";

import mindImg from "../../images/mind.svg";

import { shuffle } from "../../utils";

import Offline from "../Offline";

interface MainProps {
  startQuiz: (quizData: any[], countdownTime: number) => void;
}

const Main: React.FC<MainProps> = ({ startQuiz }) => {
  const category = "19";
  const numOfQuestions = "10";
  const difficulty = "0";
  const questionsType = "0";
  const countdownTime = {
    hours: 0,
    minutes: 0,
    seconds: 600,
  };
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [offline, setOffline] = useState<boolean>(false);

  let allFieldsSelected = false;
  if (
    category &&
    numOfQuestions &&
    difficulty &&
    questionsType &&
    (countdownTime.hours || countdownTime.minutes || countdownTime.seconds)
  ) {
    allFieldsSelected = true;
  }

  const fetchData = () => {
    setProcessing(true);

    if (error) setError(null);

    const API = `https://opentdb.com/api.php?amount=${numOfQuestions}&category=${category}&difficulty=${difficulty}&type=${questionsType}`;

    fetch(API)
      .then((respone) => respone.json())
      .then((data) =>
        setTimeout(() => {
          const { response_code, results } = data;

          if (response_code === 1) {
            const message = (
              <p>
                The API doesn't have enough questions for your query. (Ex.
                Asking for 50 Questions in a Category that only has 20.)
                <br />
                <br />
                Please change the <strong>No. of Questions</strong>,{" "}
                <strong>Difficulty Level</strong>, or{" "}
                <strong>Type of Questions</strong>.
              </p>
            );

            setProcessing(false);
            setError({ message });

            return;
          }

          results.forEach((element: any) => {
            element.options = shuffle([
              element.correct_answer,
              ...element.incorrect_answers,
            ]);
          });

          setProcessing(false);
          startQuiz(
            results,
            countdownTime.hours + countdownTime.minutes + countdownTime.seconds
          );
        }, 1000)
      )
      .catch((error) =>
        setTimeout(() => {
          if (!navigator.onLine) {
            setOffline(true);
          } else {
            setProcessing(false);
            setError(error);
          }
        }, 1000)
      );
  };

  if (offline) return <Offline />;

  return (
    <Container style={{ marginTop: "50px" }}>
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Image size="medium" src={mindImg} />
            <Item.Content style={{ margin: "auto" }}>
              <Item.Header>
                <h1>FixAcareer IQ Test</h1>
              </Item.Header>
              {error && (
                <Message error onDismiss={() => setError(null)}>
                  <Message.Header>Error!</Message.Header>
                  {error.message}
                </Message>
              )}
              <Item.Description>
                <p>
                  This is a free IQ test meant to provide insight into your
                  intelligence and personality. Results are accurate as we can
                  make them, but should be taken as indication only.
                </p>
              </Item.Description>
              <Item.Extra>
                <Button
                  primary
                  size="big"
                  icon="play"
                  labelPosition="left"
                  content={processing ? "Processing..." : "Start Now"}
                  onClick={fetchData}
                  disabled={!allFieldsSelected || processing}
                />
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <br />
    </Container>
  );
};

Main.propTypes = {
  startQuiz: PropTypes.func.isRequired,
};

export default Main;
