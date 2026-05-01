import Calculator from '../components/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Rent vs. Invest Calculator</h1>
        <p className="text-lg text-gray-600">Determine your exact breakeven year by comparing homeownership against market investments.</p>
      </div>
      <Calculator />
    </main>
  );
}
