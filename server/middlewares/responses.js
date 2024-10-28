const response = (res, message, status, result) => {
  if (status !== undefined) {
    res.status(status);
  }
  const payload = {
    message,
    ...(result && { result }),
  };
  return res.send(payload);
};

const required = (res, ...fields) => {
  const missingFields = fields
    .filter((field) => {
      const key = Object.keys(field)[0];
      const value = field[key];
      return !value || (typeof value === "string" && value.trim() === "");
    })
    .map((field) => Object.keys(field)[0]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }
};

export { required, response };
