import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Category } from "../../interfaces";
import { CategoryService } from "../../services";
import { sortCategories } from "../../utils";
import {
  Box,
  Tooltip,
  ActionIcon,
  ScrollArea,
  Table,
  Text,
  Modal,
  TextInput,
  Textarea,
  Button,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import { SearchWithAddButton, Th } from "../../components";
import { useForm } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

const ManageCategories: React.FC = () => {
  const queryClient = useQueryClient();
  const [sortedCategories, setSortedCategories] = useState<Category[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [sortBy, setSortBy] = useState<keyof Category>("id");
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  //Get all categories
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<Category[]>("categories", CategoryService.getCategories, {
    onSuccess: (categories) => {
      setSortedCategories(categories);
      notifications.update({
        id: "loading-categories",
        color: "teal",
        title: "Success",
        message: "Categories loaded successfully",
        icon: <IconCheck size={14} />,
        autoClose: 2000,
      });
    },
    onError: (error) => {
      notifications.update({
        id: "loading-categories",
        color: "red",
        title: "Error",
        message: "Error loading categories " + error,
        icon: <IconAlertTriangle size={14} />,
        autoClose: 2000,
      });
    },
  });

  useEffect(() => {
    if (isLoading) {
      notifications.show({
        id: "loading-categories",
        loading: true,
        title: "Loading Categories",
        message: "Please wait while we load all the categories",
        autoClose: false,
        withCloseButton: false,
      });
    }
  }, [isLoading]);

  //Add category
  const addCategoryMutation = useMutation(CategoryService.createCategory, {
    onMutate: () => {
      notifications.show({
        id: "creating-category",
        loading: true,
        title: "Creating Category",
        message: "Please wait while we create the category",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
      setAddModalOpen(false);
      categoryAddForm.reset();
      notifications.update({
        id: "creating-category",
        loading: false,
        title: "Creating Category",
        message: "Category created successfully",
        icon: <IconCheck size={14} />,
        autoClose: 2000,
      });
    },
    onError: (error) => {
      notifications.update({
        id: "creating-category",
        loading: false,
        title: "Creating Category",
        message: "Error creating category " + error,
        icon: <IconAlertTriangle size={14} />,
        autoClose: 2000,
      });
    },
  });

  //Edit category
  const editCategoryMutation = useMutation(CategoryService.updateCategory, {
    onMutate: () => {
      notifications.show({
        id: "updating-category",
        loading: true,
        title: "Updating Category",
        message: "Please wait while we update the category",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
      setEditModalOpen(false);
      categoryEditForm.reset();
      notifications.update({
        id: "updating-category",
        loading: false,
        title: "Updating Category",
        message: "Category updated successfully",
        icon: <IconCheck size={14} />,
        autoClose: 2000,
      });
    },
    onError: (error) => {
      notifications.update({
        id: "updating-category",
        loading: false,
        title: "Updating Category",
        message: "Error updating category " + error,
        icon: <IconAlertTriangle size={14} />,
        autoClose: 2000,
      });
    },
  });

  //Delete category
  const deleteCategoryMutation = useMutation(CategoryService.deleteCategory, {
    onMutate: () => {
      notifications.show({
        id: "deleting-category",
        loading: true,
        title: "Deleting Category",
        message: "Please wait while we delete the category",
        autoClose: false,
        withCloseButton: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
      setEditModalOpen(false);
      notifications.update({
        id: "deleting-category",
        loading: false,
        title: "Deleting Category",
        message: "Category deleted successfully",
        icon: <IconCheck size={14} />,
        autoClose: 2000,
      });
    },
    onError: (error) => {
      notifications.update({
        id: "deleting-category",
        loading: false,
        title: "Deleting Category",
        message: "Error deleting category " + error,
        icon: <IconAlertTriangle size={14} />,
        autoClose: 2000,
      });
    },
  });

  const setSorting = (field: keyof Category) => {
    if (categories === undefined) return;
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedCategories(
      sortCategories(categories, {
        sortBy: field,
        reversed,
        search: searchValue,
      })
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (categories === undefined) return;
    const { value } = event.currentTarget;
    setSearchValue(value);
    setSortedCategories(
      sortCategories(categories, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };

  const categoryAddForm = useForm({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters long" : null,
      description: (value) =>
        value.length === 0 ? "Description is required" : null,
    },
  });

  const categoryEditForm = useForm({
    validateInputOnChange: true,
    validateInputOnBlur: true,
    initialValues: {
      _id: "",
      id: "",
      name: "",
      description: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters long" : null,
      description: (value) =>
        value.length === 0 ? "Description is required" : null,
    },
  });

  //Open delete modal
  const openDeleteModal = (id: string) =>
    openConfirmModal({
      title: "Delete this Category?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this category? This action is
          irreversible.
        </Text>
      ),
      labels: {
        confirm: "Delete Anyway",
        cancel: "Cancel",
      },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteCategoryMutation.mutate(id);
      },
    });

  const rows = sortedCategories.map((category) => (
    <tr key={category._id}>
      <td>{category.id}</td>
      <td>{category.name}</td>
      <td>{category.addedBy}</td>
      <td>{category.createdAt.slice(0, 10)}</td>
      <td>{category.lastUpdatedBy}</td>
      <td>{category.updatedAt.slice(0, 10)}</td>
      <td>
        <Box
          w={100}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Tooltip label="Edit Category">
            <ActionIcon
              onClick={() => {
                categoryEditForm.setValues({
                  _id: category._id,
                  id: category.id,
                  name: category.name,
                  description: category.description,
                });
                setEditModalOpen(true);
              }}
            >
              <IconEdit size="24px" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Category">
            <ActionIcon
              onClick={() => {
                openDeleteModal(category._id);
              }}
              color="red"
            >
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
        opened={addModalOpen}
        onClose={() => {
          categoryAddForm.reset();
          setAddModalOpen(false);
        }}
        title="Add Category"
        size="md"
        yOffset={"10%"}
        xOffset={"auto"}
      >
        <form
          onSubmit={categoryAddForm.onSubmit((values) => {
            addCategoryMutation.mutate(values);
          })}
        >
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...categoryAddForm.getInputProps("name")}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            {...categoryAddForm.getInputProps("description")}
            required
            rows={3}
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Add Category
          </Button>
        </form>
      </Modal>
      <Modal
        opened={editModalOpen}
        onClose={() => {
          categoryEditForm.reset();
          setEditModalOpen(false);
        }}
        title={
          `Edit Category: ${categoryEditForm.values.name} (${categoryEditForm.values.id})` ||
          "Edit Category"
        }
        size="md"
        yOffset={"10%"}
        xOffset={"auto"}
      >
        <form
          onSubmit={categoryEditForm.onSubmit((values) => {
            editCategoryMutation.mutate(values);
          })}
        >
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...categoryEditForm.getInputProps("name")}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            {...categoryEditForm.getInputProps("description")}
            required
            rows={3}
          />
          <Button
            color="teal"
            sx={{ marginTop: "10px", width: "100%" }}
            type="submit"
          >
            Edit Category
          </Button>
        </form>
      </Modal>
      <SearchWithAddButton
        addButtonText="Add Category"
        setAddModalOpen={setAddModalOpen}
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
      />
      <ScrollArea>
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          sx={{ tableLayout: "auto", width: "100%" }}
        >
          <thead>
            <tr>
              <Th
                sorted={sortBy === "id"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("id")}
              >
                ID
              </Th>
              <Th
                sorted={sortBy === "name"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("name")}
              >
                Name
              </Th>
              <Th
                sorted={sortBy === "addedBy"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("addedBy")}
              >
                Added By
              </Th>
              <Th
                sorted={sortBy === "createdAt"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("createdAt")}
              >
                Created At
              </Th>
              <Th
                sorted={sortBy === "lastUpdatedBy"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("lastUpdatedBy")}
              >
                Last Updated By
              </Th>
              <Th
                sorted={sortBy === "updatedAt"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("updatedAt")}
              >
                Updated At
              </Th>
              <th>Actions</th>
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
                {isError ? (
                  <td colSpan={7}>
                    <Text weight={500} align="center">
                      Error occured while fetching data
                    </Text>
                  </td>
                ) : (
                  <td colSpan={7}>
                    <Text weight={500} align="center">
                      No data found
                    </Text>
                  </td>
                )}
              </tr>
            ) : (
              rows
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </>
  );
};

export default ManageCategories;
