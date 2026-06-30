import React, { useState } from 'react';
import { useApp } from './AppContext';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Lock, 
  Sparkles, 
  Clock, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  CreditCard,
  QrCode,
  Building,
  ArrowRight
} from 'lucide-react';

export default function Wallet() {
  const { currentUser, transactions, addTransaction, updateProfile } = useApp();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  if (!currentUser) return null;

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    const amt = Number(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      setActionError('Please specify a positive deposit amount.');
      return;
    }

    // Simulate Razorpay / UPI payment gateway popup check
    setTimeout(async () => {
      const nextBalance = currentUser.walletBalance + amt;
      await updateProfile({ walletBalance: nextBalance });
      
      await addTransaction({
        userId: currentUser.uid,
        type: 'deposit',
        amount: amt,
        description: `Deposited funds via secure UPI gateway`
      });

      setActionSuccess(`₹${amt} successfully deposited into your available wallet!`);
      setDepositAmount('');
      setTimeout(() => setShowDepositModal(false), 1500);
    }, 1000);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setActionSuccess('');

    const amt = Number(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      setActionError('Please specify a positive withdrawal amount.');
      return;
    }

    if (currentUser.walletBalance < amt) {
      setActionError('Insufficient available funds.');
      return;
    }

    setTimeout(async () => {
      const nextBalance = currentUser.walletBalance - amt;
      await updateProfile({ walletBalance: nextBalance });

      await addTransaction({
        userId: currentUser.uid,
        type: 'payout',
        amount: amt,
        description: `Withdrew earnings to verified student Bank A/C`
      });

      setActionSuccess(`₹${amt} withdrawn instantly to your linked bank account!`);
      setWithdrawAmount('');
      setTimeout(() => setShowWithdrawModal(false), 1500);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Wallet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Available Wallet Card */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 shrink-0">
            <WalletIcon className="h-24 w-24" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Available Balance</span>
          </div>
          <div className="text-3xl font-medium text-white mb-6">
            ₹{currentUser.walletBalance.toLocaleString('en-IN')}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowDepositModal(true);
                setShowWithdrawModal(false);
              }}
              className="flex-1 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-medium rounded-md transition flex items-center justify-center gap-1"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Deposit</span>
            </button>
            <button
              onClick={() => {
                setShowWithdrawModal(true);
                setShowDepositModal(false);
              }}
              className="flex-1 py-2 bg-black hover:bg-zinc-800 text-white border border-zinc-800 text-xs font-medium rounded-md transition flex items-center justify-center gap-1"
            >
              <ArrowDownLeft className="h-3.5 w-3.5" />
              <span>Withdraw</span>
            </button>
          </div>
        </div>

        {/* Escrow Locked Card */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-md">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Escrow Locker</span>
            <Lock className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="text-2xl font-medium text-white mb-2">
            ₹{currentUser.escrowBalance.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Funds securely locked for pending tasks.
          </p>
        </div>

        {/* Refund and Commission Summary */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-md space-y-4">
          <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-wider">
            <span>Special Vaults</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400">Refund Wallet:</span>
            <span className="text-sm font-medium text-white">₹{currentUser.refundBalance}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400">Platform Fee:</span>
            <span className="text-xs text-zinc-500">5% on release</span>
          </div>
        </div>

      </div>

      {/* UPI / Deposit Modal */}
      {showDepositModal && (
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-md max-w-md space-y-4">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-white" />
            <h3 className="text-xs font-medium text-white uppercase tracking-wider">Deposit</h3>
          </div>
          <form onSubmit={handleDeposit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400">Amount (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 1000"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
              />
            </div>
            
            {actionSuccess && (
              <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}
            {actionError && (
              <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setShowDepositModal(false)}
                className="px-4 py-1.5 bg-black hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-medium rounded-md"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 py-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-medium rounded-md flex justify-center items-center gap-1"
              >
                <span>Process Payment</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-md max-w-md space-y-4">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-white" />
            <h3 className="text-xs font-medium text-white uppercase tracking-wider">Payout</h3>
          </div>
          <form onSubmit={handleWithdraw} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-400">Amount (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 500"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-zinc-800 focus:border-zinc-500 focus:outline-none rounded-md text-xs text-white"
              />
            </div>

            {actionSuccess && (
              <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}
            {actionError && (
              <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-md text-white text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setShowWithdrawModal(false)}
                className="px-4 py-1.5 bg-black hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-medium rounded-md"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 py-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-medium rounded-md flex justify-center items-center gap-1"
              >
                <span>Transfer</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction Ledger Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-md p-6">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Ledger History</h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-500">
            <Clock className="h-7 w-7 text-zinc-600 mx-auto mb-2" />
            <span>No transactions yet.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                  <th className="py-2.5 pb-3">Transaction ID</th>
                  <th className="py-2.5 pb-3">Description</th>
                  <th className="py-2.5 pb-3">Type</th>
                  <th className="py-2.5 pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-xs text-zinc-300">
                {transactions.map((tx, index) => {
                  const isAdd = tx.type === 'deposit' || tx.type === 'refund';
                  return (
                    <tr key={tx.id || index} className="hover:bg-zinc-800 transition">
                      <td className="py-3 font-mono text-[10px] text-zinc-500">{tx.id || `TX_${index}`}</td>
                      <td className="py-3 pr-2">{tx.description}</td>
                      <td className="py-3 uppercase text-[9px] text-zinc-400">{tx.type}</td>
                      <td className={`py-3 text-right ${isAdd ? 'text-white' : 'text-zinc-400'}`}>
                        {isAdd ? '+' : '-'}₹{tx.amount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
