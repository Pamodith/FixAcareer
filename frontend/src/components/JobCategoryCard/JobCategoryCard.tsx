import {
  Card,
  Image,
  Text,
  Group,
  Button,
  createStyles,
  rem,
} from "@mantine/core";
import { Category } from "../../interfaces";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    width: 350,
    height: 430,
    marginBottom: theme.spacing.md,
    marginRight: theme.spacing.md,
    marginLeft: theme.spacing.md,
  },

  section: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

interface JobCategoryCardProps {
  category: Category;
}

const JobCategoryCard: React.FC<JobCategoryCardProps> = ({ category }) => {
  const { classes } = useStyles();
  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image
          src={category.image}
          alt={category.name}
          width={"100%"}
          height={200}
        />
      </Card.Section>
      <Card.Section className={classes.section} mt="md">
        <Group position="apart">
          <Text fz="lg" fw={500}>
            {category.name}
          </Text>
        </Group>
        <Text
          fz="sm"
          mt="xs"
          h={160}
          style={{ overflow: "hidden", textAlign: "justify" }}
          color="gray"
        >
          {category.description}
        </Text>
      </Card.Section>
      <Group mt="xs">
        <Button
          radius="md"
          style={{ flex: 1 }}
          onClick={() => {
            return;
          }}
        >
          View Job Titles
        </Button>
      </Group>
    </Card>
  );
};

export default JobCategoryCard;
