import {
  createStyles,
  Overlay,
  Container,
  Title,
  Button,
  Text,
} from "@mantine/core";

interface HeroProps {
  background: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonAction: string | (() => void);
}

const Hero = (props: HeroProps) => {
  const useStyles = createStyles((theme) => ({
    hero: {
      position: "relative",
      backgroundImage: `url(${props.background})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginTop: -60,
      height: "101vh",
    },

    container: {
      height: 700,
      marginLeft: 200,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      paddingBottom: `calc(${theme.spacing.xl} * 6)`,
      zIndex: 1,
      position: "relative",

      [theme.fn.smallerThan("sm")]: {
        height: 500,
        paddingBottom: `calc(${theme.spacing.xl} * 3)`,
      },
    },

    title: {
      color: theme.white,
      fontSize: 60,
      fontWeight: 900,
      lineHeight: 1.1,

      [theme.fn.smallerThan("sm")]: {
        fontSize: 40,
        lineHeight: 1.2,
      },

      [theme.fn.smallerThan("xs")]: {
        fontSize: 28,
        lineHeight: 1.3,
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
  const { classes } = useStyles();
  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container}>
        <Title className={classes.title} maw="95%">
          {props.title}
        </Title>
        <Text className={classes.description} size="xl" mt="xl">
          {props.description}
        </Text>

        <Button
          variant="gradient"
          size="xl"
          radius="xl"
          className={classes.control}
          onClick={() => {
            if (typeof props.buttonAction === "string") {
              window.location.href = props.buttonAction;
            } else {
              props.buttonAction();
            }
          }}
        >
          {props.buttonLabel}
        </Button>
      </Container>
    </div>
  );
};

export default Hero;
