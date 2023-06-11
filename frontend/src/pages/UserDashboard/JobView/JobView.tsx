import { useNavigate, useParams } from "react-router-dom";
import { Footer, UserHeaderMenu } from "../../../layout";
import { JobService, UserService } from "../../../services";
import { useQuery } from "react-query";
import { Job, RoadmapResponse } from "../../../interfaces";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Group,
  List,
  Stepper,
  Title as MantineTitle,
  Text,
  LoadingOverlay,
  DEFAULT_THEME,
} from "@mantine/core";
import { Hero } from "../../../components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getCurrentUserId } from "../../../utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const customLoader = (
  <svg
    width="54"
    height="54"
    viewBox="0 0 38 38"
    xmlns="http://www.w3.org/2000/svg"
    stroke={DEFAULT_THEME.colors.blue[6]}
  >
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)" strokeWidth="2">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 18 18"
            to="360 18 18"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>
    </g>
  </svg>
);

const JobView: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 7 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [isRoadMapLoading, setIsRoadMapLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<RoadmapResponse>();
  const [isRoadMapLoaded, setIsRoadMapLoaded] = useState(false);

  if (!jobId) {
    navigate("/user/dashboard/jobs");
  }

  const fetchJob = async () => {
    if (jobId) {
      return JobService.getJobById(jobId);
    }
  };

  const { data: job, isLoading } = useQuery<Job>("job", fetchJob, {
    onSuccess: () => {
      notifications.update({
        id: "loading-job",
        color: "teal",
        title: "Success",
        message: "Successfully loaded all job",
        icon: <IconCheck size={14} />,
        autoClose: 2000,
      });
    },
    onError: (error) => {
      notifications.update({
        id: "loading-job",
        color: "red",
        title: "Error",
        message: "Error loading job " + error,
        icon: <IconAlertTriangle size={14} />,
        autoClose: 2000,
      });
    },
  });

  useEffect(() => {
    if (isLoading) {
      notifications.show({
        id: "loading-job",
        loading: true,
        title: "Loading job",
        message: "Please wait while we load all job",
        autoClose: false,
        withCloseButton: false,
      });
    }
  }, [isLoading]);

  //get roadmap data
  const getRoadmapData = async (userId: string, jobRole: string) => {
    setIsRoadMapLoading(true);
    notifications.show({
      id: "loading-roadmap",
      loading: true,
      title: "Loading roadmap",
      message: "Please wait while we load roadmap",
      autoClose: false,
      withCloseButton: false,
    });
    UserService.getRoadmapsByUserIdAndJobTitle(userId, jobRole)
      .then((res) => {
        //convert string to json
        const convertedRoadmapData = JSON.parse(res.data.data.content);
        setRoadmapData(convertedRoadmapData);
        setIsRoadMapLoaded(true);
        notifications.update({
          id: "loading-roadmap",
          color: "teal",
          title: "Success",
          message: "Successfully loaded roadmap",
          icon: <IconCheck size={14} />,
          autoClose: 2000,
        });
        setIsRoadMapLoading(false);
      })
      .catch((err) => {
        console.log(err);
        notifications.update({
          id: "loading-roadmap",
          color: "red",
          title: "Error",
          message: "Error loading roadmap " + err,
          icon: <IconAlertTriangle size={14} />,
          autoClose: 2000,
        });
        setIsRoadMapLoading(false);
      });
  };

  //get roadmap handler
  const getRoadmapHandler = async () => {
    if (job) {
      //get user id
      const userID = getCurrentUserId();
      //get job role
      const jobRole = job.title;
      //get roadmap data
      await getRoadmapData(userID, jobRole);
    }
  };

  const labels = [
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
  ];

  const jobChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Number of jobs in Sri Lanka",
      },
    },
  };
  const JobChartData = {
    labels: labels,
    datasets: [
      {
        label: "Total Jobs",
        data: [
          2250, 2800, 2450, 5120, 6000, 7030, 8020, 9060, 9250, 9310, 9500,
          10300, 12250, 14500,
        ],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
      },
    ],
  };

  const salaryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Average salary in Sri Lanka",
      },
    },
  };
  const salaryChartData = {
    labels: labels,
    datasets: [
      {
        label: "Entry Level",
        data: [
          64000, 67000, 69000, 72000, 76000, 78000, 82000, 84000, 86000, 88000,
          90000, 110000, 120000, 122000,
        ],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
      },
      {
        label: "Mid Level",
        data: [
          80000, 83000, 86000, 89000, 92000, 95000, 98000, 101000, 99000, 97000,
          120000, 150000, 180000, 210000,
        ],
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        fill: false,
      },
      {
        label: "Senior Level",
        data: [
          115000, 120000, 125000, 122000, 118000, 124000, 130000, 135000,
          140000, 136000, 210000, 260000, 321000, 330000,
        ],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        fill: false,
      },
    ],
  };

  return (
    <>
      <UserHeaderMenu />
      <Box>
        {job && (
          <>
            <LoadingOverlay loader={customLoader} visible={isRoadMapLoading} />
            <Hero
              background={job.image}
              title={job.title}
              description={job.description}
              buttonLabel={"Learn How to become a " + job?.title}
              buttonAction={getRoadmapHandler}
            />
            {isRoadMapLoaded && (
              <>
                <Box id="get-started"></Box>
                <MantineTitle order={2} align="center" mt={30}>
                  {job.title} Statistics
                </MantineTitle>
                <Box w="60%" ml="auto" mr="auto" mt={20}>
                  <Line data={JobChartData} options={jobChartOptions} />
                </Box>
                <Box w="60%" ml="auto" mr="auto" mt={50}>
                  <Line data={salaryChartData} options={salaryChartOptions} />
                </Box>
                <MantineTitle order={2} align="center" mt={50}>
                  How to become a {job.title}
                </MantineTitle>
                <Text align="center" mt={10} color="gray">
                  These steps are genereted based on the information provided by
                  you when you created your profile.
                </Text>
                <Box w="60%" ml="auto" mr="auto" mt={50}>
                  <Stepper
                    active={active}
                    onStepClick={setActive}
                    orientation="vertical"
                    allowNextStepsSelect={false}
                    size="xl"
                    iconSize={80}
                  >
                    {roadmapData?.steps.map((step, index) => (
                      <Stepper.Step
                        key={index}
                        label={step.title}
                        description={step.description}
                      >
                        <MantineTitle order={3}>Step {index + 1}:</MantineTitle>
                        <List type="ordered">
                          {step.content.map((content, index) => (
                            <List.Item key={index}>{content}</List.Item>
                          ))}
                        </List>
                      </Stepper.Step>
                    ))}

                    <Stepper.Completed>
                      Congratulations! You have completed all steps.
                    </Stepper.Completed>
                  </Stepper>
                  <Group position="center" mt="xl" mb="sm">
                    <Button onClick={prevStep} w={100}>
                      Previous
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        setActive(0);
                      }}
                      w={100}
                    >
                      Reset
                    </Button>
                    <Button onClick={nextStep} w={100}>
                      Next
                    </Button>
                  </Group>
                  <Group position="center" mb="xl">
                    <Button
                      onClick={() => {
                        return;
                      }}
                      w={330}
                      variant="filled"
                    >
                      Save
                    </Button>
                  </Group>
                </Box>
              </>
            )}
          </>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default JobView;
