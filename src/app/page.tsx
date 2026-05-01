import InvestorDashboard from "@/components/InvestorDashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Beyond NYT: Rent vs Buy Calculator
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            A high-fidelity financial modeling tool accounting for opportunity costs.
          </p>
        </div>

        <InvestorDashboard />
      </div>
    </main>
  );
}
