import { IconHeart } from "@tabler/icons-react";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

interface JobCardProps {
  image: string;
  title: string;
  country: string;
  description: string;
  badges: {
    emoji: string;
    label: string;
  }[];

  mood?: "add" | "edit" | "view";
}

const JobCard: React.FC<JobCardProps> = ({
  image,
  title,
  country,
  description,
  badges,
  mood = "view",
}) => {
  const { classes, theme } = useStyles();

  const jobAddForm = useForm({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      title: "",
      description: "",
      category: "",
      image: "",
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
      image: "",
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
        width={100}
        height={100}
        fit="cover"
      />
    );
  });

  const [editFormImage, setEditFormImage] = useState<FileWithPath[]>([]);
  const [oldImage, setOldImage] = useState<string>("");
  const editFormImagePreview = editFormImage.map((image, index) => {
    const imageUrl = URL.createObjectURL(image);
    return (
      <Image
        key={index}
        src={imageUrl}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
        width={100}
        height={100}
        fit="cover"
      />
    );
  });

  if (mood === "add") {
    return (
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section>
          <Image src={image} alt={title} height={180} />
        </Card.Section>
      </Card>
    );
  }

  if (mood === "edit") {
    return (
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section>
          <Image src={image} alt={title} height={180} />
        </Card.Section>
      </Card>
    );
  }

  const features = badges.map((badge) => (
    <Badge
      color={theme.colorScheme === "dark" ? "dark" : "gray"}
      key={badge.label}
      leftSection={badge.emoji}
    >
      {badge.label}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={image} alt={title} height={180} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group position="apart">
          <Text fz="lg" fw={500}>
            {title}
          </Text>
          <Badge size="sm">{country}</Badge>
        </Group>
        <Text fz="sm" mt="xs">
          {description}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Perfect for you, if you enjoy
        </Text>
        <Group spacing={7} mt={5}>
          {features}
        </Group>
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }}>
          Show details
        </Button>
        <ActionIcon variant="default" radius="md" size={36}>
          <IconHeart size="1.1rem" className={classes.like} stroke={1.5} />
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default JobCard;
