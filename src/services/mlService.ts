/**
 * Machine Learning Prediction Service Class
 * Handles asynchronous calls to the backend ML service layer.
 */

export interface PredictionRequest {
  connectedSources: string[];
  loanRequested: number;
  industryType: string;
  dateOfIncorporation: string;
  stressFactor: string;
}

export interface ShapValue {
  feature: string;
  value: string;
  shapValue: number;
  description: string;
  category: string;
}

export interface PredictionResponse {
  financialHealthScore: number;
  probabilityOfDefault: number;
  trustIndex: number;
  loanEligibility: string;
  riskCategory: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recommendedLoanAmount: number;
  businessInsights: string;
  scoreModifier: number;
  stressExplanation: string;
  connectedCount: number;
  baseValue: number;
  shapValues: ShapValue[];
  confidenceScore: number;
}

export class MLService {
  /**
   * Request credit assessment scores and insights from the ML backend.
   * @param request The prediction inputs, including connected data streams and macro parameters.
   * @returns A promise that resolves to the calculated scores and insights.
   */
  public static async getPrediction(request: PredictionRequest): Promise<PredictionResponse> {
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.details || errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data: PredictionResponse = await response.json();
      return data;
    } catch (error: any) {
      console.error("MLService.getPrediction failed:", error);
      throw new Error(error?.message || "Failed to retrieve alternate credit predictions.");
    }
  }
}
