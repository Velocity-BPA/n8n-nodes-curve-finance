/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-curvefinance/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class CurveFinance implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Curve Finance',
    name: 'curvefinance',
    icon: 'file:curvefinance.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Curve Finance API',
    defaults: {
      name: 'Curve Finance',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'curvefinanceApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Pools',
            value: 'pools',
          },
          {
            name: 'Gauges',
            value: 'gauges',
          },
          {
            name: 'CrvUsd',
            value: 'crvUsd',
          },
          {
            name: 'Curve Lending',
            value: 'curveLending',
          },
          {
            name: 'Tokens',
            value: 'tokens',
          },
          {
            name: 'Analytics',
            value: 'analytics',
          }
        ],
        default: 'pools',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['pools'],
		},
	},
	options: [
		{
			name: 'Get All Pools',
			value: 'getAllPools',
			description: 'Get list of all available pools',
			action: 'Get all pools',
		},
		{
			name: 'Get Pool',
			value: 'getPool',
			description: 'Get detailed information about a specific pool',
			action: 'Get a pool',
		},
		{
			name: 'Get Pool Stats',
			value: 'getPoolStats',
			description: 'Get pool statistics including volume and fees',
			action: 'Get pool stats',
		},
		{
			name: 'Get Pool Reserves',
			value: 'getPoolReserves',
			description: 'Get current pool reserves and balances',
			action: 'Get pool reserves',
		},
		{
			name: 'Get Pool Trades',
			value: 'getPoolTrades',
			description: 'Get recent trades for a pool',
			action: 'Get pool trades',
		},
	],
	default: 'getAllPools',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['gauges'] } },
  options: [
    { name: 'Get All Gauges', value: 'getAllGauges', description: 'Get list of all gauges', action: 'Get all gauges' },
    { name: 'Get Gauge', value: 'getGauge', description: 'Get detailed gauge information', action: 'Get gauge details' },
    { name: 'Get Gauge Weights', value: 'getGaugeWeights', description: 'Get gauge voting weights', action: 'Get gauge weights' },
    { name: 'Get Gauge Rewards', value: 'getGaugeRewards', description: 'Get gauge reward rates and distributions', action: 'Get gauge rewards' },
    { name: 'Get Gauge Votes', value: 'getGaugeVotes', description: 'Get current gauge vote allocations', action: 'Get gauge votes' }
  ],
  default: 'getAllGauges',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['crvUsd'] } },
  options: [
    { name: 'Get CrvUSD Markets', value: 'getCrvUsdMarkets', description: 'Get all crvUSD lending markets', action: 'Get crvUSD markets' },
    { name: 'Get CrvUSD Market', value: 'getCrvUsdMarket', description: 'Get specific crvUSD market details', action: 'Get crvUSD market' },
    { name: 'Get CrvUSD User Position', value: 'getCrvUsdUserPosition', description: 'Get user\'s crvUSD positions', action: 'Get crvUSD user position' },
    { name: 'Get CrvUSD Supply', value: 'getCrvUsdSupply', description: 'Get total crvUSD supply and statistics', action: 'Get crvUSD supply' },
    { name: 'Get CrvUSD Peg Status', value: 'getCrvUsdPegStatus', description: 'Get crvUSD peg stability metrics', action: 'Get crvUSD peg status' },
  ],
  default: 'getCrvUsdMarkets',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['curveLending'] } },
	options: [
		{
			name: 'Get Lending Markets',
			value: 'getLendingMarkets',
			description: 'Get all lending markets',
			action: 'Get lending markets',
		},
		{
			name: 'Get Lending Market',
			value: 'getLendingMarket',
			description: 'Get specific lending market details',
			action: 'Get lending market details',
		},
		{
			name: 'Get User Lending Position',
			value: 'getUserLendingPosition',
			description: 'Get user\'s lending positions',
			action: 'Get user lending position',
		},
		{
			name: 'Get Lending Rates',
			value: 'getLendingRates',
			description: 'Get current lending and borrowing rates',
			action: 'Get lending rates',
		},
		{
			name: 'Get Liquidations',
			value: 'getLiquidations',
			description: 'Get recent liquidation events',
			action: 'Get liquidations',
		},
	],
	default: 'getLendingMarkets',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['tokens'] } },
  options: [
    { name: 'Get All Tokens', value: 'getAllTokens', description: 'Get list of supported tokens', action: 'Get all tokens' },
    { name: 'Get Token', value: 'getToken', description: 'Get token details and metadata', action: 'Get token details' },
    { name: 'Get Token Price', value: 'getTokenPrice', description: 'Get current token price', action: 'Get token price' },
    { name: 'Get Token Historical Prices', value: 'getTokenHistoricalPrices', description: 'Get historical price data', action: 'Get token historical prices' },
    { name: 'Get Multiple Token Prices', value: 'getMultipleTokenPrices', description: 'Get prices for multiple tokens', action: 'Get multiple token prices' }
  ],
  default: 'getAllTokens',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['analytics'],
		},
	},
	options: [
		{
			name: 'Get Total Value Locked',
			value: 'getTotalValueLocked',
			description: 'Get protocol TVL across chains',
			action: 'Get total value locked',
		},
		{
			name: 'Get Trading Volume',
			value: 'getTradingVolume',
			description: 'Get trading volume statistics',
			action: 'Get trading volume',
		},
		{
			name: 'Get Fee Statistics',
			value: 'getFeeStatistics',
			description: 'Get fee collection and distribution data',
			action: 'Get fee statistics',
		},
		{
			name: 'Get Pool APY Data',
			value: 'getPoolApyData',
			description: 'Get APY calculations for pools',
			action: 'Get pool APY data',
		},
		{
			name: 'Get Protocol Revenue',
			value: 'getProtocolRevenue',
			description: 'Get protocol revenue metrics',
			action: 'Get protocol revenue',
		},
	],
	default: 'getTotalValueLocked',
},
{
	displayName: 'Chain',
	name: 'chain',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['pools'],
			operation: ['getAllPools', 'getPool', 'getPoolStats', 'getPoolReserves', 'getPoolTrades'],
		},
	},
	options: [
		{
			name: 'Ethereum',
			value: 'ethereum',
		},
		{
			name: 'Polygon',
			value: 'polygon',
		},
		{
			name: 'Arbitrum',
			value: 'arbitrum',
		},
		{
			name: 'Optimism',
			value: 'optimism',
		},
		{
			name: 'Fantom',
			value: 'fantom',
		},
		{
			name: 'Avalanche',
			value: 'avalanche',
		},
	],
	default: 'ethereum',
	description: 'The blockchain network to query',
},
{
	displayName: 'Pool Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['pools'],
			operation: ['getPool', 'getPoolStats', 'getPoolReserves', 'getPoolTrades'],
		},
	},
	default: '',
	description: 'The address of the pool to query',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['pools'],
			operation: ['getAllPools', 'getPoolTrades'],
		},
	},
	default: 0,
	description: 'Number of items to skip',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['pools'],
			operation: ['getAllPools', 'getPoolTrades'],
		},
	},
	default: 100,
	description: 'Maximum number of items to return',
},
{
	displayName: 'Period',
	name: 'period',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['pools'],
			operation: ['getPoolStats'],
		},
	},
	options: [
		{
			name: '24 Hours',
			value: '24h',
		},
		{
			name: '7 Days',
			value: '7d',
		},
		{
			name: '30 Days',
			value: '30d',
		},
		{
			name: '90 Days',
			value: '90d',
		},
	],
	default: '24h',
	description: 'Time period for statistics',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['gauges'], operation: ['getAllGauges', 'getGauge', 'getGaugeWeights', 'getGaugeRewards', 'getGaugeVotes'] } },
  options: [
    { name: 'Ethereum', value: 'ethereum' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Arbitrum', value: 'arbitrum' },
    { name: 'Optimism', value: 'optimism' },
    { name: 'Fantom', value: 'fantom' },
    { name: 'Avalanche', value: 'avalanche' }
  ],
  default: 'ethereum',
  description: 'Blockchain network to query',
},
{
  displayName: 'Active Only',
  name: 'activeOnly',
  type: 'boolean',
  required: false,
  displayOptions: { show: { resource: ['gauges'], operation: ['getAllGauges'] } },
  default: false,
  description: 'Filter to show only active gauges',
},
{
  displayName: 'Gauge Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['gauges'], operation: ['getGauge', 'getGaugeWeights', 'getGaugeRewards'] } },
  default: '',
  description: 'The address of the gauge contract',
  placeholder: '0x...',
},
{
  displayName: 'Epoch',
  name: 'epoch',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['gauges'], operation: ['getGaugeWeights'] } },
  default: '',
  description: 'Specific epoch for historical weight data',
},
{
  displayName: 'User Address',
  name: 'user',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['gauges'], operation: ['getGaugeVotes'] } },
  default: '',
  description: 'User address to get vote allocations for',
  placeholder: '0x...',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['crvUsd'], operation: ['getCrvUsdMarkets', 'getCrvUsdMarket', 'getCrvUsdUserPosition', 'getCrvUsdSupply', 'getCrvUsdPegStatus'] } },
  options: [
    { name: 'Ethereum', value: 'ethereum' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Arbitrum', value: 'arbitrum' },
    { name: 'Optimism', value: 'optimism' },
    { name: 'Base', value: 'base' },
  ],
  default: 'ethereum',
  description: 'The blockchain network to query',
},
{
  displayName: 'Market Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['crvUsd'], operation: ['getCrvUsdMarket'] } },
  default: '',
  description: 'The contract address of the crvUSD market',
},
{
  displayName: 'User Address',
  name: 'userAddress',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['crvUsd'], operation: ['getCrvUsdUserPosition'] } },
  default: '',
  description: 'The wallet address to get crvUSD positions for',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['crvUsd'], operation: ['getCrvUsdMarkets', 'getCrvUsdMarket', 'getCrvUsdUserPosition', 'getCrvUsdSupply'] } },
  default: '',
  description: 'Specific block number for historical data (optional)',
},
{
	displayName: 'Chain',
	name: 'chain',
	type: 'options',
	options: [
		{ name: 'Ethereum', value: 'ethereum' },
		{ name: 'Polygon', value: 'polygon' },
		{ name: 'Arbitrum', value: 'arbitrum' },
		{ name: 'Optimism', value: 'optimism' },
		{ name: 'Fantom', value: 'fantom' },
		{ name: 'Avalanche', value: 'avalanche' },
	],
	default: 'ethereum',
	required: true,
	displayOptions: {
		show: {
			resource: ['curveLending'],
			operation: ['getLendingMarkets', 'getLendingMarket', 'getUserLendingPosition', 'getLendingRates', 'getLiquidations'],
		},
	},
	description: 'The blockchain network to query',
},
{
	displayName: 'Active Only',
	name: 'activeOnly',
	type: 'boolean',
	default: true,
	displayOptions: {
		show: {
			resource: ['curveLending'],
			operation: ['getLendingMarkets'],
		},
	},
	description: 'Whether to return only active lending markets',
},
{
	displayName: 'Market Address',
	name: 'address',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: {
			resource: ['curveLending'],
			operation: ['getLendingMarket'],
		},
	},
	description: 'The contract address of the lending market',
},
{
	displayName: 'User Address',
	name: 'userAddress',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: {
			resource: ['curveLending'],
			operation: ['getUserLendingPosition'],
		},
	},
	description: 'The user wallet address to get lending positions for',
},
{
	displayName: 'Market',
	name: 'market',
	type: 'string',
	default: '',
	displayOptions: {
		show: {
			resource: ['curveLending'],
			operation: ['getLendingRates'],
		},
	},
	description: 'Specific market address to get rates for (optional)',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 100,
	typeOptions: {
		minValue: 1,
		maxValue: 1000,
	},
	displayOptions: {
		show: {
			resource: ['curveLending'],
			operation: ['getLiquidations'],
		},
	},
	description: 'Maximum number of liquidation events to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	typeOptions: {
		minValue: 0,
	},
	displayOptions: {
		show: {
			resource: ['curveLending'],
			operation: ['getLiquidations'],
		},
	},
	description: 'Number of liquidation events to skip',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['tokens'], operation: ['getAllTokens'] } },
  options: [
    { name: 'Ethereum', value: 'ethereum' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Arbitrum', value: 'arbitrum' },
    { name: 'Optimism', value: 'optimism' },
    { name: 'Fantom', value: 'fantom' },
    { name: 'Avalanche', value: 'avalanche' }
  ],
  default: 'ethereum',
  description: 'The blockchain network to query',
},
{
  displayName: 'Token Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['tokens'], operation: ['getToken'] } },
  default: '',
  placeholder: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  description: 'The contract address of the token',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['tokens'], operation: ['getToken'] } },
  options: [
    { name: 'Ethereum', value: 'ethereum' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Arbitrum', value: 'arbitrum' },
    { name: 'Optimism', value: 'optimism' },
    { name: 'Fantom', value: 'fantom' },
    { name: 'Avalanche', value: 'avalanche' }
  ],
  default: 'ethereum',
  description: 'The blockchain network to query',
},
{
  displayName: 'Token Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['tokens'], operation: ['getTokenPrice'] } },
  default: '',
  placeholder: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  description: 'The contract address of the token',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['tokens'], operation: ['getTokenPrice'] } },
  options: [
    { name: 'Ethereum', value: 'ethereum' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Arbitrum', value: 'arbitrum' },
    { name: 'Optimism', value: 'optimism' },
    { name: 'Fantom', value: 'fantom' },
    { name: 'Avalanche', value: 'avalanche' }
  ],
  default: 'ethereum',
  description: 'The blockchain network to query',
},
{
  displayName: 'Token Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['tokens'], operation: ['getTokenHistoricalPrices'] } },
  default: '',
  placeholder: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  description: 'The contract address of the token',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['tokens'], operation: ['getTokenHistoricalPrices'] } },
  options: [
    { name: 'Ethereum', value: 'ethereum' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Arbitrum', value: 'arbitrum' },
    { name: 'Optimism', value: 'optimism' },
    { name: 'Fantom', value: 'fantom' },
    { name: 'Avalanche', value: 'avalanche' }
  ],
  default: 'ethereum',
  description: 'The blockchain network to query',
},
{
  displayName: 'Period',
  name: 'period',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['tokens'], operation: ['getTokenHistoricalPrices'] } },
  options: [
    { name: '1 Day', value: '1d' },
    { name: '7 Days', value: '7d' },
    { name: '30 Days', value: '30d' },
    { name: '90 Days', value: '90d' },
    { name: '1 Year', value: '1y' }
  ],
  default: '7d',
  description: 'Time period for historical data',
},
{
  displayName: 'Token Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['tokens'], operation: ['getMultipleTokenPrices'] } },
  default: '',
  placeholder: '0x6B175474E89094C44Da98b954EedeAC495271d0F,0xA0b86a33E6441a83b8bf10b0e8e0a56C8bbD8B6f',
  description: 'Comma-separated list of token contract addresses',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['tokens'], operation: ['getMultipleTokenPrices'] } },
  options: [
    { name: 'Ethereum', value: 'ethereum' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Arbitrum', value: 'arbitrum' },
    { name: 'Optimism', value: 'optimism' },
    { name: 'Fantom', value: 'fantom' },
    { name: 'Avalanche', value: 'avalanche' }
  ],
  default: 'ethereum',
  description: 'The blockchain network to query',
},
{
	displayName: 'Chain',
	name: 'chain',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getTotalValueLocked', 'getTradingVolume', 'getFeeStatistics', 'getPoolApyData', 'getProtocolRevenue'],
		},
	},
	options: [
		{ name: 'Ethereum', value: 'ethereum' },
		{ name: 'Polygon', value: 'polygon' },
		{ name: 'Arbitrum', value: 'arbitrum' },
		{ name: 'Optimism', value: 'optimism' },
		{ name: 'Fantom', value: 'fantom' },
		{ name: 'Avalanche', value: 'avalanche' },
		{ name: 'xDAI', value: 'xdai' },
	],
	default: 'ethereum',
	description: 'The blockchain network to query',
},
{
	displayName: 'Period',
	name: 'period',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getTotalValueLocked', 'getTradingVolume', 'getFeeStatistics', 'getProtocolRevenue'],
		},
	},
	options: [
		{ name: '1 Day', value: '1d' },
		{ name: '7 Days', value: '7d' },
		{ name: '30 Days', value: '30d' },
		{ name: '90 Days', value: '90d' },
		{ name: '1 Year', value: '1y' },
	],
	default: '30d',
	description: 'Time period for the analytics data',
},
{
	displayName: 'Pool Address',
	name: 'poolAddress',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['analytics'],
			operation: ['getPoolApyData'],
		},
	},
	default: '',
	description: 'The address of the Curve pool to get APY data for',
	placeholder: '0x...',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'pools':
        return [await executePoolsOperations.call(this, items)];
      case 'gauges':
        return [await executeGaugesOperations.call(this, items)];
      case 'crvUsd':
        return [await executeCrvUsdOperations.call(this, items)];
      case 'curveLending':
        return [await executeCurveLendingOperations.call(this, items)];
      case 'tokens':
        return [await executeTokensOperations.call(this, items)];
      case 'analytics':
        return [await executeAnalyticsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executePoolsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('curvefinanceApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllPools': {
					const chain = this.getNodeParameter('chain', i) as string;
					const offset = this.getNodeParameter('offset', i, 0) as number;
					const limit = this.getNodeParameter('limit', i, 100) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/pools`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs: {
							chain,
							offset,
							limit,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPool': {
					const address = this.getNodeParameter('address', i) as string;
					const chain = this.getNodeParameter('chain', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/pools/${address}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs: {
							chain,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPoolStats': {
					const address = this.getNodeParameter('address', i) as string;
					const chain = this.getNodeParameter('chain', i) as string;
					const period = this.getNodeParameter('period', i, '24h') as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/pools/${address}/stats`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs: {
							chain,
							period,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPoolReserves': {
					const address = this.getNodeParameter('address', i) as string;
					const chain = this.getNodeParameter('chain', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/pools/${address}/reserves`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs: {
							chain,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPoolTrades': {
					const address = this.getNodeParameter('address', i) as string;
					const chain = this.getNodeParameter('chain', i) as string;
					const limit = this.getNodeParameter('limit', i, 100) as number;
					const offset = this.getNodeParameter('offset', i, 0) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/pools/${address}/trades`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
						},
						qs: {
							chain,
							limit,
							offset,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeGaugesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('curvefinanceApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.baseUrl || 'https://api.curve.fi/v1';
      const headers: any = {
        'Authorization': `Bearer ${credentials.apiKey}`,
        'Content-Type': 'application/json',
      };

      switch (operation) {
        case 'getAllGauges': {
          const chain = this.getNodeParameter('chain', i) as string;
          const activeOnly = this.getNodeParameter('activeOnly', i) as boolean;

          let url = `${baseUrl}/gauges`;
          const params = new URLSearchParams();
          if (chain) params.append('chain', chain);
          if (activeOnly) params.append('active_only', 'true');
          if (params.toString()) url += `?${params.toString()}`;

          const options: any = {
            method: 'GET',
            url,
            headers,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getGauge': {
          const address = this.getNodeParameter('address', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;

          let url = `${baseUrl}/gauges/${address}`;
          const params = new URLSearchParams();
          if (chain) params.append('chain', chain);
          if (params.toString()) url += `?${params.toString()}`;

          const options: any = {
            method: 'GET',
            url,
            headers,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getGaugeWeights': {
          const address = this.getNodeParameter('address', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;
          const epoch = this.getNodeParameter('epoch', i) as number;

          let url = `${baseUrl}/gauges/${address}/weights`;
          const params = new URLSearchParams();
          if (chain) params.append('chain', chain);
          if (epoch) params.append('epoch', epoch.toString());
          if (params.toString()) url += `?${params.toString()}`;

          const options: any = {
            method: 'GET',
            url,
            headers,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getGaugeRewards': {
          const address = this.getNodeParameter('address', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;

          let url = `${baseUrl}/gauges/${address}/rewards`;
          const params = new URLSearchParams();
          if (chain) params.append('chain', chain);
          if (params.toString()) url += `?${params.toString()}`;

          const options: any = {
            method: 'GET',
            url,
            headers,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getGaugeVotes': {
          const chain = this.getNodeParameter('chain', i) as string;
          const user = this.getNodeParameter('user', i) as string;

          let url = `${baseUrl}/gauges/votes`;
          const params = new URLSearchParams();
          if (chain) params.append('chain', chain);
          if (user) params.append('user', user);
          if (params.toString()) url += `?${params.toString()}`;

          const options: any = {
            method: 'GET',
            url,
            headers,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeCrvUsdOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('curvefinanceApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getCrvUsdMarkets': {
          const chain = this.getNodeParameter('chain', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i) as number;
          
          let url = `${credentials.baseUrl}/crvusd/markets?chain=${chain}`;
          if (blockNumber) {
            url += `&block=${blockNumber}`;
          }
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getCrvUsdMarket': {
          const address = this.getNodeParameter('address', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i) as number;
          
          let url = `${credentials.baseUrl}/crvusd/markets/${address}?chain=${chain}`;
          if (blockNumber) {
            url += `&block=${blockNumber}`;
          }
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getCrvUsdUserPosition': {
          const userAddress = this.getNodeParameter('userAddress', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i) as number;
          
          let url = `${credentials.baseUrl}/crvusd/users/${userAddress}?chain=${chain}`;
          if (blockNumber) {
            url += `&block=${blockNumber}`;
          }
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getCrvUsdSupply': {
          const chain = this.getNodeParameter('chain', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i) as number;
          
          let url = `${credentials.baseUrl}/crvusd/supply?chain=${chain}`;
          if (blockNumber) {
            url += `&block=${blockNumber}`;
          }
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getCrvUsdPegStatus': {
          const chain = this.getNodeParameter('chain', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/crvusd/peg?chain=${chain}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeCurveLendingOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('curvefinanceApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const chain = this.getNodeParameter('chain', i) as string;

			switch (operation) {
				case 'getLendingMarkets': {
					const activeOnly = this.getNodeParameter('activeOnly', i) as boolean;
					const params = new URLSearchParams({
						chain,
						...(activeOnly !== undefined && { active_only: activeOnly.toString() }),
					});
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/lending/markets?${params.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getLendingMarket': {
					const address = this.getNodeParameter('address', i) as string;
					const params = new URLSearchParams({ chain });
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/lending/markets/${address}?${params.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUserLendingPosition': {
					const userAddress = this.getNodeParameter('userAddress', i) as string;
					const params = new URLSearchParams({ chain });
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/lending/users/${userAddress}?${params.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getLendingRates': {
					const market = this.getNodeParameter('market', i) as string;
					const params = new URLSearchParams({
						chain,
						...(market && { market }),
					});
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/lending/rates?${params.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getLiquidations': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const params = new URLSearchParams({
						chain,
						limit: limit.toString(),
						offset: offset.toString(),
					});
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/lending/liquidations?${params.toString()}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeTokensOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('curvefinanceApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllTokens': {
          const chain = this.getNodeParameter('chain', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tokens`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              chain: chain,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getToken': {
          const address = this.getNodeParameter('address', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tokens/${address}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              chain: chain,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenPrice': {
          const address = this.getNodeParameter('address', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tokens/${address}/price`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              chain: chain,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenHistoricalPrices': {
          const address = this.getNodeParameter('address', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;
          const period = this.getNodeParameter('period', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tokens/${address}/historical`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              chain: chain,
              period: period,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getMultipleTokenPrices': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/tokens/prices`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              addresses: addresses,
              chain: chain,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeAnalyticsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('curvefinanceApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getTotalValueLocked': {
					const chain = this.getNodeParameter('chain', i) as string;
					const period = this.getNodeParameter('period', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/analytics/tvl`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							chain,
							period,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTradingVolume': {
					const chain = this.getNodeParameter('chain', i) as string;
					const period = this.getNodeParameter('period', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/analytics/volume`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							chain,
							period,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getFeeStatistics': {
					const chain = this.getNodeParameter('chain', i) as string;
					const period = this.getNodeParameter('period', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/analytics/fees`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							chain,
							period,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getPoolApyData': {
					const chain = this.getNodeParameter('chain', i) as string;
					const poolAddress = this.getNodeParameter('poolAddress', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/analytics/apy`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							chain,
							pool_address: poolAddress,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getProtocolRevenue': {
					const chain = this.getNodeParameter('chain', i) as string;
					const period = this.getNodeParameter('period', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/analytics/revenue`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						qs: {
							chain,
							period,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
						{ itemIndex: i },
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
