"use client";

import { useAccount, useBalance } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

export default function BalanceChecker() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    chainId: baseSepolia.id,
  });

  if (!isConnected) {
    return (
      <div className="bg-[var(--app-gray)] p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Wallet Status</h3>
        <p className="text-sm text-[var(--app-foreground-muted)]">
          Please connect your wallet to view balance
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--app-gray)] p-4 rounded-lg">
      <h3 className="font-semibold mb-2">Wallet Balance</h3>
      <div className="text-sm space-y-1">
        <p><strong>Address:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}</p>
        <p><strong>Balance:</strong> {balance?.formatted} {balance?.symbol}</p>
        <p><strong>Network:</strong> Base</p>
        {balance && parseFloat(balance.formatted) < 0.001 && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-yellow-800">
            ⚠️ Low balance. You may need more ETH for transactions.
          </div>
        )}
      </div>
    </div>
  );
} 