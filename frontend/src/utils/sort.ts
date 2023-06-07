import { Admin, Category, Job } from "../interfaces";
import { filterAdmins, filterCategories, filterJobs } from "./filter";

export const sortCategories = (
  data: Category[],
  payload: { sortBy: keyof Category | null; reversed: boolean; search: string }
) => {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterCategories(data, payload.search);
  }

  return filterCategories(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
};

export const sortJobs = (
  data: Job[],
  payload: { sortBy: keyof Job | null; reversed: boolean; search: string }
) => {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterJobs(data, payload.search);
  }

  return filterJobs(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
};

export function sortAdmins(
  data: Admin[],
  payload: { sortBy: keyof Admin | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterAdmins(data, payload.search);
  }

  return filterAdmins(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].toString().localeCompare(a[sortBy]);
      }

      return a[sortBy].toString().localeCompare(b[sortBy]);
    }),
    payload.search
  );
}
