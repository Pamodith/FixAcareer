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
  Text,
  Title,
} from "@mantine/core";
import { Hero } from "../../../components";

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
                  <Title order={3}>Step 1:</Title>
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
                  <Title order={3}>Step 2:</Title>
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
                  <Title order={3}>Step 3:</Title>
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
                  <Title order={3}>Step 4:</Title>
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
                  <Title order={3}>Step 5:</Title>
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
                  <Title order={3}>Step 6:</Title>
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
                  <Title order={3}>Step 7:</Title>
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
