import dayjs from "dayjs";

export const getDateLabel = (eDate: string): "today" | "yesterday" | string => {
  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
  const inputDate = dayjs(eDate).format("YYYY-MM-DD");

  if (inputDate === today) {
    return "today";
  } else if (inputDate === yesterday) {
    return "yesterday";
  } else {
    return dayjs(eDate).format("MMMM D, YYYY");
  }
};

export const getDateTimeLabel = (eDate: string): string => {
  const inputDate = dayjs(eDate).format("YYYY-MM-DD HH:mm");
  return inputDate;
};
