import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to Dashtly
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Your new dashboard application
        </p>
      </div>
    </div>
  );
}
