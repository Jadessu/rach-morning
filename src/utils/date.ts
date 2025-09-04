import dayjs from "dayjs";

export const todayKey = () => dayjs().format("YYYY-MM-DD");

export const msUntilMidnight = () => {
  const now = dayjs();
  const midnight = now.add(1, "day").startOf("day");
  return midnight.diff(now, "millisecond");
};

export const dayIndex = () => Number(dayjs().format("DDD")); // 1..366
