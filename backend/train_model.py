"""
Cancer Risk Prediction Model Training Script
Trains an XGBoost classifier using real cancer data
"""

import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
import xgboost as xgb


def train_model():
    """Train XGBoost classifier on real cancer dataset"""
    
    print("Loading cancer dataset...")
    df = pd.read_csv('The_Cancer_data_1500_V2.csv')
    
    print(f"\nDataset shape: {df.shape}")
    print(f"\nColumn names: {list(df.columns)}")
    print(f"\nDataset distribution:")
    print(df['Diagnosis'].value_counts(normalize=True))
    print(f"\nDataset statistics:")
    print(df.describe())
    
    # Check for missing values
    if df.isnull().sum().sum() > 0:
        print("\nWarning: Missing values detected. Dropping rows with missing values...")
        df = df.dropna()
    
    # Prepare features and target
    # Using ALL columns from the dataset
    feature_columns = ['Age', 'Gender', 'BMI', 'Smoking', 'GeneticRisk', 
                      'PhysicalActivity', 'AlcoholIntake', 'CancerHistory']
    
    # Check if all required columns exist
    missing_cols = [col for col in feature_columns if col not in df.columns]
    if missing_cols:
        print(f"Error: Missing columns: {missing_cols}")
        print("Available columns:", df.columns.tolist())
        return None
    
    X = df[feature_columns]
    y = df['Diagnosis']
    
    print(f"\nUsing features: {feature_columns}")
    print(f"Feature statistics:")
    print(X.describe())
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\nTraining set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    
    # Train XGBoost model optimized for Mac M4 (CPU)
    print("\nTraining XGBoost model (optimized for Mac M4)...")
    model = xgb.XGBClassifier(
        n_estimators=150,
        max_depth=6,
        learning_rate=0.1,
        random_state=42,
        eval_metric='logloss',
        tree_method='hist',  # Optimized for CPU
        n_jobs=-1  # Use all CPU cores
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate model
    print("\nModel evaluation:")
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    accuracy = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_pred_proba)
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"ROC-AUC Score: {auc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Feature importance
    print("\nFeature Importance:")
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    print(feature_importance)
    
    # Save model
    print("\nSaving model to 'model.pkl'...")
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f, protocol=5)
    
    print("✓ Model saved successfully!")
    
    # Test prediction with sample data
    print("\n" + "="*60)
    print("Sample Predictions (Real Data Examples):")
    print("="*60)
    
    # Get some real examples from the dataset
    cancer_cases = df[df['Diagnosis'] == 1].head(3)
    non_cancer_cases = df[df['Diagnosis'] == 0].head(3)
    
    print("\nCancer Cases (Diagnosis = 1):")
    for idx, row in cancer_cases.iterrows():
        input_data = pd.DataFrame([{
            'Age': row['Age'],
            'BMI': row['BMI'],
            'Smoking': row['Smoking'],
            'PhysicalActivity': row['PhysicalActivity']
        }])
        risk_proba = model.predict_proba(input_data)[0][1]
        print(f"\n  Age: {row['Age']:.0f}, BMI: {row['BMI']:.1f}, Smoking: {row['Smoking']}, Activity: {row['PhysicalActivity']:.1f}h/week")
        print(f"  → Predicted Risk: {risk_proba:.1%} (Actual: Cancer)")
    
    print("\n" + "-"*60)
    print("Non-Cancer Cases (Diagnosis = 0):")
    for idx, row in non_cancer_cases.iterrows():
        input_data = pd.DataFrame([{
            'Age': row['Age'],
            'BMI': row['BMI'],
            'Smoking': row['Smoking'],
            'PhysicalActivity': row['PhysicalActivity']
        }])
        risk_proba = model.predict_proba(input_data)[0][1]
        print(f"\n  Age: {row['Age']:.0f}, BMI: {row['BMI']:.1f}, Smoking: {row['Smoking']}, Activity: {row['PhysicalActivity']:.1f}h/week")
        print(f"  → Predicted Risk: {risk_proba:.1%} (Actual: No Cancer)")
    
    print("\n" + "="*60)
    
    # Additional test with manual examples
    print("\nManual Test Cases:")
    print("="*60)
    
    test_cases = [
        {'Age': 30, 'BMI': 22, 'Smoking': 0, 'PhysicalActivity': 10, 'description': 'Healthy young adult'},
        {'Age': 65, 'BMI': 28, 'Smoking': 1, 'PhysicalActivity': 2, 'description': 'High-risk senior'},
        {'Age': 45, 'BMI': 24, 'Smoking': 0, 'PhysicalActivity': 7, 'description': 'Moderate risk'},
    ]
    
    for case in test_cases:
        input_data = pd.DataFrame([{
            'Age': case['Age'],
            'BMI': case['BMI'],
            'Smoking': case['Smoking'],
            'PhysicalActivity': case['PhysicalActivity']
        }])
        
        risk_proba = model.predict_proba(input_data)[0][1]
        print(f"\n{case['description']}:")
        print(f"  Age: {case['Age']}, BMI: {case['BMI']}, Smoking: {case['Smoking']}, Activity: {case['PhysicalActivity']}h/week")
        print(f"  → Cancer Risk Probability: {risk_proba:.1%}")
    
    print("\n" + "="*60)
    return model


if __name__ == "__main__":
    train_model()
