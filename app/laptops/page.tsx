import ProductFilterableGrid from '../components/ProductFilterableGrid';

export const metadata = {
    title: 'Laptops | Hi-sense',
    description: 'Browse our collection of premium used laptops.',
};

export default function LaptopsPage() {
    return (
        <div className="pt-20">
            <ProductFilterableGrid title="Laptops" />
        </div>
    );
}
