"use client"

import { useState } from "react"

export default function Examples() {
  const [activeTab, setActiveTab] = useState("legal")

  const examples = {
    legal: {
      original:
        "The parties hereto agree that the aforementioned provisions shall be deemed to be severable, and the invalidation of any portion thereof shall not affect the validity of the remainder, which shall remain in full force and effect. Notwithstanding the foregoing, if a court of competent jurisdiction determines that any restriction set forth herein is unenforceable, then the parties agree that such restriction shall be modified and reformed to the extent necessary to make it enforceable.",
      simplified:
        "If any part of this agreement is invalid, the rest still applies. If a court finds any restriction unenforceable, it will be modified to make it enforceable.",
    },
    academic: {
      original:
        "The empirical evidence suggests a statistically significant correlation between socioeconomic factors and educational attainment, with multivariate analysis indicating that parental education levels and household income are particularly salient predictors of academic performance across diverse demographic cohorts.",
      simplified:
        "Research shows that family income and parents' education strongly affect how well students do in school, regardless of background.",
    },
    tech: {
      original:
        "The implementation leverages asynchronous non-blocking I/O operations to optimize throughput in high-concurrency environments, while the caching layer utilizes a least-recently-used eviction policy to maintain optimal memory utilization during peak load scenarios.",
      simplified:
        "The system handles multiple tasks at once without waiting for each to finish. It also saves frequently used data in memory, removing the least used items when space is needed.",
    },
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex border-b border-border">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === "legal" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("legal")}
        >
          Legal
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === "academic" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("academic")}
        >
          Academic
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === "tech" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("tech")}
        >
          Technical
        </button>
      </div>

      <div className="mt-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-muted/30 p-6 rounded-lg border border-border">
            <h3 className="font-semibold mb-2">
              Original {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Text
            </h3>
            <p className="text-sm text-muted-foreground">{examples[activeTab].original}</p>
          </div>
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
            <h3 className="font-semibold mb-2">Simplified Version</h3>
            <p className="text-sm">{examples[activeTab].simplified}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

