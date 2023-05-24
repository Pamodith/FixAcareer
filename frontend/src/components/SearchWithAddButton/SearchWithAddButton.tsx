import { Box, TextInput, Button } from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";

interface SearchWithAddButtonProps {
  setAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchValue: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  addButtonText: string;
}

const SearchWithAddButton: React.FC<SearchWithAddButtonProps> = ({
  setAddModalOpen,
  searchValue,
  handleSearchChange,
  addButtonText,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      mt={10}
    >
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size={14} stroke={1.5} />}
        value={searchValue}
        onChange={handleSearchChange}
        sx={{ width: "300px" }}
      />
      <Button
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan" }}
        sx={{ width: "200px" }}
        onClick={() => setAddModalOpen(true)}
        rightIcon={<IconPlus size={18} />}
      >
        {addButtonText}
      </Button>
    </Box>
  );
};

export default SearchWithAddButton;
