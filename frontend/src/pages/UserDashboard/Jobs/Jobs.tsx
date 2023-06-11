import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle, IconSearch } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Job, Category } from "../../../interfaces";
import { Footer, UserHeaderMenu } from "../../../layout";
import { CategoryService, JobService } from "../../../services";
import { sortJobs } from "../../../utils";
import { Box, TextInput } from "@mantine/core";
import { Grid } from "semantic-ui-react";
import { JobCard } from "../../../components";
import { useParams } from "react-router-dom";

const Jobs: React.FC = () => {
  //set the page title - FixACareer
  document.title = "Jobs | FixACareer";
  const [search, setSearch] = useState("");
  const [sortedJobs, setSortedJobs] = useState<Job[]>([]);
  const sortBy: keyof Job = "createdAt";
  const reverseSortDirection = false;

  const { catId } = useParams();

  //Get all categories
  const { data: categories } = useQuery<Category[]>(
    "categories",
    CategoryService.getCategories
  );

  const fetchJobs = async () => {
    if (catId) {
      return JobService.getJobsByCategory(catId);
    }
    return JobService.getJobs();
  };

  const { data: jobs, isLoading } = useQuery<Job[]>("jobs", fetchJobs, {
    onSuccess: (jobs) => {
      setSortedJobs(jobs);
      notifications.update({
        id: "loading-jobs",
        color: "teal",
        title: "Success",
        message: "Successfully loaded all jobs",
        icon: <IconCheck size={14} />,
        autoClose: 2000,
      });
    },
    onError: (error) => {
      notifications.update({
        id: "loading-jobs",
        color: "red",
        title: "Error",
        message: "Error loading jobs " + error,
        icon: <IconAlertTriangle size={14} />,
        autoClose: 2000,
      });
    },
  });

  useEffect(() => {
    if (isLoading) {
      notifications.show({
        id: "loading-jobs",
        loading: true,
        title: "Loading jobs",
        message: "Please wait while we load all jobs",
        autoClose: false,
        withCloseButton: false,
      });
    }
  }, [isLoading]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (jobs === undefined) return;
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedJobs(
      sortJobs(jobs, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };
  return (
    <>
      <UserHeaderMenu noHero />
      <Box mb={20}>
        <Box w={"90%"} m={"auto"}>
          <TextInput
            placeholder="Search by any field"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            w={"90%"}
            size="xl"
            ml="auto"
            mr="auto"
            mt="lg"
            mb="lg"
          />
          <Grid ml="auto" mr="auto" columns={3}>
            {sortedJobs.length === 0 && (
              <Box w="100%" ta="center" fw="bold" mt="lg" mb="lg">
                {isLoading ? "Loading..." : "No jobs found"}
              </Box>
            )}

            {sortedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                categories={categories}
                mood="simple"
              />
            ))}
          </Grid>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Jobs;
