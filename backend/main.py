"""
Cancer Risk Prediction API
FastAPI server that loads trained XGBoost model and provides predictions
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pickle
import pandas as pd
import uvicorn
from typing import Optional


# Initialize FastAPI app
app = FastAPI(
    title="Cancer Risk Prediction API",
    description="API for predicting cancer risk based on health metrics",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to store the model
model = None


# Request model for prediction
class HealthMetrics(BaseModel):
    age: int = Field(..., ge=18, le=100, description="Age in years")
    gender: int = Field(..., ge=0, le=1, description="Gender (0=Female, 1=Male)")
    bmi: float = Field(..., ge=10, le=50, description="Body Mass Index")
    smoking: int = Field(..., ge=0, le=1, description="Smoking status (0=non-smoker, 1=smoker)")
    genetic_risk: int = Field(..., ge=0, le=2, description="Genetic risk level (0=Low, 1=Medium, 2=High)")
    physical_activity: float = Field(..., ge=0, le=25, description="Physical activity in hours per week")
    alcohol_intake: float = Field(..., ge=0, le=10, description="Alcohol consumption (drinks per week)")
    cancer_history: int = Field(..., ge=0, le=1, description="Personal cancer history (0=No, 1=Yes)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "age": 45,
                "gender": 1,
                "bmi": 24.5,
                "smoking": 0,
                "genetic_risk": 1,
                "physical_activity": 7.0,
                "alcohol_intake": 2.0,
                "cancer_history": 0
            }
        }


# Response model
class PredictionResponse(BaseModel):
    risk_probability: float = Field(..., description="Cancer risk probability (0.0 to 1.0)")
    risk_percentage: float = Field(..., description="Cancer risk as percentage")
    risk_level: str = Field(..., description="Risk level category")
    input_data: HealthMetrics = Field(..., description="Input health metrics")


@app.on_event("startup")
async def load_model():
    """Load the trained model on startup"""
    global model
    try:
        with open('model.pkl', 'rb') as f:
            model = pickle.load(f)
        print("✓ Model loaded successfully!")
    except FileNotFoundError:
        print("ERROR: model.pkl not found. Please run train_model.py first.")
        raise


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Cancer Risk Prediction API",
        "status": "active",
        "model_loaded": model is not None
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_status": "loaded" if model is not None else "not_loaded"
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict_cancer_risk(metrics: HealthMetrics):
    """
    Predict cancer risk based on health metrics
    
    Returns:
    - risk_probability: Probability value between 0.0 and 1.0
    - risk_percentage: Same as probability but as percentage
    - risk_level: Categorical risk level (Low, Moderate, High, Very High)
    - input_data: Echo of the input data
    """
    if model is None:
        raise HTTPException(
            status_code=500,
            detail="Model not loaded. Please ensure model.pkl exists."
        )
    
    try:
        # Prepare input data for prediction (match CSV column names)
        input_df = pd.DataFrame([{
            'Age': metrics.age,
            'Gender': metrics.gender,
            'BMI': metrics.bmi,
            'Smoking': metrics.smoking,
            'GeneticRisk': metrics.genetic_risk,
            'PhysicalActivity': metrics.physical_activity,
            'AlcoholIntake': metrics.alcohol_intake,
            'CancerHistory': metrics.cancer_history
        }])
        
        # Get prediction probability (convert numpy to Python float)
        risk_proba = float(model.predict_proba(input_df)[0][1])
        risk_percentage = risk_proba * 100
        
        # Determine risk level
        if risk_proba < 0.25:
            risk_level = "Low"
        elif risk_proba < 0.50:
            risk_level = "Moderate"
        elif risk_proba < 0.75:
            risk_level = "High"
        else:
            risk_level = "Very High"
        
        return PredictionResponse(
            risk_probability=round(risk_proba, 4),
            risk_percentage=round(risk_percentage, 2),
            risk_level=risk_level,
            input_data=metrics
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.post("/predict-optimal")
async def predict_optimal_risk(metrics: HealthMetrics):
    """
    Calculate both current risk and optimal (lowest possible) risk
    Optimal risk assumes: non-smoker with ideal BMI and high activity
    """
    if model is None:
        raise HTTPException(
            status_code=500,
            detail="Model not loaded. Please ensure model.pkl exists."
        )
    
    try:
        # Current risk (match CSV column names)
        current_df = pd.DataFrame([{
            'Age': metrics.age,
            'Gender': metrics.gender,
            'BMI': metrics.bmi,
            'Smoking': metrics.smoking,
            'GeneticRisk': metrics.genetic_risk,
            'PhysicalActivity': metrics.physical_activity,
            'AlcoholIntake': metrics.alcohol_intake,
            'CancerHistory': metrics.cancer_history
        }])
        current_risk = float(model.predict_proba(current_df)[0][1])
        
        # Optimal risk (same age/gender, ideal lifestyle: BMI 22, no smoking, high activity, no alcohol, no history)
        optimal_df = pd.DataFrame([{
            'Age': metrics.age,
            'Gender': metrics.gender,
            'BMI': 22.0,
            'Smoking': 0,
            'GeneticRisk': 0,  # Assuming lowest genetic risk for optimal
            'PhysicalActivity': 15.0,
            'AlcoholIntake': 0.0,
            'CancerHistory': 0
        }])
        optimal_risk = float(model.predict_proba(optimal_df)[0][1])
        
        # Calculate potential risk reduction
        risk_reduction = max(0, (current_risk - optimal_risk) * 100)
        
        return {
            "current_risk_probability": round(current_risk, 4),
            "current_risk_percentage": round(current_risk * 100, 2),
            "optimal_risk_probability": round(optimal_risk, 4),
            "optimal_risk_percentage": round(optimal_risk * 100, 2),
            "potential_reduction_percentage": round(risk_reduction, 2),
            "input_data": metrics
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
