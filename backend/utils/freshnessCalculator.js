exports.calculateFreshness = (preparedAt, expiryTimeHours) => {
  const preparedTime = new Date(preparedAt).getTime();
  const currentTime = Date.now();

  let elapsedHours =
    (currentTime - preparedTime) / (1000 * 60 * 60);

  // Prevent future-time bug
  if (elapsedHours < 0) elapsedHours = 0;

  let freshness =
    100 - (elapsedHours / expiryTimeHours) * 100;

  return Math.max(0, Math.min(100, Math.round(freshness)));
};
