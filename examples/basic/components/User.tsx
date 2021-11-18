import { useEffect } from 'react';
import { createAtom, useAtom } from '../dist';

export const userAtom = createAtom('user', {
  id: '',
  name: '',
});

export const UserInfo = () => {
  const [user] = useAtom(userAtom);

  console.log('Render: UserInfo');

  return (
    <div>
      <p>id: {user.id}</p>
      <p>name: {user.name}</p>
    </div>
  );
};

export const Form = () => {
  const [user, dispatch] = useAtom(userAtom);

  console.log('Render: Form');

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
