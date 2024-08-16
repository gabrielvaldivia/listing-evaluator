"use client";

import { useState } from "react";

export default function Home() {
  const [requirements, setRequirements] = useState("");
  const [listingUrl, setListingUrl] = useState("");
  const [result, setResult] = useState<{
    score: number;
    evaluation: string;
  } | null>(null);

  const handleEvaluate = async () => {
    const response = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requirements, listingUrl }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">House Listing Evaluator</h1>

      <textarea
        className="w-full p-2 mb-4 border rounded"
        placeholder="Enter your requirements"
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
      />

      <input
        type="text"
        className="w-full p-2 mb-4 border rounded"
        placeholder="Enter listing URL"
        value={listingUrl}
        onChange={(e) => setListingUrl(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleEvaluate}
      >
        Evaluate
      </button>

      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Results:</h2>
          <p>Score: {result.score}</p>
          <p>Evaluation: {result.evaluation}</p>
        </div>
      )}
    </main>
  );
}
