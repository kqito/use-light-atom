import { useEffect } from 'react';
import { createAtom, useAtomDispatch, useAtomValue } from '../dist';

export const userAtom = createAtom('user', {
  id: '',
  name: '',
});

export const UserInfo = () => {
  const user = useAtomValue(userAtom);

  return (
    <div>
      <p>id: {user.id}</p>
      <p>name: {user.name}</p>
    </div>
  );
};

export const Form = () => {
  const dispatch = useAtomDispatch(userAtom);

  useEffect(() => {
    setTimeout(() => {
      dispatch(() => {
        return {
          id: 'id',
          name: 'name',
        };
      });
    }, 1000);
  }, []);

  return <div></div>;
};
