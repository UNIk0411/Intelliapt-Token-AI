# IntelliAPT 

## **AI-Powered Token Prediction on Aptos**
IntelliAPT is an AI-driven token price prediction platform that seamlessly integrates with the **Aptos blockchain** using **Move smart contracts**. This system leverages **machine learning** to analyze historical data and forecast future token values, ensuring **transparent, on-chain storage** of predictions.

---

## ** Features**
- **Real-Time Token Prices** – Fetches live data from market sources (e.g., CoinGecko, Binance API).
- **AI-Powered Predictions** – Uses advanced ML models (TensorFlow, Scikit-Learn) to predict future prices.
- **On-Chain Data Storage** – Securely stores price trends and AI predictions using **Move smart contracts**.
- **Aptos Wallet Integration** – Connects with wallets like **Petra & Martian** for secure transactions.
- **Modern Web UI** – Responsive dashboard built with **React/Next.js** featuring live price charts.

---

## ** Tech Stack**
### **Frontend:**
- React / Next.js
- TailwindCSS
- Chart.js / Recharts (for data visualization)

### **Backend:**
- Node.js / Python (FastAPI, Flask, or Express.js)
- AI Models (TensorFlow, Scikit-Learn)
- Oracle Service for fetching real-time token data

### **Blockchain & Smart Contracts:**
- Aptos Blockchain
- Move Smart Contracts
- Aptos SDK (for wallet & transaction management)

---

## ** Installation & Setup**

### **1️⃣ Clone the Repository**
```sh
  https://github.com/UNIk0411/Intelliapt-Token-AI.git
  cd IntelliAPT
```

### **2️⃣ Install Dependencies**
#### **For Frontend:**
```sh
  cd frontend
  npm install
```
#### **For Backend:**
```sh
  cd backend
  pip install -r requirements.txt  # If using Python
  npm install  # If using Node.js
```

### **3️⃣ Configure Environment Variables**
Create a `.env` file in both `frontend/` and `backend/` with API keys and configurations:
```env
APTOS_NETWORK=mainnet
WALLET_PROVIDER=petra
MARKET_DATA_API_KEY=your_api_key_here
```

### **4️⃣ Run the Application**
#### **Start Backend**
```sh
  cd backend
  python app.py  # If using Python
  node server.js  # If using Node.js
```
#### **Start Frontend**
```sh
  cd frontend
  npm run dev
```

---

## ** Smart Contract Deployment**
1. **Write & Compile Move Contract**
```sh
  aptos move compile --package-dir ./contracts
```
2. **Deploy to Aptos Blockchain**
```sh
  aptos move publish --package-dir ./contracts --profile default
```

---

## ** API Endpoints**
| Endpoint             | Method | Description |
|----------------------|--------|-------------|
| `/api/prices`        | GET    | Fetches real-time token prices |
| `/api/predict`       | GET    | Returns AI-generated token price predictions |
| `/api/store`         | POST   | Stores predictions on Aptos blockchain |

---

## ** Future Enhancements**
✅ Support for **multi-token predictions**
✅ **User dashboard** for tracking portfolio predictions
✅ **AI model improvements** for accuracy
✅ **More blockchain integrations** beyond Aptos


