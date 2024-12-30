import { Product } from '@/app/types';
import ProductCard from './ProductCard';
import Container from '../global/Container';

function ProductsList({ products }: { products?: Product[] }) {
  return (
    <Container className='flex items-center justify-center my-8'>
      <ul className='grid grid-cols-1 items-center justify-center md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
        {products
          ? products.map((product) => {
              return <ProductCard key={product.id} product={product} />;
            })
          : 'no products found'}
      </ul>
    </Container>
  );
}

export default ProductsList;
