import PCFilterableGrid from '../components/PCFilterableGrid';

export const metadata = {
    title: 'PCs & Components | Hi-sense',
    description: 'Browse our collection of PC components and accessories.',
};

export default function PCsPage() {
    return (
        <div className="pt-20">
            <PCFilterableGrid title="PCs & Components" />
        </div>
    );
}
