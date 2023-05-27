import { Hero } from "../../../components";
import { Footer, UserHeaderMenu } from "../../../layout";
import HEROBG from "../../../assets/career-path-featured.png";
import {
  Box,
  rem,
  createStyles,
  Title,
  Button,
  Text,
  Image,
} from "@mantine/core";
import JOBCATEGORIES from "../../../assets/job-categories.jpg";
import IQTEST from "../../../assets/iq-test.png";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    padding: `calc(${theme.spacing.xl} * 2)`,
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[3]
    }`,
    width: "75%",
    height: 400,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column-reverse",
      padding: theme.spacing.xl,
    },
  },

  image: {
    maxWidth: "40%",

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
    },
  },

  body: {
    paddingRight: `calc(${theme.spacing.xl} * 4)`,

    [theme.fn.smallerThan("sm")]: {
      paddingRight: 0,
      marginTop: theme.spacing.xl,
    },
  },

  body2: {
    paddingLeft: `calc(${theme.spacing.xl} * 4)`,
    textAlign: "right",

    [theme.fn.smallerThan("sm")]: {
      paddingRight: 0,
      marginTop: theme.spacing.xl,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
  },

  controls: {
    display: "flex",
    marginTop: theme.spacing.xl,
  },

  controls2: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: theme.spacing.xl,
  },

  inputWrapper: {
    width: "100%",
    flex: "1",
  },

  input: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: 0,
  },
}));

const UserHome = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  return (
    <>
      <UserHeaderMenu />
      <Hero
        background={HEROBG}
        title={"Welcome Back to FixACareer Platform!"}
        description={
          "Let's explore personalized career recommendations, access comprehensive job databases, and obtain your own career roadmap. Discover your strengths and interests by taking our IQ test, and let our system guide you towards your dream career."
        }
        buttonLabel={"Let's get started"}
        buttonLink={"#get-tarted"}
      />
      <Box id="get-tarted" className={classes.wrapper}>
        <Box className={classes.body}>
          <Title className={classes.title}>Take our IQ Test</Title>
          <Text fw={500} fz="lg" mb={5}>
            Discover your strengths and interests
          </Text>
          <Text fz="sm" c="dimmed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatum, quibusdam, quos, voluptate voluptas quia quod
            reprehenderit quae voluptatibus quidem doloribus. Quisquam
            voluptatum, quibusdam, quos, voluptate voluptas quia quod
          </Text>

          <Box className={classes.controls}>
            <Button
              w={"50%"}
              onClick={() => {
                navigate("/user/iq-test");
              }}
            >
              Take the Test
            </Button>
          </Box>
        </Box>
        <Image
          src={IQTEST}
          className={classes.image}
          width={400}
          height={400}
        />
      </Box>
      <Box className={classes.wrapper}>
        <Image
          src={JOBCATEGORIES}
          className={classes.image}
          width={400}
          height={400}
        />
        <Box className={classes.body2}>
          <Title className={classes.title}>Browse Job Categories</Title>
          <Text fw={500} fz="lg" mb={5}>
            Let's explore personalized career recommendations
          </Text>
          <Text fz="sm" c="dimmed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatum, quibusdam, quos, voluptate voluptas quia quod
            reprehenderit quae voluptatibus quidem doloribus. Quisquam
            voluptatum, quibusdam, quos, voluptate voluptas quia quod
          </Text>

          <Box className={classes.controls2}>
            <Button
              w={"50%"}
              onClick={() => {
                navigate("/user/job-categories");
              }}
            >
              Browse Job Categories
            </Button>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default UserHome;
