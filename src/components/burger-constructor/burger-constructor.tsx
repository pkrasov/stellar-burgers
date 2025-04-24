import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';

import { isLogedInSelector } from '../../services/userSlice';
import { useNavigate } from 'react-router-dom';
import {
  addOrder,
  burgerSelector,
  clearBurger,
  clearOrder,
  isOrderLoadingSelector,
  modalOderSelector
} from '../../services/burgerSlice';
export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(burgerSelector);
  const orderRequest = useSelector(isOrderLoadingSelector);
  const orderModalData = useSelector(modalOderSelector);
  const isAuthenticated = useSelector(isLogedInSelector);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      return navigate('/login');
    }
    const { bun, ingredients } = constructorItems;
    if (!constructorItems.bun || orderRequest) return;
    const orderData = [
      bun?._id!,
      ...ingredients.map((ingredient) => ingredient._id),
      bun?._id!
    ];
    dispatch(addOrder(orderData));
  };
  const closeOrderModal = () => {
    navigate('/', { replace: true });
    dispatch(clearOrder());
    dispatch(clearBurger());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  //return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
