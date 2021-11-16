// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const devlog = (...message: any) => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  console.log(message);
};
