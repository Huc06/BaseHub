"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { 
  Transaction, 
  TransactionButton, 
  TransactionStatus 
} from '@coinbase/onchainkit/transaction';
import { Button } from './DemoComponents';

export default function OnchainMiniApp() {
  const { context } = useMiniKit();
  
  const handleTransaction = () => {
    // Create a simple transaction - sending 0.001 ETH to a demo address
    return {
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Demo address
      value: '1000000000000000', // 0.001 ETH in wei
      data: '0x' // No additional data
    };
  };

  const handleVoteWithToken = () => {
    // Create a transaction that includes voting data
    return {
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Demo contract
      value: '0', // No ETH transfer
      data: '0x' // In a real app, this would contain encoded function call
    };
  };

  return (
    <div className="onchain-mini-app space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Onchain Social Actions</h2>
        <p className="text-sm text-[var(--app-foreground-muted)]">
          {context?.user?.displayName ? `Hi ${context.user.displayName}!` : 'Hi there!'} 
          Execute blockchain transactions directly from social feed
        </p>
        {context?.user?.fid && (
          <p className="text-xs text-[var(--app-foreground-muted)] mt-1">
            FID: {context.user.fid}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {/* Simple Transaction */}
        <div className="bg-[var(--app-card-bg)] p-4 rounded-lg border border-[var(--app-card-border)]">
          <h3 className="font-semibold mb-2">Send Demo Transaction</h3>
          <p className="text-sm text-[var(--app-foreground-muted)] mb-3">
            Send 0.001 ETH to demo address
          </p>
          
          <Transaction
            calls={[handleTransaction as any]}
            onSuccess={(receipt) => {
              console.log('Transaction successful:', receipt);
              alert('Transaction successful! Check your wallet for details.');
            }}
            onError={(error) => {
              console.error('Transaction failed:', error);
              alert('Transaction failed. Please try again.');
            }}
          >
            <TransactionButton 
              text="Send 0.001 ETH" 
              className="w-full"
            />
            <TransactionStatus />
          </Transaction>
        </div>

        {/* Vote with Token */}
        <div className="bg-[var(--app-card-bg)] p-4 rounded-lg border border-[var(--app-card-border)]">
          <h3 className="font-semibold mb-2">Vote with Token</h3>
          <p className="text-sm text-[var(--app-foreground-muted)] mb-3">
            Cast your vote on-chain (demo transaction)
          </p>
          
          <Transaction
            calls={[handleVoteWithToken as any]}
            onSuccess={(receipt) => {
              console.log('Vote transaction successful:', receipt);
              alert('Vote recorded on-chain!');
            }}
            onError={(error) => {
              console.error('Vote transaction failed:', error);
              alert('Vote failed. Please try again.');
            }}
          >
            <TransactionButton 
              text="Vote on-chain" 
              className="w-full"
            />
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