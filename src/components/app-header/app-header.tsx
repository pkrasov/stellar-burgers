import { FC } from 'react';
import { AppHeaderUI } from '@ui';

import { userSelector } from '../../services/userSlice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector(userSelector);

  return <AppHeaderUI userName={user?.name} />;
};
