import { useState } from "react";
import { signOut } from "firebase/auth";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransactions } from "../../hooks/useGetTransactions";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase-config";
import "./styles.css";

export const ExpenseTracker = () => {
  const { addTransaction } = useAddTransaction();
  const { transactions, transactionTotals } = useGetTransactions();
  const { name, profilePhoto } = useGetUserInfo();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");

  const { balance, income, expenses } = transactionTotals;

  const onSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      description,
      transactionAmount,
      transactionType,
    });

    setDescription("");
    setTransactionAmount("");
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>{name}'s Expense Tracker</h1>
      <div className="balance">
        <h3>Your Balance</h3>
        {balance >= 0 ? <h2>${balance}</h2> : <h2>-${balance * -1}</h2>}
      </div>
      <div className="inc-exp-container">
        <div className="income">
          <h4>Income</h4>
          <p className="money plus">${income}</p>
        </div>
        <div className="expenses">
          <h4>Expenses</h4>
          <p className="money minus">${expenses}</p>
        </div>
      </div>
      <form className="add-transaction" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={transactionAmount}
          required
          onChange={(e) => setTransactionAmount(e.target.value)}
        />
        <div className="transaction-type">
          <label>
            <input
              type="radio"
              id="expense"
              value="expense"
              checked={transactionType === "expense"}
              onChange={(e) => setTransactionType(e.target.value)}
            />
            <span className="radio-custom expense">Expense</span>
          </label>
          <label>
            <input
              type="radio"
              id="income"
              value="income"
              checked={transactionType === "income"}
              onChange={(e) => setTransactionType(e.target.value)}
            />
            <span className="radio-custom income">Income</span>
          </label>
        </div>
        <button className="btn" type="submit">Add Transaction</button>
      </form>
      <div className="transactions">
        <h3>Transactions</h3>
        <ul>
          {transactions.map((transaction) => {
            const { description, transactionAmount, transactionType } = transaction;
            return (
              <li key={transaction.id} className={transactionType}>
                <h4>{description}</h4>
                <p>
                  ${transactionAmount} •{" "}
                  <label className={transactionType}>
                    {transactionType}
                  </label>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      {profilePhoto && (
        <div className="profile">
          <img className="profile-photo" src={profilePhoto} alt="Profile" />
          <button className="sign-out-button" onClick={signUserOut}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
