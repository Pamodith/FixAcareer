import {
  createStyles,
  Group,
  Paper,
  SimpleGrid,
  Text,
  rem,
  Title,
} from "@mantine/core";
import {
  IconUserPlus,
  IconArrowUpRight,
  IconArrowDownRight,
  IconTrafficLights,
  IconArchive,
  IconBriefcase,
} from "@tabler/icons-react";
import StatsSegments from "./StatsSegments";

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
    minHeight: "70vh",
  },

  value: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

const icons = {
  user: IconUserPlus,
  pageViews: IconTrafficLights,
  jobCategories: IconArchive,
  jobs: IconBriefcase,
};

const data = [
  {
    title: "New users",
    icon: "user" as const,
    value: "12",
    diff: 100,
  },
  {
    title: "Page views",
    icon: "pageViews" as const,
    value: "345,765",
    diff: 120,
  },
  {
    title: "Job categories",
    icon: "jobCategories" as const,
    value: "10",
    diff: 12,
  },
  {
    title: "Jobs",
    icon: "jobs" as const,
    value: "8",
    diff: 20,
  },
];

const AdminDashboardStats: React.FC = () => {
  const { classes } = useStyles();
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group position="apart">
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size="1.4rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          <Text
            color={stat.diff > 0 ? "teal" : "red"}
            fz="sm"
            fw={500}
            className={classes.diff}
          >
            <span>{stat.diff}%</span>
            <DiffIcon size="1rem" stroke={1.5} />
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Compared to previous month
        </Text>
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <Title order={1} mt={50} ta={"center"}>
        Welcome to FixACareer Admin Dashboard!
      </Title>
      <Text mt={10} mb={20} ta={"center"}>
        Here you can manage all the data of the website.
      </Text>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
        mb={20}
      >
        {stats}
      </SimpleGrid>
      <StatsSegments />
    </div>
  );
};

export default AdminDashboardStats;
