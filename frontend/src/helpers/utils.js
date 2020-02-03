export const getDeviceHostAddress = () => {
  return process.env.NODE_ENV === `development`
      ? `http://localhost:4000`
      : ``;
};
