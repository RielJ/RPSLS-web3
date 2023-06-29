// Helper function to format the remaining time
export const formatTime = (mils: number) => {
  const milliseconds = 300_000 - mils;
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / 1000 / 60) % 60);

  if ((minutes === 0 && seconds === 0) || milliseconds <= 999) return "Elapsed";
  const secondsFormatted =
    seconds.toString().length === 1 ? `0${seconds}` : `${seconds}`;
  return minutes !== 0
    ? `${minutes}:${secondsFormatted} minutes left`
    : `${seconds} seconds left`;
};
