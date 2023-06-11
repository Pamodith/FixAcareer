import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { notifications } from "@mantine/notifications";
import {
  IconAlertTriangle,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconSearch,
  IconSelector,
  IconTrash,
} from "@tabler/icons-react";
import {
  Center,
  Group,
  UnstyledButton,
  createStyles,
  Text,
  Box,
  Button,
  ScrollArea,
  Table,
  TextInput,
  Badge,
  ActionIcon,
  Tooltip,
  Modal,
  Select,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { useForm } from "@mantine/form";
import { Admin } from "../../interfaces";
import { AdminService } from "../../services";
import { sortAdmins } from "../../utils";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

const Th: React.FC<ThProps> = ({ children, reversed, sorted, onSort }) => {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
};

const ManageAdmins: React.FC = () => {
  const queryClient = useQueryClient();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [sortedAdmins, setSortedAdmins] = useState(admins);
  const [sortBy, setSortBy] = useState<keyof Admin | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [search, setSearch] = useState("");
  const [addOpened, setAddOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);

  //fetch data from api and assign to admins
  const { isLoading } = useQuery("admins", AdminService.getAdmins, {
    onSuccess: (data) => {
      const adminData = data.map((admin: Admin) => ({
        ...admin,
        isActive: admin.isActive ? "true" : "false",
      }));
      setAdmins(adminData);
      const payload = {
        sortBy: null,
        reversed: false,
        search: "",
      };
      setSortedAdmins(sortAdmins(adminData, payload));
      notifications.show({
        id: "loading-admins",
        color: "teal",
        title: "Data loaded successfully",
        icon: <IconCheck size={16} />,
        message: "Data loaded successfully",
        autoClose: 2000,
      });
    },
    onError: (error: any) => {
      notifications.show({
        id: "loading-admins",
        color: "red",
        title: "There was an error loading the data",
        icon: <IconAlertTriangle size={16} />,
        message: error.message,
        autoClose: 2000,
      });
    },
  });

  //Add admin
  const addAdmin = useMutation(AdminService.createAdmin, {
    onMutate: () => {
      notifications.show({
        id: "add-admin",
        loading: true,
        title: "Adding admin...",
        message: "Adding admin...",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("admins");
      setAddOpened(false);
      addForm.reset();
      notifications.update({
        id: "add-admin",
        color: "teal",
        title: "Admin added successfully",
        icon: <IconCheck size={16} />,
        message: "Admin added successfully",
        autoClose: 2000,
      });
    },
    onError: (error: any) => {
      notifications.update({
        id: "add-admin",
        color: "red",
        title: "There was an error adding the admin",
        icon: <IconAlertTriangle size={16} />,
        message: error.message,
        autoClose: 2000,
      });
    },
  });

  //Edit admin
  const editAdmin = useMutation(AdminService.updateAdmin, {
    onMutate: () => {
      notifications.show({
        id: "edit-admin",
        loading: true,
        title: "Updating admin...",
        message: "Updating admin...",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("admins");
      setEditOpened(false);
      editForm.reset();
      notifications.update({
        id: "edit-admin",
        color: "teal",
        title: "Admin updated successfully",
        icon: <IconCheck size={16} />,
        message: "Admin updated successfully",
        autoClose: 2000,
      });
    },
    onError: (error: any) => {
      notifications.update({
        id: "edit-admin",
        color: "red",
        title: "There was an error updating the admin",
        icon: <IconAlertTriangle size={16} />,
        message: error.message,
        autoClose: 2000,
      });
    },
  });

  //Delete admin
  const deleteAdmin = useMutation(AdminService.deleteAdmin, {
    onMutate: () => {
      notifications.show({
        id: "delete-admin",
        loading: true,
        title: "Deleting admin...",
        message: "Deleting admin...",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("admins");
      notifications.update({
        id: "delete-admin",
        color: "teal",
        title: "Admin deleted successfully",
        icon: <IconCheck size={16} />,
        message: "Admin deleted successfully",
        autoClose: 2000,
      });
    },
    onError: (error: any) => {
      notifications.update({
        id: "delete-admin",
        color: "red",
        title: "There was an error deleting the admin",
        icon: <IconAlertTriangle size={16} />,
        message: error.message,
        autoClose: 2000,
      });
    },
  });

  //Open delete modal
  const openDeleteModal = (id: string) =>
    openConfirmModal({
      title: "Delete this administrator?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this administrator? This action cannot
          be undone.
        </Text>
      ),
      labels: {
        confirm: "Delete administrator",
        cancel: "No don't delete it",
      },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteAdmin.mutate(id);
      },
    });

  const setSorting = (field: keyof Admin) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedAdmins(sortAdmins(admins, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedAdmins(
      sortAdmins(admins, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  //declare add form
  const addForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
    },
    validate: {
      firstName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      lastName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Please enter a valid email address",
      phone: (value) =>
        /^\d{10}$/.test(value) ? null : "Please enter a valid phone number",
    },
  });

  //declare edit form
  const editForm = useForm({
    validateInputOnChange: true,
    initialValues: {
      _id: "",
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      isActive: true,
    },
    validate: {
      firstName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      lastName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Please enter a valid email address",
      phone: (value) =>
        /^\d{10}$/.test(value) ? null : "Please enter a valid phone number",
    },
  });

  const rows = sortedAdmins.map((admin) => (
    <tr>
      <td>{admin.id}</td>
      <td>{admin.firstName + " " + admin.lastName}</td>
      <td>{admin.email}</td>
      <td>{admin.phone}</td>
      <td>{admin.createdAt.slice(0, 10)}</td>
      <td>
        {admin.isActive ? (
          <Badge fullWidth>Active</Badge>
        ) : (
          <Badge color="gray" fullWidth>
            Disabled
          </Badge>
        )}
      </td>
      <td>
        <Box
          w={100}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Tooltip label="Edit Admin">
            <ActionIcon
              onClick={() => {
                setEditOpened(true);
                editForm.setValues({
                  _id: admin._id,
                  id: admin.id,
                  firstName: admin.firstName,
                  lastName: admin.lastName,
                  email: admin.email,
                  phone: admin.phone,
                  gender: admin.gender,
                  isActive: admin.isActive === "true" ? true : false,
                });
              }}
            >
              <IconEdit size="24px" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Admin">
            <ActionIcon onClick={() => openDeleteModal(admin._id)} color="red">
              <IconTrash size="24px" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Box>
      </td>
    </tr>
  ));

  return (
    <>
      <Modal
        opened={addOpened}
        onClose={() => {
          addForm.reset();
          setAddOpened(false);
        }}
        title="Add Administrator"
      >
        <form
          onSubmit={addForm.onSubmit((values) => {
            const newAdmin = {
              ...values,
              email: values.email.toLowerCase(),
            };
            addAdmin.mutate(newAdmin);
          })}
        >
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            {...addForm.getInputProps("firstName")}
            required
          />
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            {...addForm.getInputProps("lastName")}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            {...addForm.getInputProps("email")}
            required
          />
          <TextInput
            label="Phone"
            placeholder="Enter phone"
            {...addForm.getInputProps("phone")}
            required
          />
          <Select
            label="Gender"
            placeholder="Select gender"
            {...addForm.getInputProps("gender")}
            required
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Create
          </Button>
        </form>
      </Modal>
      <Modal
        opened={editOpened}
        onClose={() => {
          editForm.reset();
          setEditOpened(false);
        }}
        title="Edit Administrator"
      >
        <form
          onSubmit={editForm.onSubmit((values) => {
            const newAdmin = {
              ...values,
              email: values.email.toLowerCase(),
            };
            editAdmin.mutate(newAdmin);
          })}
        >
          <input {...editForm.getInputProps("_id")} readOnly required hidden />
          <TextInput
            label="Employee ID"
            readOnly
            required
            {...editForm.getInputProps("id")}
          />
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            {...editForm.getInputProps("firstName")}
            required
          />
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            {...editForm.getInputProps("lastName")}
            required
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            {...editForm.getInputProps("email")}
            required
          />
          <TextInput
            label="Phone"
            placeholder="Enter phone"
            {...editForm.getInputProps("phone")}
            required
          />
          <Select
            label="Gender"
            placeholder="Select gender"
            {...editForm.getInputProps("gender")}
            required
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            defaultValue={editForm.values.gender}
          />
          <Select
            label="Status"
            placeholder="Select status"
            required
            data={[
              { value: "active", label: "Active" },
              { value: "deactivated", label: "Deactivated" },
            ]}
            defaultValue={editForm.values.isActive ? "active" : "deactivated"}
            onChange={(value) => {
              editForm.setValues({
                ...editForm.values,
                isActive: value === "active" ? true : false,
              });
            }}
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Update
          </Button>
        </form>
      </Modal>
      <Box sx={{ margin: "20px", width: "100%", minHeight: "65vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
            sx={{ width: "300px" }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            mb="md"
          >
            <Button
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              sx={{ width: "200px", marginRight: "20px" }}
              onClick={() => setAddOpened(true)}
            >
              Add Administator
            </Button>
          </Box>
        </Box>
        <ScrollArea>
          <Table
            horizontalSpacing="0"
            verticalSpacing="xs"
            sx={{ tableLayout: "auto", width: "100%" }}
          >
            <thead>
              <tr>
                <Th
                  onSort={() => setSorting("id")}
                  sorted={sortBy === "id"}
                  reversed={reverseSortDirection}
                >
                  ID
                </Th>
                <Th
                  onSort={() => setSorting("firstName")}
                  sorted={sortBy === "firstName"}
                  reversed={reverseSortDirection}
                >
                  Name
                </Th>
                <Th
                  onSort={() => setSorting("email")}
                  sorted={sortBy === "email"}
                  reversed={reverseSortDirection}
                >
                  Email
                </Th>
                <Th
                  onSort={() => setSorting("phone")}
                  sorted={sortBy === "phone"}
                  reversed={reverseSortDirection}
                >
                  Phone
                </Th>
                <Th
                  onSort={() => setSorting("createdAt")}
                  sorted={sortBy === "createdAt"}
                  reversed={reverseSortDirection}
                >
                  Joined Date
                </Th>
                <Th
                  onSort={() => setSorting("isActive")}
                  sorted={sortBy === "isActive"}
                  reversed={reverseSortDirection}
                >
                  Status
                </Th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7}>
                    <Text weight={500} align="center">
                      Loading
                    </Text>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <Text weight={500} align="center">
                      No items found
                    </Text>
                  </td>
                </tr>
              ) : (
                rows
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </Box>
    </>
  );
};

export default ManageAdmins;
