# Mini App - Onchain Social

Một ứng dụng Mini App hoàn chỉnh cho mạng xã hội Onchain, được xây dựng với MiniKit và OnchainKit.

## Tính năng

### 🗳️ Ứng dụng Bỏ phiếu Tương tác
- Bỏ phiếu cho các lựa chọn khác nhau
- Hiển thị kết quả theo thời gian thực
- Ngăn chặn bỏ phiếu trùng lặp bằng FID
- Giao diện đẹp mắt với thanh tiến trình

### ⛓️ Tích hợp Onchain
- Thực hiện giao dịch blockchain trực tiếp từ feed xã hội
- Bỏ phiếu bằng token
- Tích hợp với ví Coinbase và Base network

### 👥 Nhận thức Bối cảnh Xã hội
- Hiển thị thông tin người dùng Farcaster
- Tùy chỉnh trải nghiệm dựa trên vị trí khởi chạy
- Tích hợp liền mạch với danh tính onchain

## Cách chạy

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Khởi động máy chủ phát triển:**
   ```bash
   npm run dev
   ```

3. **Truy cập ứng dụng:**
   - Mở http://localhost:3000
   - Ứng dụng sẽ chạy với giao diện mạng xã hội đầy đủ chức năng

## Cấu trúc Dự án

```
my-minikit-app/
├── app/
│   ├── components/
│   │   ├── VotingApp.tsx          # Ứng dụng bỏ phiếu
│   │   ├── OnchainMiniApp.tsx     # Tích hợp blockchain
│   │   └── DemoComponents.tsx      # Component demo
│   ├── api/
│   │   └── vote/
│   │       └── route.ts           # API xử lý bỏ phiếu
│   ├── page.tsx                   # Trang chính
│   └── providers.tsx              # MiniKit provider
├── lib/                           # Utilities
└── public/                        # Assets tĩnh
```

## Tính năng Chính

### VotingApp
- **Bỏ phiếu tương tác:** Người dùng có thể bỏ phiếu cho các lựa chọn
- **Kết quả theo thời gian thực:** Hiển thị số phiếu và phần trăm
- **Ngăn chặn trùng lặp:** Sử dụng FID để đảm bảo mỗi người chỉ bỏ phiếu một lần
- **Giao diện đẹp:** Thanh tiến trình và hiệu ứng visual

### OnchainMiniApp
- **Giao dịch blockchain:** Thực hiện giao dịch ETH trực tiếp
- **Bỏ phiếu onchain:** Tích hợp với smart contract
- **Thông tin bối cảnh:** Hiển thị thông tin xã hội và vị trí

### API Integration
- **Endpoint bỏ phiếu:** `/api/vote` để xử lý bỏ phiếu
- **Validation:** Kiểm tra tính hợp lệ của dữ liệu
- **Error handling:** Xử lý lỗi một cách graceful

## MiniKit Features

### Social Context
```typescript
const { context } = useMiniKit();

// User information
const userFid = context?.user?.fid;
const username = context?.user?.username;
const displayName = context?.user?.displayName;

// Client information
const isAdded = context?.client?.added;
const location = context?.location;
```

### Transaction Integration
```typescript
import { Transaction, TransactionButton } from '@coinbase/onchainkit/transaction';

<Transaction calls={[handleTransaction]}>
  <TransactionButton text="Execute Transaction" />
</Transaction>
```

## Triển khai

### Vercel (Khuyến nghị)
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables
Tạo file `.env.local`:
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=your_project_name
NEXT_PUBLIC_ICON_URL=your_icon_url
```

## Tài liệu Tham khảo

- [MiniKit Documentation](https://base.org/builders/minikit)
- [OnchainKit Documentation](https://onchainkit.com)
- [Farcaster Protocol](https://farcaster.xyz)
- [Base Network](https://base.org)

## Cộng đồng

- [Base Builders Discord](https://discord.gg/base)
- [Farcaster Community](https://farcaster.xyz)

---

Được xây dựng với ❤️ trên Base với MiniKit
