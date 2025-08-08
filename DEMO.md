# Demo: Mini App - Onchain Social

## 🎯 Mục tiêu

Tạo một ứng dụng Mini App hoàn chỉnh cho mạng xã hội Onchain với các tính năng:
- Bỏ phiếu tương tác
- Tích hợp blockchain
- Nhận thức bối cảnh xã hội

## 🚀 Cách chạy Demo

### 1. Khởi động ứng dụng
```bash
cd my-minikit-app
npm run dev
```

### 2. Truy cập ứng dụng
Mở http://localhost:3000 trong trình duyệt

### 3. Khám phá các tính năng

#### Tab "Voting" - Ứng dụng Bỏ phiếu
- **Bỏ phiếu cho món ăn yêu thích:** Pizza 🍕, Burger 🍔, Sushi 🍣, Tacos 🌮
- **Hiển thị kết quả theo thời gian thực:** Số phiếu và phần trăm
- **Ngăn chặn bỏ phiếu trùng lặp:** Mỗi FID chỉ được bỏ phiếu một lần
- **Giao diện đẹp mắt:** Thanh tiến trình và hiệu ứng visual

#### Tab "Onchain" - Tích hợp Blockchain
- **Giao dịch demo:** Gửi 0.001 ETH đến địa chỉ demo
- **Bỏ phiếu onchain:** Thực hiện giao dịch blockchain để bỏ phiếu
- **Thông tin bối cảnh:** Hiển thị thông tin xã hội và vị trí

#### Tab "Demo" - Component Demo
- **Các component có sẵn:** Button, Card, Icon
- **Todo List:** Ứng dụng quản lý công việc
- **Transaction Card:** Minh họa giao dịch blockchain

## 🔧 Cấu trúc Code

### VotingApp Component
```typescript
// Sử dụng MiniKit context
const { context } = useMiniKit();

// Lấy thông tin người dùng
const userFid = context?.user?.fid;
const displayName = context?.user?.displayName;

// Xử lý bỏ phiếu
const handleVote = async (optionId: string) => {
  // Gửi request đến API
  const response = await fetch('/api/vote', {
    method: 'POST',
    body: JSON.stringify({
      fid: context?.user?.fid,
      option: optionId,
      location: context?.location
    })
  });
};
```

### OnchainMiniApp Component
```typescript
// Tích hợp với OnchainKit
import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';

// Tạo giao dịch
const handleTransaction = () => {
  return {
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    value: '1000000000000000', // 0.001 ETH
    data: '0x'
  };
};

// Sử dụng trong component
<Transaction calls={[handleTransaction]}>
  <TransactionButton text="Send 0.001 ETH" />
  <TransactionStatus />
</Transaction>
```

### API Endpoint
```typescript
// app/api/vote/route.ts
export async function POST(request: NextRequest) {
  const { fid, option, location } = await request.json();
  
  // Kiểm tra bỏ phiếu trùng lặp
  if (userVotes[fid]) {
    return NextResponse.json({ error: 'User has already voted' });
  }
  
  // Ghi nhận phiếu bầu
  votes[option]++;
  userVotes[fid] = option;
  
  return NextResponse.json({ success: true, votes });
}
```

## 🎨 Tính năng UI/UX

### Responsive Design
- Tối ưu cho màn hình di động
- Giao diện phù hợp với feed xã hội
- Safe area insets cho các thiết bị khác nhau

### Theme System
```css
/* Sử dụng CSS variables của OnchainKit */
:root {
  --app-accent: #0052FF;
  --app-background: #ffffff;
  --app-foreground: #000000;
  --app-gray: #f5f5f5;
}
```

### Navigation
- Tab navigation giữa các tính năng
- Smooth transitions
- Active state indicators

## 🔗 Tích hợp Social

### Farcaster Context
- **User Information:** FID, username, displayName, pfpUrl
- **Client Information:** Trạng thái đã thêm vào favorites
- **Location Context:** Nơi Mini App được khởi chạy

### Frame Integration
- **Frame Metadata:** Cấu hình trong `.well-known/farcaster.json`
- **Account Association:** Cho phép người dùng thêm vào favorites
- **Webhook Support:** Nhận thông báo từ Farcaster

## 🚀 Triển khai

### Environment Variables
```bash
# OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=your_project_name
NEXT_PUBLIC_ICON_URL=your_icon_url

# Farcaster Frame
FARCASTER_HEADER=your_header
FARCASTER_PAYLOAD=your_payload
FARCASTER_SIGNATURE=your_signature
```

### Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

## 📱 Testing

### Local Development
- Chạy `npm run dev` để khởi động máy chủ phát triển
- Truy cập http://localhost:3000
- Test các tính năng bỏ phiếu và giao dịch

### Frame Testing
- Sử dụng Farcaster Frame testing tools
- Test trong môi trường Farcaster thực tế
- Kiểm tra responsive design trên các thiết bị

### Blockchain Testing
- Sử dụng Base testnet cho giao dịch
- Test với ví Coinbase Wallet
- Verify transaction success/failure handling

## 🎯 Kết quả

Sau khi hoàn thành demo, bạn sẽ có:

1. **Mini App hoàn chỉnh** với giao diện đẹp mắt
2. **Tính năng bỏ phiếu tương tác** với real-time updates
3. **Tích hợp blockchain** với OnchainKit
4. **Nhận thức bối cảnh xã hội** với MiniKit
5. **API backend** để xử lý dữ liệu
6. **Frame metadata** để tích hợp với Farcaster

## 🔮 Mở rộng

### Tính năng có thể thêm:
- **Real-time notifications** khi có phiếu bầu mới
- **Analytics dashboard** để theo dõi kết quả
- **NFT rewards** cho người tham gia
- **Social sharing** kết quả bỏ phiếu
- **Multi-language support** cho cộng đồng toàn cầu

### Tích hợp nâng cao:
- **Smart contracts** cho voting onchain
- **Token-gated voting** với ERC-20 tokens
- **DAO integration** cho governance voting
- **Cross-chain voting** trên nhiều blockchain

---

**Được xây dựng với ❤️ trên Base với MiniKit** 