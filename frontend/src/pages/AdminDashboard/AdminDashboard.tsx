import { Container, createStyles, Tabs } from "@mantine/core";
import { DashboardHeader } from "../../layout";
import { useNavigate, useParams } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  tabs: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },

  tabsList: {
    borderBottom: "none",
    marginTop: -38,
  },

  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: "transparent",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    },

    "&[data-active]": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[2],
    },
  },

  panel: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
}));

const AdminDashboard: React.FC = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { tabValue } = useParams();

  const tabs = [
    { label: "Dashboard", value: "stats" },
    { label: "Categories", value: "categories" },
    { label: "Jobs", value: "jobs" },
    { label: "Roadmaps", value: "roadmaps" },
    { label: "Quiz Questions", value: "quiz-questions" },
    { label: "Quiz Settings", value: "quiz-settings" },
    { label: "Administrators", value: "administrators" },
    { label: "Admin Settings", value: "settings" },
  ];

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab.value} key={tab.value} className={classes.tab}>
      {tab.label}
    </Tabs.Tab>
  ));

  return (
    <>
      <DashboardHeader />
      <Container>
        <Tabs
          defaultValue="stats"
          value={tabValue || "stats"}
          onTabChange={(value) => navigate(`/admin/dashboard/${value}`)}
          variant="outline"
          classNames={{
            root: classes.tabs,
            tabsList: classes.tabsList,
            tab: classes.tab,
            panel: classes.panel,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
          <Tabs.Panel value="stats">Dashboard</Tabs.Panel>
          <Tabs.Panel value="categories">Categories</Tabs.Panel>
          <Tabs.Panel value="jobs">Jobs</Tabs.Panel>
          <Tabs.Panel value="roadmaps">Roadmaps</Tabs.Panel>
          <Tabs.Panel value="quiz-questions">Quiz Questions</Tabs.Panel>
          <Tabs.Panel value="quiz-settings">Quiz Settings</Tabs.Panel>
          <Tabs.Panel value="administrators">Administrators</Tabs.Panel>
          <Tabs.Panel value="settings">Settings</Tabs.Panel>
        </Tabs>
      </Container>
    </>
  );
};

export default AdminDashboard;
