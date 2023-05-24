import { keys } from "@mantine/utils";
import { Category } from "../interfaces";

export const filterCategories = (data: Category[], search: string) => {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) =>
      item[key].toString().toLowerCase().includes(query)
    )
  );
};
