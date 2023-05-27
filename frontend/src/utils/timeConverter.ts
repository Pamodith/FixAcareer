const timeConverter = (
  milliseconds: number | null | undefined
): { hours: string | null; minutes: string | null; seconds: string | null } => {
  if (
    milliseconds === null ||
    milliseconds === undefined ||
    typeof milliseconds !== "number"
  ) {
    return { hours: null, minutes: null, seconds: null };
  }
  const hours: string = `0${Math.floor(milliseconds / 3600000)}`.slice(-2);
  const minutes: string = `0${Math.floor((milliseconds / 60000) % 60)}`.slice(
    -2
  );
  const seconds: string = `0${
    Math.floor((milliseconds / 1000) % 60) % 60
  }`.slice(-2);

  return {
    hours,
    minutes,
    seconds,
  };
};

export default timeConverter;
