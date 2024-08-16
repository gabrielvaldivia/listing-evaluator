"use client";

import { useState } from "react";

export default function Home() {
  const [requirements, setRequirements] = useState("");
  const [listingUrl, setListingUrl] = useState("");
  const [result, setResult] = useState<{
    score?: number;
    evaluation?: string;
    error?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEvaluate = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirements, listingUrl }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw err;
      }
      const data = await response.json();
      setResult(data);
    } catch (error: unknown) {
      console.error("Error:", error);
      setResult({
        error: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
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
        disabled={isLoading}
      >
        {isLoading ? "Evaluating..." : "Evaluate"}
      </button>

      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Results:</h2>
          {result.error ? (
            <p className="text-red-500">Error: {result.error}</p>
          ) : (
            <>
              <p>Score: {result.score}</p>
              <p>Evaluation: {result.evaluation}</p>
            </>
          )}
        </div>
      )}
    </main>
  );
}
