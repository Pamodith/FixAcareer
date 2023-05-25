import { useEffect, useState } from "react";
import { Job } from "../../interfaces";
import { JobService } from "../../services";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import { useQuery } from "react-query";
import { sortJobs } from "../../utils";

const ManageJobs: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortedJobs, setSortedJobs] = useState<Job[]>([]);
  const sortBy: keyof Job = "createdAt";
  const reverseSortDirection = false;

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
    <div>
      <h1>Manage Jobs</h1>
    </div>
  );
};

export default ManageJobs;
