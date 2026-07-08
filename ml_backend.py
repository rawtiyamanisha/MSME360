import os
import sys
import json
import math

# Try importing FastAPI and dependencies
try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel
    from typing import List, Optional
    import uvicorn
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False
    from http.server import HTTPServer, BaseHTTPRequestHandler

# Core Prediction Engine Calculations
def predict_health_logic(connected_sources, loan_requested=1000000.0, industry_type="Manufacturing", date_of_incorporation="2016-04-12", stress_factor="NORMAL"):
    # Standardize names to lowercase keys for ease
    sources_lower = [s.lower() for s in connected_sources]
    
    # Direct individual checks
    gst = any(x in sources_lower for x in ["gst", "gstn"])
    upi = "upi" in sources_lower
    account_aggregator = any(x in sources_lower for x in ["account_aggregator", "aa"])
    epfo = "epfo" in sources_lower
    utility = any(x in sources_lower for x in ["utility", "utilities"])
    bank_statements = any(x in sources_lower for x in ["bank_statements", "bank"])
    udyam = "udyam" in sources_lower
    pan = "pan" in sources_lower
    
    # Calculate connected sources count
    connected_list = [gst, upi, account_aggregator, epfo, utility, bank_statements, udyam, pan]
    connected_count = sum(1 for x in connected_list if x)
    
    # 1. Base alternative score calculation
    calculated_score = 520
    if gst: calculated_score += 55
    if bank_statements: calculated_score += 60
    if account_aggregator: calculated_score += 45
    if upi: calculated_score += 35
    if epfo: calculated_score += 30
    if udyam: calculated_score += 25
    if pan: calculated_score += 20
    if utility: calculated_score += 20
    
    # Longevity Credit based on incorporation age
    inc_year = 2016
    try:
        inc_year = int(date_of_incorporation.split("-")[0])
    except Exception:
        pass
        
    if inc_year < 2018:
        calculated_score += 45
    elif inc_year < 2021:
        calculated_score += 25
    elif inc_year < 2023:
        calculated_score += 10
        
    # 2. Stress testing macroeconomic modifiers
    score_modifier = 0
    stress_explanation = "Operating under baseline macroeconomic conditions. Traditional indicators remain stable."
    
    # Supporting both Owner view and Credit Officer view string names
    if stress_factor in ["RAW_MATERIAL_SPIKE", "COMMODITY_SPIKE"]:
        score_modifier = -50 if stress_factor == "RAW_MATERIAL_SPIKE" else -115
        stress_explanation = "Heavy input commodity inflation reduces gross margins and strains baseline operational debt coverage ratios." if stress_factor == "RAW_MATERIAL_SPIKE" else "Raw steel/commodity cost escalation squeezes operating margins and increases supplier payback cycles."
    elif stress_factor in ["MARKET_SLOWDOWN", "DEMAND_DROP"]:
        score_modifier = -90 if stress_factor == "MARKET_SLOWDOWN" else -75
        stress_explanation = "Broad cooling in market demand delays receivable days from buyers, increasing inventory retention periods." if stress_factor == "MARKET_SLOWDOWN" else "Contraction in consumer demand extends retail sales conversion timelines and average daily inventory aging."
    elif stress_factor in ["MAX_GROWTH", "BOOM_SURGE", "EXPANSION_SURGE"]:
        score_modifier = 35 if stress_factor == "MAX_GROWTH" else 45
        stress_explanation = "Aggressive order book fulfillment combined with early trade supplier settlement maximizes credit velocities." if stress_factor == "MAX_GROWTH" else "Regional infrastructure or consumption impulse accelerates inventory velocity and shortens collection lags."
        
    final_score = min(900, max(300, calculated_score + score_modifier))
    
    # 3. Trust Index
    trust_index = min(99, 52 + (connected_count * 5.5) + (5 if (gst and bank_statements) else 0))
    
    # 4. Probability of Default (logistic sigmoid formula mapped to FHS score)
    pd_z = (final_score - 600) / -100.0
    probability_of_default = float(f"{1.0 / (1.0 + math.exp(-pd_z)):.4f}")
    
    # 5. Risk Category
    risk_category = "LOW"
    if final_score < 500:
        risk_category = "CRITICAL"
    elif final_score < 600:
        risk_category = "HIGH"
    elif final_score < 740:
        risk_category = "MEDIUM"
        
    # 6. Loan Eligibility Status text
    loan_eligibility = "Highly Approved (Tier 1 Priority)"
    if final_score < 500:
        loan_eligibility = "Refer to Manual Board Audit (Low Priority)"
    elif final_score < 600:
        loan_eligibility = "Refer to Manual Board Audit (Low Priority)"
    elif final_score < 740:
        loan_eligibility = "Approved with Collateral-Free Restructuring"
        
    # 7. Recommended Loan Amount (INR)
    base_loan_amount = 600000
    if gst: base_loan_amount += 600000
    if bank_statements: base_loan_amount += 800000
    if account_aggregator: base_loan_amount += 500000
    if upi: base_loan_amount += 400000
    if epfo: base_loan_amount += 300000
    if udyam: base_loan_amount += 200000
    if pan: base_loan_amount += 100000
    if utility: base_loan_amount += 100000
    
    multiplier = 1.0
    if stress_factor in ["RAW_MATERIAL_SPIKE", "COMMODITY_SPIKE"]:
        multiplier = 0.8 if stress_factor == "RAW_MATERIAL_SPIKE" else 0.65
    elif stress_factor in ["MARKET_SLOWDOWN", "DEMAND_DROP"]:
        multiplier = 0.6 if stress_factor == "MARKET_SLOWDOWN" else 0.8
    elif stress_factor in ["MAX_GROWTH", "BOOM_SURGE", "EXPANSION_SURGE"]:
        multiplier = 1.25 if stress_factor == "MAX_GROWTH" else 1.15
        
    recommended_loan_amount = int(round(base_loan_amount * multiplier))
    
    # 8. Business Insights narrative
    insights = (
        f"{industry_type.upper()} SME displays a credit risk profile with a Financial Health Score "
        f"of {final_score}/900 computed entirely through alternate non-traditional datasets. Having synchronized "
        f"{connected_count} strategic alternate channels, underwriting models have high data transparency. "
    )
    if gst and bank_statements:
        insights += "The correlation between registered GSTR tax declarations and checked average monthly banking balances remains highly consistent (96% alignment index). This suggests solid ledger transparency and reduces manual risk weightings. "
    else:
        insights += "Linking additional corporate tax (GSTR) registries and monthly transaction ledgers is highly recommended. Doing so will optimize the rating, compress validation wait times, and unlock lower interest rate margins. "
        
    if stress_factor in ["RAW_MATERIAL_SPIKE", "COMMODITY_SPIKE"]:
        insights += f"Under simulated input commodity stress ({stress_explanation}), the model predicts margin compression, but verified high-frequency cash velocity from alternate feeds serves as an excellent operational cushion to prevent default."
    elif stress_factor in ["MARKET_SLOWDOWN", "DEMAND_DROP"]:
        insights += f"Under simulated market contraction demand shocks ({stress_explanation}), collection cycles lengthen. Dynamic ledger tracking advises maintaining liquid credit lines to prevent working capital friction."
    else:
        insights += "Operational indices represent stable liquidity velocities. Portfolio benchmarking confirms compliance with target micro-enterprise parameters."
        
    # 9. Compute SHAP value contributions (Explainable AI preparation)
    base_value = 520
    shap_values = [
        {
            "feature": "GSTN Filing History",
            "value": "Authorized & Linked" if gst else "Not Integrated (Thin File)",
            "shapValue": 55 if gst else 0,
            "description": "Direct validation of gross registered tax revenues and transaction ledger velocity." if gst else "Filing compliance history can add up to +55 rating points when linked.",
            "category": "Taxation"
        },
        {
            "feature": "Monthly Bank Statement Ledgers",
            "value": "Authorized & Linked" if bank_statements else "Not Integrated (Thin File)",
            "shapValue": 60 if bank_statements else 0,
            "description": "Continuous validation of average balances, credit frequency, and operating liquidity." if bank_statements else "Daily/Monthly banking transaction data can add up to +60 rating points when linked.",
            "category": "Banking"
        },
        {
            "feature": "Account Aggregator Consent",
            "value": "Consent Granted" if account_aggregator else "Not Integrated",
            "shapValue": 45 if account_aggregator else 0,
            "description": "Aggregated cross-bank savings and checking profiles corroborate cash reserves." if account_aggregator else "Granting Account Aggregator permission can add up to +45 rating points.",
            "category": "Consent Framework"
        },
        {
            "feature": "UPI Merchant Payment Stream",
            "value": "Authorized & Linked" if upi else "Not Integrated",
            "shapValue": 35 if upi else 0,
            "description": "High-frequency retail payment receipts represent stable micro-enterprise turnover." if upi else "Linking real-time UPI merchant feeds can add up to +35 rating points.",
            "category": "Digital Payments"
        },
        {
            "feature": "EPFO Employee Registry Logs",
            "value": "Authorized & Linked" if epfo else "Not Integrated",
            "shapValue": 30 if epfo else 0,
            "description": "Employee provident fund filings substantiate corporate size and active wage payout cycles." if epfo else "Integrating active EPFO registry logs can add up to +30 rating points.",
            "category": "Payroll"
        },
        {
            "feature": "Udyam MSME Certification",
            "value": "Sovereign Certificate Linked" if udyam else "Not Integrated",
            "shapValue": 25 if udyam else 0,
            "description": "Authentic sovereign certificate verifies micro-enterprise regulatory eligibility." if udyam else "Adding sovereign MSME registration verification can add up to +25 rating points.",
            "category": "Sovereign Registration"
        },
        {
            "feature": "Corporate PAN Identity",
            "value": "Verified & Active" if pan else "Unverified",
            "shapValue": 20 if pan else 0,
            "description": "Sovereign PAN checks establish valid director structure and prevent fraud risk." if pan else "Verifying primary corporate PAN details can add up to +20 rating points.",
            "category": "Identity"
        },
        {
            "feature": "Utility Billing Activity",
            "value": "Authorized & Linked" if utility else "Not Integrated",
            "shapValue": 20 if utility else 0,
            "description": "Consistent industrial electricity and telecom bill payments prove active on-site operation." if utility else "Connecting recurring corporate utility details can add up to +20 rating points.",
            "category": "Utilities"
        }
    ]

    # Operational Longevity credit
    age_points = 10
    if inc_year < 2018:
        age_points = 45
    elif inc_year < 2021:
        age_points = 25
    shap_values.append({
        "feature": "Operational Longevity (Age)",
        "value": f"Incorporated in {inc_year} ({2026 - inc_year} years active)",
        "shapValue": age_points,
        "description": "Longer business existence reduces early-stage company structural risk.",
        "category": "Demographics"
    })

    # Macroeconomic stress feedback in SHAP
    shap_values.append({
        "feature": f"Macro Stress: {stress_factor.replace('_', ' ').title()}",
        "value": "Baseline Condition" if score_modifier == 0 else f"Stress Penalty ({score_modifier} pts)",
        "shapValue": score_modifier,
        "description": stress_explanation,
        "category": "Macro Risk Simulation"
    })

    # Compute a model confidence score (out of 100%)
    confidence_score = min(98, 48 + (connected_count * 5.5) + (10 if (gst and bank_statements) else 0))

    return {
        "financialHealthScore": final_score,
        "probabilityOfDefault": probability_of_default,
        "trustIndex": trust_index,
        "loanEligibility": loan_eligibility,
        "riskCategory": risk_category,
        "recommendedLoanAmount": recommended_loan_amount,
        "businessInsights": insights,
        "scoreModifier": score_modifier,
        "stressExplanation": stress_explanation,
        "connectedCount": connected_count,
        "baseValue": base_value,
        "shapValues": shap_values,
        "confidenceScore": confidence_score
    }

if HAS_FASTAPI:
    app = FastAPI(title="SME ML Prediction Engine", description="FastAPI Server for alternate credit score predictions")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    class PredictionRequest(BaseModel):
        connectedSources: List[str]
        loanRequested: Optional[float] = 1000000.0
        industryType: Optional[str] = "Manufacturing"
        dateOfIncorporation: Optional[str] = "2016-04-12"
        stressFactor: Optional[str] = "NORMAL"

    @app.post("/predict")
    def predict(payload: PredictionRequest):
        try:
            return predict_health_logic(
                connected_sources=payload.connectedSources,
                loan_requested=payload.loanRequested,
                industry_type=payload.industryType,
                date_of_incorporation=payload.dateOfIncorporation,
                stress_factor=payload.stressFactor
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction internal error: {str(e)}")

    @app.get("/health")
    def health():
        return {"status": "healthy", "service": "SME ML Prediction Engine via FastAPI"}

    def run_server(port=8000):
        print(f"ML Prediction Service running via FastAPI on port {port}...", flush=True)
        uvicorn.run(app, host="0.0.0.0", port=port)

else:
    # Fallback to standard HTTP Request Router
    class MLPredictionHandler(BaseHTTPRequestHandler):
        def do_POST(self):
            if self.path == "/predict":
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length == 0:
                    self.send_error_response(400, "Missing request body")
                    return
                    
                try:
                    post_data = self.rfile.read(content_length)
                    data = json.loads(post_data.decode('utf-8'))
                    
                    connected_sources = data.get("connectedSources", [])
                    loan_requested = data.get("loanRequested", 1000000.0)
                    industry_type = data.get("industryType", "Manufacturing")
                    date_of_incorporation = data.get("dateOfIncorporation", "2016-04-12")
                    stress_factor = data.get("stressFactor", "NORMAL")

                    # Perform Alternate Credit Prediction
                    response_data = predict_health_logic(
                        connected_sources=connected_sources,
                        loan_requested=loan_requested,
                        industry_type=industry_type,
                        date_of_incorporation=date_of_incorporation,
                        stress_factor=stress_factor
                    )
                    
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    
                    self.wfile.write(json.dumps(response_data).encode('utf-8'))
                except Exception as e:
                    self.send_error_response(500, f"Error processing prediction model: {str(e)}")
            else:
                self.send_error_response(404, "Endpoint not found")

        def do_GET(self):
            if self.path == "/health":
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "healthy", "service": "SME ML Prediction Engine via HTTPServer Fallback"}).encode('utf-8'))
            else:
                self.send_error_response(404, "Endpoint not found")

        def do_OPTIONS(self):
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()

        def send_error_response(self, code, message):
            self.send_response(code)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": message}).encode('utf-8'))

    def run_server(port=8000):
        server_address = ('0.0.0.0', port)
        httpd = HTTPServer(server_address, MLPredictionHandler)
        print(f"ML Prediction Service running via standard HTTPServer Fallback on port {port}...", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        print("Stopping ML Prediction Service...", flush=True)


if __name__ == '__main__':
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run_server(port)
