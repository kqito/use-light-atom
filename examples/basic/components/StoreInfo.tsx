import { useAtom } from '../dist';
import { store } from '../pages/_app';
import { countAtom } from './Counter';
import { userAtom } from './User';

export const StoreInfo = () => {
  useAtom(countAtom);
  useAtom(userAtom);

  console.log('Store', store);

  return null;
};
