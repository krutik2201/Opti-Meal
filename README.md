# OptiMeal – Food Demand & Waste Optimization System

A clean, well-structured Flask backend for predicting daily food demand and minimizing kitchen waste. Built for small-scale kitchens: canteens, hostels, and NGOs.

---

## Folder Structure

```
backend/
├── app.py                     # Entry point — Flask factory, blueprint registration
├── config.py                  # Environment-aware configuration
├── requirements.txt
│
├── routes/
│   ├── predict.py             # POST /api/predict, GET /api/predict/sample
│   ├── waste.py               # POST /api/waste-analysis, GET /api/waste-analysis/sample
│   └── data.py                # GET /api/data, GET /api/data/<item>
│
├── services/
│   ├── predictor.py           # 7-day weighted moving average + time-slot weighting
│   └── waste_analyzer.py      # Waste metrics, classification, and aggregate summary
│
├── utils/
│   └── helpers.py             # Reusable utilities (timestamps, safe math, etc.)
│
└── data/
    └── sample_data.json       # Historical consumption dataset
```

---

## How to Run

```powershell
cd backend

# 1. Create a virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start the server
python app.py
```

Server runs at: `http://127.0.0.1:5000`

---

## API Endpoints

### `GET /health`
Server status check.

### `GET /api`
Returns an index of all available endpoints.

### `POST /api/predict`
Predict demand and get a preparation recommendation.

**Single Item Request:**
```json
{
    "item": "Rice",
    "history": [80, 85, 78, 90, 88, 84, 86],
    "time_slot": "lunch"
}
```

**Response:**
```json
{
    "mode": "single",
    "prediction": {
        "item": "Rice",
        "time_slot": "lunch",
        "base_average": 85.36,
        "slot_multiplier": 1.2,
        "raw_prediction": 102.43,
        "safety_factor": 0.95,
        "predicted_demand": 97.31,
        "recommended_quantity": 97,
        "recommendation": "Prepare 97 units of Rice for lunch service."
    }
}
```

**Batch Request:**
```json
{
    "items": [
        { "item": "Rice",    "history": [80,85,78,90,88,84,86], "time_slot": "lunch"   },
        { "item": "Chapati", "history": [60,58,62,65,59,61,63], "time_slot": "morning" },
        { "item": "Dal",     "history": [50,55,48,60,52,54,57], "time_slot": "evening" }
    ]
}
```

---

### `POST /api/waste-analysis`
Compute waste metrics by comparing predicted vs. actual consumption.

**Single Item Request:**
```json
{
    "item": "Rice",
    "predicted": 97,
    "actual": 80
}
```

**Response:**
```json
{
    "item": "Rice",
    "predicted": 97,
    "actual": 80,
    "waste_quantity": 17,
    "waste_percentage": 17.53,
    "efficiency_rate": 82.47,
    "status": "Moderate Waste",
    "tip": "Preparation is noticeably exceeding demand..."
}
```

**Batch Request:**
```json
{
    "comparisons": [
        { "item": "Rice",    "predicted": 97, "actual": 80 },
        { "item": "Chapati", "predicted": 52, "actual": 50 },
        { "item": "Dal",     "predicted": 48, "actual": 48 }
    ]
}
```

---

### `GET /api/data`
Returns the full historical dataset.

### `GET /api/data/<item_name>`
Returns historical records and stats for a specific item (e.g., `/api/data/rice`).

---

## Prediction Logic

```
1. Compute 7-Day Linearly Weighted Moving Average
   WMA = (1×d1 + 2×d2 + 3×d3 + 4×d4 + 5×d5 + 6×d6 + 7×d7) / 28

2. Apply Time-Slot Multiplier
   morning  → 0.85x (light breakfast)
   lunch    → 1.20x (peak meal)
   evening  → 1.00x (baseline dinner)

3. Apply Safety Factor (0.95)
   → Reduces chronic over-preparation

4. Round to nearest integer for practical quantity
```

---

## curl Quick Test

```bash
# Health check
curl http://127.0.0.1:5000/health

# Predict demand
curl -X POST http://127.0.0.1:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"item":"Rice","history":[80,85,78,90,88,84,86],"time_slot":"lunch"}'

# Waste analysis
curl -X POST http://127.0.0.1:5000/api/waste-analysis \
  -H "Content-Type: application/json" \
  -d '{"item":"Rice","predicted":97,"actual":80}'

# Get all data
curl http://127.0.0.1:5000/api/data

# Get data for a specific item
curl http://127.0.0.1:5000/api/data/rice
```
>>>>>>> b23648a (Initial commit - OptiMeal project)
