import { Hero } from "../../../components";
import { Footer, UserHeaderMenu } from "../../../layout";
import IQTESTBG from "../../../assets/iq-test-bg.jpg";
import { Box } from "@mantine/core";
import QuizApp from "../../../quiz";
import { useState } from "react";

const IQTest = () => {
  const [takeTest, setTakeTest] = useState(false);

  const handleTakeTest = () => {
    setTakeTest(true);
  };

  return (
    <>
      <UserHeaderMenu noHero={takeTest} />
      {!takeTest ? (
        <Hero
          background={IQTESTBG}
          title={"Find out your IQ Score With Our Free IQ Test"}
          description={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquamnvoluptatum, quibusdam, quos, voluptate voluptas quia quodreprehenderit quae voluptatibus quidem doloribus. Quisquamvoluptatum, quibusdam, quos, voluptate voluptas quia quod"
          }
          buttonLabel={"Take the Test"}
          buttonAction={handleTakeTest}
        />
      ) : (
        <Box id="get-tarted" w="90%" p={20} m="auto">
          <QuizApp />
        </Box>
      )}
      <Footer />
    </>
  );
};

export default IQTest;
