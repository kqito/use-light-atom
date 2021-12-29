import * as devLogObject from '../utils/devlog';

export const createDevlogMock = () => {
  return (
    jest
      .spyOn(devLogObject, 'devlog')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(() => {})
  );
};
