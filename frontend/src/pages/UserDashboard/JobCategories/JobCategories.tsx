import { useEffect, useState } from "react";
import { Category } from "../../../interfaces";
import { UserHeaderMenu } from "../../../layout";
import { Box, Grid, LoadingOverlay, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertTriangle, IconSearch } from "@tabler/icons-react";
import { useQuery } from "react-query";
import { CategoryService } from "../../../services";
import { sortCategories } from "../../../utils";
import { JobCategoryCard } from "../../../components";

const JobCategories: React.FC = () => {
  const [sortedCategories, setSortedCategories] = useState<Category[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const sortBy: keyof Category = "createdAt";
  const reverseSortDirection = false;

  //Get all categories
  const { data: categories, isLoading } = useQuery<Category[]>(
    "categories",
    CategoryService.getCategories,
    {
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
    }
  );

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

  return (
    <>
      <UserHeaderMenu noHero />
      <Box>
        <LoadingOverlay visible={isLoading} />
        <Box w={"90%"} m={"auto"}>
          <TextInput
            placeholder="Search by any field"
            icon={<IconSearch size={14} stroke={1.5} />}
            value={searchValue}
            onChange={handleSearchChange}
            w={"90%"}
            size="xl"
            ml="auto"
            mr="auto"
            mt="lg"
            mb="lg"
          />
          <Grid m={"auto"} w={"90%"}>
            {sortedCategories.length === 0 && (
              <Box w="100%" ta="center" fw="bold" mt="lg" mb="lg">
                No categories found
              </Box>
            )}
            {sortedCategories.map((category) => (
              <JobCategoryCard key={category.id} category={category} />
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default JobCategories;
