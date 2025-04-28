import { Navigate, useLocation } from 'react-router';

import { useSelector } from '../../services/store';
import { isLoadingSelector, isLogedInSelector } from '../../services/userSlice';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isLogedIn = useSelector(isLogedInSelector);
  const isLoading = useSelector(isLoadingSelector);
  const location = useLocation();

  if (!isLogedIn && isLoading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isLogedIn) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isLogedIn) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} state={location} />;
  }
  return children;
};
