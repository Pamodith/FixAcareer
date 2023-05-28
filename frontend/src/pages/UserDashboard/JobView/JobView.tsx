import { useNavigate, useParams } from "react-router-dom";
import { Footer, UserHeaderMenu } from "../../../layout";
import { JobService } from "../../../services";
import { useQuery } from "react-query";
import { Job } from "../../../interfaces";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Group,
  List,
  LoadingOverlay,
  Stepper,
  Title as MantineTitle,
  Text,
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const JobView: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 7 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

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
        <LoadingOverlay visible={isLoading} />
        {job && (
          <>
            <Hero
              background={job.image}
              title={job.title}
              description={job.description}
              buttonLabel={"Learn How to become a " + job?.title}
              buttonAction={"#get-started"}
            />
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
              These steps are genereted based on the information provided by you
              when you created your profile.
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
                <Stepper.Step
                  label="Set clear goals and motivations"
                  description="Define your motivations and goals for becoming a software engineer."
                >
                  <MantineTitle order={3}>Step 1:</MantineTitle>
                  <List type="ordered">
                    <List.Item>
                      Research the software engineering field and understand its
                      various career paths and opportunities.
                    </List.Item>
                    <List.Item>
                      Identify the specific areas of software engineering that
                      interest you the most.
                    </List.Item>
                    <List.Item>
                      Set clear and achievable goals for your career as a
                      software engineer.
                    </List.Item>
                    <List.Item>
                      Understand the skills and knowledge required to succeed in
                      the field.
                    </List.Item>
                  </List>
                </Stepper.Step>

                <Stepper.Step
                  label="Develop foundational knowledge"
                  description="Learn the basics of computer science and programming languages."
                >
                  <MantineTitle order={3}>Step 2:</MantineTitle>
                  <List type="ordered">
                    <List.Item>
                      Start by learning the fundamentals of computer science,
                      including algorithms, data structures, and software
                      development methodologies.
                    </List.Item>
                    <List.Item>
                      Choose a programming language to focus on and learn its
                      syntax, concepts, and best practices.
                    </List.Item>
                    <List.Item>
                      Practice coding exercises and challenges to reinforce your
                      understanding of programming concepts.
                    </List.Item>
                    <List.Item>
                      Explore online resources, tutorials, and courses to
                      supplement your learning.
                    </List.Item>
                  </List>
                </Stepper.Step>

                <Stepper.Step
                  label="Pursue formal education"
                  description="Explore alternative educational paths, such as vocational courses or certifications."
                >
                  <MantineTitle order={3}>Step 3:</MantineTitle>
                  <List type="ordered">
                    <List.Item>
                      Although you mentioned failing your A/L exams, consider
                      alternative educational paths such as vocational courses,
                      coding bootcamps, or online certifications.
                    </List.Item>
                    <List.Item>
                      Research reputable institutions or online platforms that
                      offer flexible learning options for software engineering.
                    </List.Item>
                    <List.Item>
                      Look for programs that provide hands-on experience and
                      practical projects to build your skills.
                    </List.Item>
                    <List.Item>
                      Take advantage of any financial aid or scholarship
                      opportunities that may be available.
                    </List.Item>
                  </List>
                </Stepper.Step>

                <Stepper.Step
                  label="Build a strong programming skillset"
                  description="Practice coding regularly and work on small projects to enhance your skills."
                >
                  <MantineTitle order={3}>Step 4:</MantineTitle>
                  <List type="ordered">
                    <List.Item>
                      Dedicate regular time to coding practice and personal
                      projects to improve your programming skills.
                    </List.Item>
                    <List.Item>
                      Explore open-source projects and contribute to them to
                      gain experience collaborating with others.
                    </List.Item>
                    <List.Item>
                      Join coding communities or forums to engage with fellow
                      developers and learn from their experiences.
                    </List.Item>
                    <List.Item>
                      Consider participating in coding competitions or
                      hackathons to challenge yourself and apply your skills.
                    </List.Item>
                  </List>
                </Stepper.Step>

                <Stepper.Step
                  label="Create a portfolio"
                  description="Build a portfolio showcasing your projects and contributions."
                >
                  <MantineTitle order={3}>Step 5:</MantineTitle>
                  <List type="ordered">
                    <List.Item>
                      Develop a portfolio website or online presence to showcase
                      your projects and achievements.
                    </List.Item>
                    <List.Item>
                      Include a variety of projects that demonstrate your skills
                      in different areas of software engineering.
                    </List.Item>
                    <List.Item>
                      Document your contributions to open-source projects or any
                      freelance work you have done.
                    </List.Item>
                    <List.Item>
                      Write clear descriptions and provide code samples or links
                      to your projects for potential employers to review.
                    </List.Item>
                  </List>
                </Stepper.Step>

                <Stepper.Step
                  label="Seek internships or entry-level positions"
                  description="Apply for internships or entry-level positions to gain practical experience."
                >
                  <MantineTitle order={3}>Step 6:</MantineTitle>
                  <List type="ordered">
                    <List.Item>
                      Look for internships or entry-level positions at software
                      development companies or tech startups.
                    </List.Item>
                    <List.Item>
                      Tailor your resume and cover letter to highlight relevant
                      skills and projects from your portfolio.
                    </List.Item>
                    <List.Item>
                      Network with professionals in the industry through events,
                      meetups, or online platforms like LinkedIn.
                    </List.Item>
                    <List.Item>
                      Prepare for technical interviews by practicing coding
                      problems and reviewing common interview questions.
                    </List.Item>
                  </List>
                </Stepper.Step>

                <Stepper.Step
                  label="Continuously learn and grow"
                  description="Stay updated on the latest trends, technologies, and best practices."
                >
                  <MantineTitle order={3}>Step 7:</MantineTitle>
                  <List type="ordered">
                    <List.Item>
                      Stay informed about the latest advancements in software
                      engineering through blogs, forums, and industry
                      publications.
                    </List.Item>
                    <List.Item>
                      Follow influential software engineers and thought leaders
                      on social media to stay updated on trends and insights.
                    </List.Item>
                    <List.Item>
                      Attend conferences, workshops, or webinars to expand your
                      knowledge and network with professionals.
                    </List.Item>
                    <List.Item>
                      Consider pursuing higher education or specialized
                      certifications to enhance your qualifications and open up
                      new opportunities.
                    </List.Item>
                  </List>
                </Stepper.Step>

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
      </Box>
      <Footer />
    </>
  );
};

export default JobView;
