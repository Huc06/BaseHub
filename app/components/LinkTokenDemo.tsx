"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { 
  Transaction, 
  TransactionButton, 
  TransactionStatus 
} from '@coinbase/onchainkit/transaction';

export default function LinkTokenDemo() {
  const { context } = useMiniKit();
  
  // LINK token contract address on Base Sepolia
  const LINK_CONTRACT = '0xe4ab69c077a32410'; // Your LINK contract address

  const handleTransferLink = () => {
    // Transfer LINK tokens (ERC-20 transfer function)
    return {
      to: LINK_CONTRACT,
      value: '0', // No ETH transfer
      data: '0xa9059cbb000000000000000000000000742d35Cc6634C0532925a3b8D4C9db96C4b4d8b60000000000000000000000000000000000000000000000000000000000000001' // transfer(address,uint256) - 10 LINK
    };
  };

  const handleApproveLink = () => {
    // Approve LINK tokens for contract
    return {
      to: LINK_CONTRACT,
      value: '0',
      data: '0x095ea7b3000000000000000000000000742d35Cc6634C0532925a3b8D4C9db96C4b4d8b60000000000000000000000000000000000000000000000000000000000000001' // approve(address,uint256) - 10 LINK
    };
  };

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-2 text-orange-800">🔗 LINK Token Testing</h2>
        <p className="text-sm text-orange-700">
          Test with your 25 LINK tokens on Base Sepolia! (Demo mode - no real transactions)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--app-card-bg)] p-4 rounded-lg border border-[var(--app-card-border)]">
          <h3 className="font-semibold mb-2">Transfer LINK</h3>
          <p className="text-sm text-[var(--app-foreground-muted)] mb-3">
            Transfer 0.01 LINK tokens to demo address
          </p>
          
          <Transaction
            calls={[handleTransferLink as any]}
            onSuccess={(receipt) => {
              console.log('LINK transfer successful:', receipt);
              alert('LINK transfer successful!');
            }}
            onError={(error) => {
              console.error('LINK transfer failed:', error);
              alert('LINK transfer failed. Please try again.');
            }}
          >
            <TransactionButton 
              text="Transfer 0.01 LINK" 
              className="w-full"
            />
            <TransactionStatus />
          </Transaction>
        </div>

        <div className="bg-[var(--app-card-bg)] p-4 rounded-lg border border-[var(--app-card-border)]">
          <h3 className="font-semibold mb-2">Approve LINK</h3>
          <p className="text-sm text-[var(--app-foreground-muted)] mb-3">
            Approve 0.01 LINK tokens for contract
          </p>
          
          <Transaction
            calls={[handleApproveLink as any]}
            onSuccess={(receipt) => {
              console.log('LINK approve successful:', receipt);
              alert('LINK approve successful!');
            }}
            onError={(error) => {
              console.error('LINK approve failed:', error);
              alert('LINK approve failed. Please try again.');
            }}
          >
            <TransactionButton 
              text="Approve 0.01 LINK" 
              className="w-full"
            />
            <TransactionStatus />
          </Transaction>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="font-semibold mb-2 text-blue-800">💡 LINK Token Info</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>✅ Network:</strong> Base Sepolia</p>
          <p><strong>✅ Contract:</strong> {LINK_CONTRACT}</p>
          <p><strong>✅ Your Balance:</strong> 25 LINK</p>
          <p><strong>✅ Can Test:</strong> Transfer, Approve, Swap</p>
        </div>
      </div>

      {context?.user?.fid && (
        <div className="bg-[var(--app-gray)] p-4 rounded-lg">
          <h3 className="font-semibold mb-2">👤 User Info</h3>
          <div className="text-sm space-y-1">
            <p><strong>FID:</strong> {context.user.fid}</p>
            <p><strong>Username:</strong> {context.user.username || 'Demo User'}</p>
            <p><strong>Display Name:</strong> {context.user.displayName || 'Demo User'}</p>
            <p><strong>Network:</strong> Base Sepolia</p>
          </div>
        </div>
      )}
    </div>
  );
}
