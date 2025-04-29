# Secure Blockchain-Based Voting System

## Overview
This project is a secure web application for blockchain-based voting with Gmail authentication, human recognition, room-based voting, and blockchain vote recording.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Solidity compiler (for smart contract)
- Ethereum wallet and testnet access (e.g., MetaMask, Infura)
- PostgreSQL database

### Environment Variables
Create a `.env` file in the `src/backend` directory with the following variables:

```
GOOGLE_CLIENT_ID=your-google-oauth-client-id
JWT_SECRET=your-jwt-secret
ETH_RPC_URL=https://your-ethereum-node-url
ETH_PRIVATE_KEY=your-ethereum-wallet-private-key
VOTING_CONTRACT_ADDRESS=deployed-contract-address
DATABASE_URL=your-postgresql-connection-string
```

### Backend Setup
1. Navigate to `src/backend`
2. Install dependencies:
   ```
   npm install
   ```
3. Run database migrations and seeders as needed.
4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to `src/frontend`
2. Install dependencies:
   ```
   npm install
   ```
3. Create `.env` file with:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-google-oauth-client-id
   ```
4. Start the frontend development server:
   ```
   npm start
   ```

### Smart Contract Deployment
1. Compile and deploy the `Voting.sol` contract using tools like Hardhat or Truffle.
2. Update `VOTING_CONTRACT_ADDRESS` in backend `.env` with deployed contract address.

## Running the Application
- Access the frontend at `http://localhost:3000`
- Login with Gmail and complete human verification.
- Create or join voting rooms and cast votes.
- View real-time results.

## Testing
- Add unit and integration tests for backend and frontend.
- Test smart contract functions on Ethereum testnet.

## Scaling and Deployment
- Use Docker for containerization.
- Deploy backend and frontend on cloud platforms.
- Use managed database and Ethereum node services.
- Implement CI/CD pipelines.

## Security Best Practices
- Keep secrets secure.
- Use HTTPS in production.
- Regularly update dependencies.

---

For detailed documentation and code examples, refer to the source files.
