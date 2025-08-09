"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Transaction, TransactionButton, TransactionStatus } from "@coinbase/onchainkit/transaction";
import type { Call } from "viem";

export default function OnchainMiniApp() {
  const { context } = useMiniKit();

  // Không set value để tránh BigInt và đơn giản lint
  const ethCalls: Call[] = [
    { to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" as `0x${string}`, data: "0x" },
  ];

  const voteCalls: Call[] = [
    { to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" as `0x${string}`, data: "0x" },
  ];

  return (
    <div className="onchain-mini-app space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Onchain Social Actions</h2>
        <p className="text-sm text-[var(--app-foreground-muted)]">
          {context?.user?.displayName ? `Hi ${context.user.displayName}!` : "Hi there!"}
          Execute blockchain transactions directly from social feed
        </p>
        {context?.user?.fid && (
          <p className="text-xs text-[var(--app-foreground-muted)] mt-1">FID: {context.user.fid}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-[var(--app-card-bg)] p-4 rounded-lg border border-[var(--app-card-border)]">
          <h3 className="font-semibold mb-2">Send Demo Transaction</h3>
          <Transaction calls={ethCalls}>
            <TransactionButton text="Send Transaction" className="w-full" />
            <TransactionStatus />
          </Transaction>
        </div>

        <div className="bg-[var(--app-card-bg)] p-4 rounded-lg border border-[var(--app-card-border)]">
          <h3 className="font-semibold mb-2">Vote with Token</h3>
          <Transaction calls={voteCalls}>
            <TransactionButton text="Vote on-chain" className="w-full" />
            <TransactionStatus />
          </Transaction>
        </div>

        {/* Social Context Info */}
        <div className="bg-[var(--app-gray)] p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Social Context</h3>
          <div className="text-sm space-y-1">
            <p><strong>Location:</strong> {typeof context?.location === 'string' ? context.location : 'Unknown'}</p>
            <p><strong>Added to favorites:</strong> {context?.client?.added ? 'Yes' : 'No'}</p>
            <p><strong>Username:</strong> {context?.user?.username || 'Not available'}</p>
            <p><strong>Display Name:</strong> {context?.user?.displayName || 'Not available'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 