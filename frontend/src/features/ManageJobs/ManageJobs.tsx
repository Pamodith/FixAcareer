import { useEffect, useState } from "react";
import { Category, Job } from "../../interfaces";
import { CategoryService, JobService } from "../../services";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import { useQuery } from "react-query";
import { sortJobs } from "../../utils";
import { JobCard, SearchWithAddButton } from "../../components";
import { Box, Grid, Text } from "@mantine/core";

const ManageJobs: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortedJobs, setSortedJobs] = useState<Job[]>([]);
  const sortBy: keyof Job = "createdAt";
  const reverseSortDirection = false;
  const [addJob, setAddJob] = useState(false);

  //Get all categories
  const { data: categories } = useQuery<Category[]>(
    "categories",
    CategoryService.getCategories
  );

  //get all jobs
  const { data: jobs, isLoading } = useQuery<Job[]>(
    "jobs",
    JobService.getJobs,
    {
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
    }
  );

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
      <SearchWithAddButton
        searchValue={search}
        handleSearchChange={handleSearchChange}
        setAddModalOpen={setAddJob}
        addButtonText="Add Job"
      />
      {sortedJobs?.length === 0 && addJob === false && (
        <Box mt={5} ta="center">
          <Text align="center" c="gray" mt={75} mb={75}>
            {isLoading
              ? "Loading jobs..."
              : "No jobs found. Click the Add Job button to add a job."}
          </Text>
        </Box>
      )}
      <Grid w={"90%"} m={"auto"}>
        {sortedJobs?.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            categories={categories}
            mood="view"
          />
        ))}
        {addJob && (
          <JobCard mood="add" categories={categories} setAddJob={setAddJob} />
        )}
      </Grid>
    </>
  );
};

export default ManageJobs;
