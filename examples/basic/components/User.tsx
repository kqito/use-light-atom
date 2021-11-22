import { useEffect } from 'react';
import { createAtom, useAtomSetState, useAtomState } from '../dist';

export const userAtom = createAtom('user', {
  id: '',
  name: '',
});

export const UserInfo = () => {
  const user = useAtomState(userAtom);

  return (
    <div>
      <p>id: {user.id}</p>
      <p>name: {user.name}</p>
    </div>
  );
};

export const Form = () => {
  const setState = useAtomSetState(userAtom);

  useEffect(() => {
    setTimeout(() => {
      setState(() => {
        return {
          id: 'id',
          name: 'name',
        };
      });
    }, 1000);
  }, []);

  return <div></div>;
};
