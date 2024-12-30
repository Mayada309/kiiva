'use client';
import Link from 'next/link';
import { Button } from '../ui/button';
import { FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useState, useEffect } from 'react';

function CartButton() {
  const [numItemsInCart, setNumItemsInCart] = useState(0);
  const cartItemsCount = useSelector(
    (state: RootState) => state.cart.cartItems?.length || 0
  );
  useEffect(() => {
    setNumItemsInCart(cartItemsCount);
  }, [cartItemsCount]);

  return (
    <Button
      asChild
      size='icon'
      className='flex justify-center items-center relative'
      variant={'outline'}
    >
      <Link href='/cart'>
        <FaShoppingCart className='text-slate-700 hover:text-orange-400' />
        <span className='absolute -top-3 -right-3 bg-slate-600 text-white h-6 w-6 rounded-full flex justify-center items-center hover:bg-orange-400'>
          {numItemsInCart}
        </span>
      </Link>
    </Button>
  );
}

export default CartButton;
