<div align="center">

## 🩺 Cancer Risk Simulator

### AI-Powered Cancer Risk Prediction with Real-Time ML Analysis

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0+-FF6600?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.ai/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)


**An interactive web application that predicts cancer risk using machine learning trained on real medical data with 93.7% accuracy**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Model](#-model-details) 

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)

- [Model Details](#-model-details)

- [Disclaimer](#%EF%B8%8F-disclaimer)

---

## 🌟 Overview

The **Cancer Risk Simulator** is a full-stack machine learning application that provides real-time cancer risk predictions based on 8 key health factors. Built with a modern tech stack, it combines a powerful XGBoost model (trained on 1,500 real patient records) with an intuitive React interface featuring live visualizations and instant feedback.

### 🎯 Key Highlights

- 🧠 **93.7% Accuracy** - XGBoost model trained on real medical data
- ⚡ **Real-Time Predictions** - Instant risk calculation as you adjust parameters
- 📊 **Interactive Visualizations** - Beautiful charts with Recharts
- 🎨 **Modern UI** - Glassmorphism design with Tailwind CSS
- 🔄 **Optimal Risk Comparison** - See potential improvements with lifestyle changes
- 🚀 **RESTful API** - FastAPI backend with automatic documentation

---

## ✨ Features

### 🩺 Health Metrics Analysis
- **8 Comprehensive Factors**: Age, Gender, BMI, Smoking Status, Genetic Risk, Physical Activity, Alcohol Intake, Cancer History
- **Real-Time Updates**: Predictions update automatically with debouncing (500ms)
- **Risk Categorization**: Low, Moderate, High, Very High with color-coded indicators

### 📈 Visualization & Insights
- **Current vs Optimal Risk**: Compare your risk with the best possible scenario
- **Interactive Charts**: Bar charts showing risk comparison
- **Potential Improvement**: Calculate possible risk reduction percentage
- **Color-Coded Results**: Visual feedback with dynamic color schemes

### 🔬 Machine Learning Backend
- **XGBoost Classifier**: Gradient boosting optimized for Mac M4
- **ROC-AUC Score**: 0.94+ on test data
- **Feature Importance**: Transparent model with interpretable features
- **Automatic Model Loading**: Serialized model (model.pkl) loaded on startup

### 🎨 User Experience
- **Glassmorphism Design**: Modern, elegant UI with blur effects
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Polished transitions and hover effects
- **Error Handling**: Clear error messages and loading states

---

## 🎬 Demo

### Live Interface
```
🖥️  Frontend: http://localhost:5173
📡  Backend API: http://localhost:8000
📖  API Docs: http://localhost:8000/docs
```

### Example Prediction Flow
1. **Adjust Health Metrics** → 2. **See Real-Time Risk Update** → 3. **View Optimal Comparison** → 4. **Analyze Improvement Potential**

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | Core Language | 3.11+ |
| ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white) | Web Framework | 0.104.1 |
| ![XGBoost](https://img.shields.io/badge/XGBoost-FF6600?style=flat) | ML Model | 2.0.3 |
| ![Scikit-learn](https://img.shields.io/badge/sklearn-F7931E?style=flat&logo=scikit-learn&logoColor=white) | ML Tools | 1.3.0+ |
| ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat&logo=pandas&logoColor=white) | Data Processing | 2.0.0+ |
| ![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat&logo=numpy&logoColor=white) | Numerical Computing | 1.24.0+ |

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | UI Library | 18.3.1 |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Build Tool | 6.0.11 |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | Styling | 3.4.17 |
| ![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat) | Data Visualization | 2.15.0 |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | HTTP Client | 1.7.9 |

---

## 📁 Project Structure

```
Cancer-Risk-Simulator/
├── 📂 backend/                      # Python FastAPI backend
│   ├── main.py                      # FastAPI application & endpoints
│   ├── train_model.py               # XGBoost model training script
│   ├── model.pkl                    # Serialized trained model
│   ├── requirements.txt             # Python dependencies
│   ├── The_Cancer_data_1500_V2.csv  # Training dataset (1,500 records)
│   └── __pycache__/                 # Python cache
│
├── 📂 frontend/                     # React + Vite frontend
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   └── RiskCalculator.jsx   # Main component (408 lines)
│   │   ├── 📂 assets/               # Static assets
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # Entry point
│   │   ├── App.css                  # Component styles
│   │   └── index.css                # Global styles + Tailwind
│   ├── 📂 public/                   # Public assets
│   ├── index.html                   # HTML template
│   ├── package.json                 # Node dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── postcss.config.js            # PostCSS configuration
│   └── eslint.config.js             # ESLint configuration
│
└── README.md                        # This file
```

---

## 🚀 Installation

### Prerequisites
- **Python 3.11+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Clone Repository
```bash
git clone https://github.com/yourusername/Cancer-Risk-Simulator.git
cd Cancer-Risk-Simulator
```

### Backend Setup

1️⃣ **Navigate to backend directory**
```bash
cd backend
```

2️⃣ **Create virtual environment**
```bash
python3 -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate   # Windows
```

3️⃣ **Install dependencies**
```bash
pip install -r requirements.txt
```

4️⃣ **Train the model** (optional - model.pkl included)
```bash
python train_model.py
```
**Output:**
```
✓ Model loaded successfully!
Accuracy: 0.9367
ROC-AUC Score: 0.9412
```

5️⃣ **Start backend server**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
✅ Backend running at: `http://localhost:8000`  
📖 API Docs: `http://localhost:8000/docs`

### Frontend Setup

1️⃣ **Navigate to frontend directory** (new terminal)
```bash
cd frontend
```

2️⃣ **Install dependencies**
```bash
npm install
```

3️⃣ **Start development server**
```bash
npm run dev
```
✅ Frontend running at: `http://localhost:5173`

---

## 💻 Usage

### Running the Application

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   source .venv/bin/activate
   uvicorn main:app --reload --port 8000
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Browser**: Navigate to `http://localhost:5173`

4. **Adjust Health Metrics**: Use sliders to input your health data

5. **View Results**: See real-time risk prediction and analysis

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

**Backend:**
```bash
# Use production ASGI server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

### Parameter Constraints

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `age` | int | 18-100 | Age in years |
| `gender` | int | 0-1 | 0=Female, 1=Male |
| `bmi` | float | 10-50 | Body Mass Index |
| `smoking` | int | 0-1 | 0=No, 1=Yes |
| `genetic_risk` | int | 0-2 | 0=Low, 1=Medium, 2=High |
| `physical_activity` | float | 0-25 | Hours per week |
| `alcohol_intake` | float | 0-10 | Drinks per week |
| `cancer_history` | int | 0-1 | 0=No, 1=Yes |


---

## 🧠 Model Details

### Training Data
- **Dataset**: Real cancer medical records
- **Size**: 1,500 patient records
- **Features**: 8 health metrics
- **Target**: Binary classification (Diagnosis: 0=No Cancer, 1=Cancer)

### Model Architecture
- **Algorithm**: XGBoost Classifier
- **Tree Method**: Histogram-based (optimized for CPU)
- **Hyperparameters**:
  - `n_estimators`: 150
  - `max_depth`: 6
  - `learning_rate`: 0.1
  - `eval_metric`: logloss

### Performance Metrics
| Metric | Score |
|--------|-------|
| **Accuracy** | 93.67% |
| **ROC-AUC** | 0.9412 |
| **Precision** | ~0.92 |
| **Recall** | ~0.94 |

### Feature Importance
Top factors influencing predictions:
1. 🧬 **Genetic Risk** - Highest importance
2. 👤 **Age** - Strong predictor
3. 🚬 **Smoking Status** - Significant impact
4. 📋 **Cancer History** - Critical factor
5. ⚖️ **BMI** - Moderate importance
6. 🏃 **Physical Activity** - Protective factor
7. 🍷 **Alcohol Intake** - Risk factor
8. ⚥ **Gender** - Baseline risk difference

### Risk Level Categories
- **Low**: < 25% probability (🟢 Green)
- **Moderate**: 25-50% (🟡 Yellow)
- **High**: 50-75% (🟠 Orange)
- **Very High**: > 75% (🔴 Red)


---

## ⚠️ Disclaimer

**IMPORTANT MEDICAL DISCLAIMER**

This application is for **educational and research purposes only**. While the model achieves 93.7% accuracy on test data:

- ❌ **NOT a substitute** for professional medical advice
- ❌ **NOT a diagnostic tool** for clinical use
- ❌ **NOT validated** for actual medical decision-making

**Always consult qualified healthcare professionals** for:
- Medical diagnoses
- Treatment plans
- Health screenings
- Cancer risk assessments

The predictions are based on statistical models and should be interpreted as educational demonstrations of machine learning capabilities.

---

