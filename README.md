# n8n-nodes-curve-finance

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Curve Finance, the leading DeFi protocol for stablecoin and pegged asset trading. Access 6 key resources including pools, gauges, CrvUSD operations, lending protocols, token management, and detailed analytics to automate your DeFi strategies and monitor your positions.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![DeFi](https://img.shields.io/badge/DeFi-Curve%20Finance-green)
![Ethereum](https://img.shields.io/badge/Blockchain-Ethereum-blue)
![Stablecoins](https://img.shields.io/badge/Focus-Stablecoins-yellow)

## Features

- **Pool Management** - Access pool data, liquidity information, trading volumes, and APY calculations
- **Gauge Operations** - Monitor and interact with liquidity gauge rewards and voting mechanisms
- **CrvUSD Integration** - Comprehensive support for Curve's native stablecoin operations and minting
- **Curve Lending** - Access lending markets, borrowing rates, and collateral management
- **Token Analytics** - Real-time token prices, trading pairs, and market data
- **Yield Optimization** - Calculate optimal strategies for liquidity provision and farming
- **Multi-Chain Support** - Works across Ethereum mainnet and supported Layer 2 networks
- **Real-Time Data** - Live protocol metrics and performance indicators

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-curve-finance`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-curve-finance
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-curve-finance.git
cd n8n-nodes-curve-finance
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-curve-finance
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Curve Finance API authentication key | Yes |
| Environment | Production or Sandbox environment | Yes |
| Base URL | API endpoint URL (auto-configured) | No |

## Resources & Operations

### 1. Pools

| Operation | Description |
|-----------|-------------|
| Get Pool Info | Retrieve detailed pool information including TVL and composition |
| List Pools | Get all available pools with filtering options |
| Get Pool APY | Calculate current and historical APY for pools |
| Get Pool Volume | Retrieve trading volume and fee data |
| Get Pool Balances | Access current token balances in pools |
| Get Exchange Rate | Get current exchange rates between pool tokens |

### 2. Gauges

| Operation | Description |
|-----------|-------------|
| Get Gauge Info | Retrieve gauge details and reward information |
| List Gauges | Get all available gauges with metadata |
| Get Gauge Weight | Access current and historical gauge weights |
| Get Gauge Rewards | Calculate pending and historical rewards |
| Get Voting Power | Retrieve veCRV voting power and delegation info |
| Submit Gauge Vote | Cast votes for gauge weight allocation |

### 3. CrvUsd

| Operation | Description |
|-----------|-------------|
| Get Market Info | Retrieve CrvUSD market data and parameters |
| Get Collateral Ratio | Access current collateral ratios and health factors |
| Get Minting Rate | Retrieve current minting fees and rates |
| Get Supply Data | Access total supply and circulation metrics |
| Get Liquidation Data | Monitor liquidation events and thresholds |
| Calculate Position | Analyze potential positions and risk metrics |

### 4. Curve Lending

| Operation | Description |
|-----------|-------------|
| Get Lending Markets | Retrieve all available lending markets |
| Get Borrowing Rates | Access current and historical borrowing rates |
| Get Supply Rates | Get lending/supply APY rates |
| Get Market Stats | Retrieve utilization and liquidity metrics |
| Get User Position | Access user's lending and borrowing positions |
| Calculate Health Factor | Assess position health and liquidation risk |

### 5. Tokens

| Operation | Description |
|-----------|-------------|
| Get Token Info | Retrieve token metadata and contract details |
| Get Token Price | Access current and historical token prices |
| Get Token Supply | Get circulating and total supply information |
| List Supported Tokens | Retrieve all tokens supported by Curve |
| Get Token Pairs | Access available trading pairs |
| Get Price Impact | Calculate price impact for potential trades |

### 6. Analytics

| Operation | Description |
|-----------|-------------|
| Get Protocol Stats | Retrieve overall protocol metrics and TVL |
| Get Historical Data | Access time-series data for analysis |
| Get Fee Revenue | Monitor protocol fees and revenue distribution |
| Get User Analytics | Analyze user behavior and position performance |
| Get Yield Farming Stats | Calculate optimal farming strategies |
| Generate Reports | Create comprehensive analytics reports |

## Usage Examples

```javascript
// Get pool information for 3pool
const poolInfo = await this.helpers.httpRequestWithAuthentication.call(this, 'curveFinanceApi', {
  method: 'GET',
  url: '/pools/3pool',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Calculate APY for stETH pool
const apyData = await this.helpers.httpRequestWithAuthentication.call(this, 'curveFinanceApi', {
  method: 'GET',
  url: '/pools/steth/apy',
  qs: {
    period: '7d'
  }
});

// Get gauge rewards for CRV-ETH pool
const rewards = await this.helpers.httpRequestWithAuthentication.call(this, 'curveFinanceApi', {
  method: 'GET',
  url: '/gauges/crv-eth/rewards',
  qs: {
    user_address: '0x742d35Cc6634C0532925a3b8D467C9E0b5a4e'
  }
});

// Monitor CrvUSD collateral ratios
const collateralData = await this.helpers.httpRequestWithAuthentication.call(this, 'curveFinanceApi', {
  method: 'GET',
  url: '/crvusd/collateral',
  qs: {
    market: 'wstETH',
    user: '0x742d35Cc6634C0532925a3b8D467C9E0b5a4e'
  }
});
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid Pool Address | Pool address format is incorrect | Verify the pool address is a valid Ethereum address |
| Insufficient Liquidity | Pool has inadequate liquidity for operation | Check pool TVL and retry with smaller amounts |
| Rate Limited | API rate limit exceeded | Implement exponential backoff and reduce request frequency |
| Network Congestion | Ethereum network is congested | Retry operation or use Layer 2 alternatives |
| Invalid Gauge | Gauge address or ID not found | Verify gauge exists and is active on Curve |
| Authentication Failed | API key invalid or expired | Check credentials and refresh API key if needed |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-curve-finance/issues)
- **Curve Finance Documentation**: [docs.curve.fi](https://docs.curve.fi)
- **DeFi Community**: [DeFi Pulse](https://defipulse.com)