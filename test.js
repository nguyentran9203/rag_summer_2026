import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }); // reads ANTHROPIC_API_KEY from env
console.log("KEY LOADED:", process.env.ANTHROPIC_API_KEY?.slice(0, 15));
const abstract = `The rapid growth of unstructured data across industries has emphasized the need for clustering as a fundamental tool for discovering patterns, yet selecting an  appropriate clustering algorithm for a given dataset remains a persistent challenge. Traditional algorithm selection relies on an exhaustive trial-and-error method, which becomes increasingly impractical as dataset complexity grows. This thesis proposes a meta-learning approach in order to solve a classification problem, where a model predicts which  clustering algorithm has the most optimal performance, given arrays of meta-feature vectors describing a synthetic dataset.

Synthetic datasets with controlled variations in cluster shape, density and noise levels are generated and characterized via statistical and geometric meta-features. K-Means, K-Medoids, DBSCAN, HDBSCAN and Agglomerative Clustering are the main clustering algorithms assessed across the datasets and evaluated using the Adjusted Rand Index (ARI)  and Normalized Mutual Information (NMI)  as the performance criteria which provides ground truth labels required for training a predictive model. The resulting model deterministically learns to map dataset characteristics to the best performing algorithm.

The research addresses three main issues: which meta-features most strongly influence prediction accuracy, how the predictive model compares against baseline selection strategies using meta-learning, and whether its predictions could degrade when evaluated on data with increasing noise. 

Keywords: meta-features, clustering algorithm, predictive algorithm selection, synthetic data, meta-learning`
const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  system: "You summarize academic abstracts in 2-3 plain-English sentences, no jargon.",
  messages: [{ role: "user", content: abstract }],
});

console.log(response.content[0].text);

console.log(JSON.stringify(response, null, 2));