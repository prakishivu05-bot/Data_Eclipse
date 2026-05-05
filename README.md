# 🚀 Data Eclipse

[![Live Demo](https://img.shields.io/badge/Live_Demo-dataeclipse.netlify.app-blue?style=for-the-badge&logo=netlify)](https://dataeclipse.netlify.app/)  
<a href="https://dataeclipse.netlify.app/"><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dataeclipse.netlify.app/" alt="Scan to open Live Demo" width="150" height="150" style="margin-top: 10px; border-radius: 8px;" /></a>

### Verifiable Secure Data Erasure System

---

## 🔐 Overview

**Data Eclipse** is a cybersecurity-focused web application that ensures **secure data destruction** and provides **tamper-proof proof of deletion using blockchain**.

In real-world systems, data deletion is based on trust — but there is **no verifiable proof** that the data is truly gone.
Data Eclipse solves this by combining:

* Multi-pass overwrite simulation
* Cryptographic hashing (SHA-256)
* Persistent storage behavior
* Blockchain-based verification

---

## 🎯 Key Idea

> “Don’t trust the wipe — verify it.”

---

## ⚙️ How It Works

### 1. 🧠 Disk Simulation

A virtual disk is created with sensitive files such as:

* confidential_report.pdf
* passwords.txt
* client_data.json
* system_logs.log
* backup.zip

---

### 2. 🔍 Pre-Wipe Hash

The entire disk is hashed using **SHA-256** to generate a fingerprint of existing data.

---

### 3. 💣 Secure Wipe (3-Pass Overwrite)

* Data is overwritten **3 times** using cryptographic random values
* Simulates real-world secure deletion techniques

---

### 4. 🔁 Post-Wipe Hash

A new hash is generated after wiping.
If hashes differ → data is irreversibly destroyed.

---

### 5. 💾 Persistence

* Disk state is stored in `localStorage`
* Wiped data **does not return after refresh**

---

### 6. ⛓️ Blockchain Anchoring

* Wipe proof is stored on **Ethereum Sepolia Testnet**
* Includes:

  * Device ID
  * Before Hash
  * After Hash
  * Status

---

### 7. 🌐 Public Verification

* Users can verify the wipe via **Etherscan**
* No need to trust the system

---

## ✨ Features

* 🔒 Secure multi-pass data wipe simulation
* 🧠 SHA-256 hash verification
* 💾 Persistent disk state (realistic behavior)
* ⛓️ Blockchain-based proof of deletion
* 🌐 Public verification via Etherscan
* 📱 Fully responsive UI (mobile + desktop)
* 🔁 Reset system for repeatable demo
* ⚠️ Irreversible wipe simulation

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React.js (Vite)
* Tailwind CSS
* Zustand (state management)

### 🔹 Blockchain

* Solidity
* Hardhat
* Ethers.js
* Ethereum Sepolia Testnet
* MetaMask

### 🔹 Infrastructure

* Alchemy RPC
* Netlify (deployment)

### 🔹 Storage & Simulation

* localStorage
* Web Crypto API

---

## 🧩 Architecture

```text
React UI
   ↓
Fake Disk (localStorage)
   ↓
SHA-256 Hashing
   ↓
3-Pass Overwrite
   ↓
Smart Contract (Ethereum)
   ↓
Etherscan Verification
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/prakishivu05-bot/Data_Eclipse.git
cd Data_Eclipse
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

Create a `.env` file (DO NOT commit this file):

```env
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url
VITE_RPC_URL=your_rpc_url
VITE_CONTRACT_ADDRESS=your_contract_address
```

---

### 4. Run the App

```bash
npm run dev
```

---

## 🌐 Deployment

Frontend deployed using **Netlify**
(Ensure environment variables are added in Netlify dashboard)

---

## 🔐 Security Note

* Private keys are never exposed in frontend
* `.env` is excluded via `.gitignore`
* Blockchain interaction is handled securely

---

## 🎤 Demo Flow

1. Select disk with sensitive files
2. Perform secure wipe
3. Verify hash change
4. Generate certificate
5. Anchor proof on blockchain
6. Verify using Etherscan
7. Reset system for next demo

---

## 💡 Use Cases

* Enterprise device disposal
* IT asset recycling
* Government data handling
* Compliance verification systems

---

## 🏁 Conclusion

Data Eclipse transforms data deletion from a **trust-based process** into a **verifiable, transparent system** using cryptography and blockchain.

---

## 📌 One-Line Pitch

> “We don’t just erase data — we prove it’s gone.”

---

## 👨💻 Author

Developed as part of a hackathon project focused on cybersecurity and blockchain integration.

---
