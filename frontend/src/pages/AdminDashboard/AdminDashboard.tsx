import { Container, createStyles, Tabs } from "@mantine/core";
import { DashboardHeader, Footer } from "../../layout";
import { useNavigate, useParams } from "react-router-dom";
import {
  ManageCategories,
  ManageJobs,
  ManageQuizQuestions,
  QuizSettings,
  AdminSettings,
  ManageAdmins,
  AdminDashboardStats,
} from "../../features";

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
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { tabValue } = useParams();

  const tabs = [
    { label: "Dashboard", value: "stats" },
    { label: "Categories", value: "categories" },
    { label: "Jobs", value: "jobs" },
    { label: "Administrators", value: "administrators" },
    { label: "Admin Settings", value: "settings" },
  ];

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab.value} key={tab.value} className={classes.tab}>
      {tab.label}
    </Tabs.Tab>
  ));

  //set the page title - FixACareer
  document.title = "Admin Dashboard | FixACareer";

  return (
    <>
      <DashboardHeader />
      <Container maw={1200}>
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
          <Tabs.Panel value="stats">
            <AdminDashboardStats />
          </Tabs.Panel>
          <Tabs.Panel value="categories">
            <ManageCategories />
          </Tabs.Panel>
          <Tabs.Panel value="jobs">
            <ManageJobs />
          </Tabs.Panel>
          <Tabs.Panel value="administrators">
            <ManageAdmins />
          </Tabs.Panel>
          <Tabs.Panel value="settings">
            <AdminSettings />
          </Tabs.Panel>
        </Tabs>
      </Container>
      <Footer />
    </>
  );
};

export default AdminDashboard;
