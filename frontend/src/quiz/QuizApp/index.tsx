import React, { useState } from "react";

import Layout from "../Layout";
import Loader from "../Loader";
import Main from "../Main";
import Quiz from "../Quiz";
import Result from "../Result";

import { shuffle } from "../../utils";

const QuizApp: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [countdownTime, setCountdownTime] = useState<number | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [resultData, setResultData] = useState<any>(null);

  const startQuiz = (quizData: any, time: number) => {
    setLoading(true);
    setCountdownTime(time);

    setTimeout(() => {
      setData(quizData);
      setIsQuizStarted(true);
      setLoading(false);
    }, 1000);
  };

  const endQuiz = (result: any) => {
    setLoading(true);

    setTimeout(() => {
      setIsQuizStarted(false);
      setIsQuizCompleted(true);
      setResultData(result);
      setLoading(false);
    }, 2000);
  };

  const replayQuiz = () => {
    setLoading(true);

    const shuffledData = shuffle(data);
    shuffledData.forEach((element: any) => {
      element.options = shuffle(element.options);
    });

    setData(shuffledData);

    setTimeout(() => {
      setIsQuizStarted(true);
      setIsQuizCompleted(false);
      setResultData(null);
      setLoading(false);
    }, 1000);
  };

  const resetQuiz = () => {
    setLoading(true);

    setTimeout(() => {
      setData(null);
      setCountdownTime(null);
      setIsQuizStarted(false);
      setIsQuizCompleted(false);
      setResultData(null);
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      {loading && <Loader />}
      {!loading && !isQuizStarted && !isQuizCompleted && (
        <Main startQuiz={startQuiz} />
      )}
      {!loading && isQuizStarted && (
        <Quiz
          data={data}
          countdownTime={countdownTime || 0}
          endQuiz={endQuiz}
        />
      )}
      {!loading && isQuizCompleted && (
        <Result {...resultData} replayQuiz={replayQuiz} resetQuiz={resetQuiz} />
      )}
    </Layout>
  );
};

export default QuizApp;
