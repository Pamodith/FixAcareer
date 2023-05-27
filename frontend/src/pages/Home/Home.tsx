import {
  createStyles,
  Overlay,
  Container,
  Title,
  Button,
  Text,
  rem,
  Box,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  hero: {
    position: "relative",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  },

  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 1,
    position: "relative",
  },

  title: {
    color: theme.white,
    fontSize: rem(60),
    fontWeight: 900,
    lineHeight: 1.1,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(40),
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      lineHeight: 1.3,
    },
  },

  subtitle: {
    color: theme.white,
    maxWidth: 600,
    fontWeight: 600,
    lineHeight: 1.5,
    marginTop: theme.spacing.sm,

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
      fontSize: theme.fontSizes.md,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: theme.fontSizes.sm,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
      fontSize: theme.fontSizes.sm,
    },
  },

  control: {
    marginTop: `calc(${theme.spacing.xl} * 1.5)`,

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
}));

const Home = () => {
  //set the page title
  document.title = "FixAcareer - The ultimate career guidance platform";
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <Box className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container}>
        <Title className={classes.title}>Welcome to FixACareer!</Title>
        <Title className={classes.subtitle}>
          The ultimate career guidance platform
        </Title>
        <Text className={classes.description} size="xl" mt="xl">
          Login now to explore personalized career recommendations, access
          comprehensive job databases, and obtain your own career roadmap.
          Discover your strengths and interests by taking our IQ test, and let
          our system guide you towards your dream career. Don't hesitate any
          longer - log in now and unlock your full potential!
        </Text>

        <Button
          variant="gradient"
          size="xl"
          radius="xl"
          className={classes.control}
          onClick={() => navigate("/user/login")}
        >
          Get started
        </Button>
      </Container>
    </Box>
  );
};

export default Home;
