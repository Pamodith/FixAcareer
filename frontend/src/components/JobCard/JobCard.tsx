import {
  IconAlertTriangle,
  IconCheck,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  Button,
  ActionIcon,
  createStyles,
  rem,
  Box,
  TextInput,
  Select,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { useState } from "react";
import { Category, Job } from "../../interfaces";
import { JobService } from "../../services";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "react-query";
import { openConfirmModal } from "@mantine/modals";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    width: 400,
    height: 485,
    marginBottom: theme.spacing.md,
    marginRight: theme.spacing.md,
    marginLeft: theme.spacing.md,
  },

  cardSimple: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    width: 350,
    height: 440,
    margin: theme.spacing.md,
  },

  section: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  delete: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

interface JobCardProps {
  mood?: "add" | "edit" | "view" | "simple";
  categories?: Category[];
  job?: Job;
  setAddJob?: React.Dispatch<React.SetStateAction<boolean>>;
}

const JobCard: React.FC<JobCardProps> = ({
  mood = "view",
  categories = [],
  job = {} as Job,
  setAddJob = () => {
    return;
  },
}) => {
  const queryClient = useQueryClient();
  const { classes } = useStyles();
  const [moody, setMoody] = useState<"add" | "edit" | "view" | "simple">(mood);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const jobAddForm = useForm({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      title: "",
      description: "",
      category: "",
      image: {} as FileWithPath,
    },
    validate: {
      title: (value) => (value.length === 0 ? "Title is required" : null),
      description: (value) =>
        value.length === 0 ? "Description is required" : null,
    },
  });

  const jobEditForm = useForm({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      _id: "",
      id: "",
      title: "",
      description: "",
      category: "",
      image: {} as FileWithPath,
    },
    validate: {
      title: (value) => (value.length === 0 ? "Title is required" : null),
      description: (value) =>
        value.length === 0 ? "Description is required" : null,
    },
  });

  const [addFormImage, setAddFormImage] = useState<FileWithPath[]>([]);
  const addFormImagePreview = addFormImage.map((image, index) => {
    const imageUrl = URL.createObjectURL(image);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        height={180}
        fit="cover"
      />
    );
  });

  const [editFormImage, setEditFormImage] = useState<FileWithPath[]>([]);
  const editFormImagePreview = editFormImage.map((image, index) => {
    const imageUrl = URL.createObjectURL(image);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        height={180}
        fit="cover"
      />
    );
  });

  //add job mutation
  const addJobMutation = useMutation(JobService.createJob, {
    onMutate: () => {
      setIsLoading(true);
      notifications.show({
        id: "creating-job",
        loading: true,
        title: "Creating Job",
        message: "Please wait while we create the job",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: () => {
      setAddJob(false);
      queryClient.invalidateQueries("jobs");
      jobAddForm.reset();
      setIsLoading(false);
      notifications.update({
        id: "creating-job",
        loading: false,
        title: "Creating Job",
        message: "Job created successfully",
        icon: <IconCheck size={14} />,
        autoClose: 2000,
      });
    },
    onError: (error) => {
      setIsLoading(false);
      notifications.update({
        id: "creating-job",
        loading: false,
        title: "Creating Job",
        message: "Error creating job " + error,
        icon: <IconAlertTriangle size={14} />,
        autoClose: 2000,
      });
    },
  });

  //edit job mutation
  const editJobMutation = useMutation(JobService.updateJob, {
    onMutate: () => {
      setIsLoading(true);
      notifications.show({
        id: "updating-job",
        loading: true,
        title: "Updating Job",
        message: "Please wait while we update the job",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("jobs");
      setMoody("view");
      jobEditForm.reset();
      setIsLoading(false);
      notifications.update({
        id: "updating-job",
        loading: false,
        color: "teal",
        title: "Job Updated",
        message: "Job updated successfully",
        icon: <IconCheck size={14} />,
        autoClose: 2000,
      });
    },
    onError: (error) => {
      setIsLoading(false);
      notifications.update({
        id: "updating-job",
        loading: false,
        color: "red",
        title: "Error Occured",
        message: "Error updating job " + error,
        icon: <IconAlertTriangle size={14} />,
        autoClose: 2000,
      });
    },
  });

  //delete job mutation
  const deleteJobMutation = useMutation(JobService.deleteJob, {
    onMutate: () => {
      setIsLoading(true);
      notifications.show({
        id: "deleting-job",
        loading: true,
        title: "Deleting Job",
        message: "Please wait while we delete the job",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("jobs");
      setIsLoading(false);
      notifications.update({
        id: "deleting-job",
        loading: false,
        title: "Deleting Job",
        message: "Job deleted successfully",
        icon: <IconCheck size={14} />,
        autoClose: 2000,
      });
    },
    onError: (error) => {
      setIsLoading(false);
      notifications.update({
        id: "deleting-job",
        loading: false,
        title: "Deleting Job",
        message: "Error deleting job " + error,
        icon: <IconAlertTriangle size={14} />,
        autoClose: 2000,
      });
    },
  });

  //Open delete modal
  const openDeleteModal = (id: string) =>
    openConfirmModal({
      title: "Delete this job?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this job? This action is irreversible.
        </Text>
      ),
      labels: {
        confirm: "Delete Anyway",
        cancel: "Cancel",
      },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteJobMutation.mutate(id);
      },
    });

  if (moody === "add") {
    return (
      <Card
        withBorder
        radius="md"
        pt={0}
        pl="md"
        pr="md"
        pb="md"
        className={classes.card}
      >
        <form
          onSubmit={jobAddForm.onSubmit((values) =>
            addJobMutation.mutate(values)
          )}
        >
          <Card.Section>
            <Box h={180}>
              {addFormImage.length === 0 && (
                <Image
                  src={null}
                  alt="empty image"
                  width={"100%"}
                  height={180}
                  withPlaceholder
                />
              )}
              {addFormImagePreview}
            </Box>
            <Dropzone
              accept={IMAGE_MIME_TYPE}
              onDrop={(acceptedFiles) => {
                setAddFormImage(acceptedFiles);
                jobAddForm.setFieldValue("image", acceptedFiles[0]);
              }}
              maxFiles={1}
              mt={-180}
              opacity={0.5}
              h={180}
            >
              <Text align="center" c="gray" mt={100}>
                Drop image here
              </Text>
            </Dropzone>
          </Card.Section>
          <Card.Section className={classes.section} mt="md" h={300}>
            <Group position="apart">
              <TextInput
                placeholder="Title"
                required
                {...jobAddForm.getInputProps("title")}
                size="sm"
                w={220}
              />
              <Select
                placeholder="Category"
                required
                data={categories.map((category) => ({
                  value: category._id,
                  label: category.name,
                }))}
                size="sm"
                w={170}
                {...jobAddForm.getInputProps("category")}
                mb={jobAddForm.errors.title ? 20 : 0}
              />
            </Group>
            <Textarea
              placeholder="Description"
              required
              {...jobAddForm.getInputProps("description")}
              size="sm"
              mt="sm"
              autosize
              minRows={8}
              maxRows={8}
            />
          </Card.Section>
          <Button
            mt="sm"
            radius="md"
            w={"100%"}
            disabled={addFormImage.length === 0}
            type="submit"
          >
            Add
          </Button>
        </form>
      </Card>
    );
  }

  if (moody === "edit") {
    return (
      <Card
        withBorder
        radius="md"
        pt={0}
        pl="md"
        pr="md"
        pb="md"
        className={classes.card}
      >
        <form
          onSubmit={jobEditForm.onSubmit((values) =>
            editJobMutation.mutate(values)
          )}
        >
          <Card.Section>
            <Box h={180}>
              {editFormImage.length === 0 && (
                <Image
                  src={job.image}
                  alt="empty image"
                  width={"100%"}
                  height={180}
                  withPlaceholder
                />
              )}
              {editFormImagePreview}
            </Box>
            <Dropzone
              accept={IMAGE_MIME_TYPE}
              onDrop={(acceptedFiles) => {
                setEditFormImage(acceptedFiles);
                jobEditForm.setFieldValue("image", acceptedFiles[0]);
              }}
              maxFiles={1}
              mt={-180}
              opacity={0.5}
              h={180}
            >
              <Text align="center" c="gray" mt={100}>
                Drop image here
              </Text>
            </Dropzone>
          </Card.Section>
          <Card.Section className={classes.section} mt="md" h={300}>
            <Group position="apart">
              <TextInput
                placeholder="Title"
                required
                {...jobEditForm.getInputProps("title")}
                size="sm"
                w={220}
                value={jobEditForm.values.title}
              />
              <Select
                placeholder="Category"
                required
                {...jobEditForm.getInputProps("category")}
                data={categories.map((category) => ({
                  value: category._id,
                  label: category.name,
                }))}
                size="sm"
                w={170}
                value={jobEditForm.values.category}
                defaultValue={jobEditForm.values.category}
                mb={jobAddForm.errors.title ? 20 : 0}
              />
            </Group>
            <Textarea
              placeholder="Description"
              required
              {...jobEditForm.getInputProps("description")}
              size="sm"
              mt="sm"
              autosize
              minRows={9}
              maxRows={9}
              value={jobEditForm.values.description}
            />
          </Card.Section>
          <Group mt="xs">
            <Button radius="md" style={{ flex: 1 }} type="submit">
              Save
            </Button>
            <ActionIcon
              variant="default"
              radius="md"
              size={36}
              onClick={() => {
                setMoody("view");
                jobEditForm.reset();
              }}
            >
              <IconX size="1.1rem" className={classes.delete} stroke={1.5} />
            </ActionIcon>
          </Group>
        </form>
      </Card>
    );
  }

  if (moody === "view") {
    return (
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section>
          <Image src={job.image} alt={job.title} width={"100%"} height={180} />
        </Card.Section>

        <Card.Section className={classes.section} mt="md" h={300}>
          <Group position="apart">
            <Text fz="lg" fw={500}>
              {job.title}
            </Text>
            <Badge size="md" miw={100}>
              {
                categories.find((category) => category._id === job.category)
                  ?.name
              }
            </Badge>
          </Group>
          <Text
            fz="sm"
            mt="xs"
            h={195}
            style={{ overflow: "hidden", textAlign: "justify" }}
            color="gray"
          >
            {job.description}
          </Text>
        </Card.Section>

        <Group mt="xs">
          <Button
            radius="md"
            style={{ flex: 1 }}
            onClick={() => {
              setMoody("edit");
              jobEditForm.setValues({
                _id: job._id,
                id: job._id,
                title: job.title,
                category: job.category,
                description: job.description,
              });
            }}
          >
            Edit Category
          </Button>
          <ActionIcon
            variant="default"
            radius="md"
            size={36}
            onClick={() => {
              openDeleteModal(job._id);
            }}
          >
            <IconTrash size="1.1rem" className={classes.delete} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Card>
    );
  }

  if (moody === "simple") {
    return (
      <Card withBorder radius="md" p="md" className={classes.cardSimple}>
        <Card.Section>
          <Image src={job.image} alt={job.title} width={"100%"} height={180} />
        </Card.Section>

        <Card.Section className={classes.section} mt="md">
          <Group position="apart">
            <Text fz="lg" fw={500}>
              {job.title}
            </Text>
            <Badge size="md" miw={100}>
              {
                categories.find((category) => category._id === job.category)
                  ?.name
              }
            </Badge>
          </Group>
          <Text
            fz="sm"
            mt="xs"
            h={195}
            style={{ overflow: "hidden", textAlign: "justify" }}
            color="gray"
          >
            {job.description}
          </Text>
        </Card.Section>

        <Group mt="xs">
          <Button
            radius="md"
            style={{ flex: 1 }}
            onClick={() => {
              navigate(`/user/job/${job._id}`);
            }}
          >
            View Roadmap
          </Button>
        </Group>
      </Card>
    );
  }

  return null;
};

export default JobCard;
