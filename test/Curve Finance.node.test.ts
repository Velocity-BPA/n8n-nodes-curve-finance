/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { CurveFinance } from '../nodes/Curve Finance/Curve Finance.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('CurveFinance Node', () => {
  let node: CurveFinance;

  beforeAll(() => {
    node = new CurveFinance();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Curve Finance');
      expect(node.description.name).toBe('curvefinance');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Pools Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.curve.fi/v1'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	it('should get all pools successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAllPools')
			.mockReturnValueOnce('ethereum')
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(100);

		const mockResponse = {
			data: [
				{ address: '0x123', name: 'Pool 1' },
				{ address: '0x456', name: 'Pool 2' }
			]
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executePoolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.curve.fi/v1/pools',
			headers: { 'Authorization': 'Bearer test-key' },
			qs: { chain: 'ethereum', offset: 0, limit: 100 },
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should get pool details successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getPool')
			.mockReturnValueOnce('0x123456789')
			.mockReturnValueOnce('ethereum');

		const mockResponse = {
			address: '0x123456789',
			name: 'Test Pool',
			coins: ['USDC', 'USDT']
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executePoolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.curve.fi/v1/pools/0x123456789',
			headers: { 'Authorization': 'Bearer test-key' },
			qs: { chain: 'ethereum' },
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should get pool stats successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getPoolStats')
			.mockReturnValueOnce('0x123456789')
			.mockReturnValueOnce('ethereum')
			.mockReturnValueOnce('24h');

		const mockResponse = {
			volume: 1000000,
			fees: 500,
			apy: 0.05
		};

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executePoolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://api.curve.fi/v1/pools/0x123456789/stats',
			headers: { 'Authorization': 'Bearer test-key' },
			qs: { chain: 'ethereum', period: '24h' },
			json: true,
		});
		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should handle errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllPools');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executePoolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{
			json: { error: 'API Error' },
			pairedItem: { item: 0 }
		}]);
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllPools');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executePoolsOperations.call(mockExecuteFunctions, [{ json: {} }]))
			.rejects.toThrow('API Error');
	});
});

describe('Gauges Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.curve.fi/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getAllGauges', () => {
    it('should get all gauges successfully', async () => {
      const mockResponse = { data: [{ address: '0x123', name: 'Test Gauge' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllGauges')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce(false);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGaugesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle getAllGauges error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllGauges');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeGaugesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getGauge', () => {
    it('should get gauge details successfully', async () => {
      const mockResponse = { address: '0x123', totalSupply: '1000000' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getGauge')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('ethereum');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGaugesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle getGauge error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getGauge');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Gauge not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeGaugesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('Gauge not found');
    });
  });

  describe('getGaugeWeights', () => {
    it('should get gauge weights successfully', async () => {
      const mockResponse = { weights: { '0x123': 0.25 } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getGaugeWeights')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce(100);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGaugesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getGaugeRewards', () => {
    it('should get gauge rewards successfully', async () => {
      const mockResponse = { rewardRate: '1000', totalRewards: '50000' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getGaugeRewards')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('ethereum');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGaugesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getGaugeVotes', () => {
    it('should get gauge votes successfully', async () => {
      const mockResponse = { votes: { '0x123': 1000, '0x456': 500 } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getGaugeVotes')
        .mockReturnValueOnce('ethereum')
        .mockReturnValueOnce('0xuser123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGaugesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('CrvUsd Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.curve.fi/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get crvUSD markets successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCrvUsdMarkets')
      .mockReturnValueOnce('ethereum')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      markets: [{ address: '0x123', name: 'Test Market' }]
    });

    const result = await executeCrvUsdOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.curve.fi/v1/crvusd/markets?chain=ethereum',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get specific crvUSD market successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCrvUsdMarket')
      .mockReturnValueOnce('0x123abc')
      .mockReturnValueOnce('ethereum')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      address: '0x123abc',
      totalSupply: '1000000'
    });

    const result = await executeCrvUsdOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.curve.fi/v1/crvusd/markets/0x123abc?chain=ethereum',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get user crvUSD position successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCrvUsdUserPosition')
      .mockReturnValueOnce('0xuseraddress')
      .mockReturnValueOnce('ethereum')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      user: '0xuseraddress',
      positions: [{ market: '0x123', balance: '5000' }]
    });

    const result = await executeCrvUsdOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.curve.fi/v1/crvusd/users/0xuseraddress?chain=ethereum',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get crvUSD supply successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCrvUsdSupply')
      .mockReturnValueOnce('ethereum')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      totalSupply: '100000000',
      circulatingSupply: '95000000'
    });

    const result = await executeCrvUsdOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.curve.fi/v1/crvusd/supply?chain=ethereum',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get crvUSD peg status successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCrvUsdPegStatus')
      .mockReturnValueOnce('ethereum');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      price: 1.001,
      deviation: 0.001,
      stability: 'stable'
    });

    const result = await executeCrvUsdOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.curve.fi/v1/crvusd/peg?chain=ethereum',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCrvUsdMarkets')
      .mockReturnValueOnce('ethereum')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('API Error')
    );

    await expect(
      executeCrvUsdOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });

  it('should continue on fail when configured', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCrvUsdMarkets')
      .mockReturnValueOnce('ethereum')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
      new Error('API Error')
    );

    const result = await executeCrvUsdOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executeCrvUsdOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Curve Lending Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.curve.fi/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Curve Lending Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getLendingMarkets operation', () => {
		it('should get lending markets successfully', async () => {
			const mockResponse = { markets: [{ address: '0x123', name: 'Test Market' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getLendingMarkets')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce(true);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCurveLendingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle errors in getLendingMarkets', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getLendingMarkets')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeCurveLendingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getLendingMarket operation', () => {
		it('should get specific lending market successfully', async () => {
			const mockResponse = { address: '0x123', name: 'Test Market', tvl: '1000000' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getLendingMarket')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce('0x123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCurveLendingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getUserLendingPosition operation', () => {
		it('should get user lending position successfully', async () => {
			const mockResponse = { user: '0xabc', positions: [{ market: '0x123', balance: '1000' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUserLendingPosition')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce('0xabc');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCurveLendingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getLendingRates operation', () => {
		it('should get lending rates successfully', async () => {
			const mockResponse = { rates: [{ market: '0x123', borrowRate: '5.5', lendRate: '4.2' }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getLendingRates')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce('0x123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCurveLendingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getLiquidations operation', () => {
		it('should get liquidations successfully', async () => {
			const mockResponse = { liquidations: [{ txHash: '0xdef', amount: '5000', timestamp: 1234567890 }] };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getLiquidations')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(0);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeCurveLendingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});
});

describe('Tokens Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.curve.fi/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get all tokens successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getAllTokens';
      if (paramName === 'chain') return 'ethereum';
      return '';
    });

    const mockResponse = { tokens: [{ address: '0x123', symbol: 'TEST' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should get token details successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getToken';
      if (paramName === 'address') return '0x6B175474E89094C44Da98b954EedeAC495271d0F';
      if (paramName === 'chain') return 'ethereum';
      return '';
    });

    const mockResponse = { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should get token price successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getTokenPrice';
      if (paramName === 'address') return '0x6B175474E89094C44Da98b954EedeAC495271d0F';
      if (paramName === 'chain') return 'ethereum';
      return '';
    });

    const mockResponse = { price: 1.001 };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should get token historical prices successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getTokenHistoricalPrices';
      if (paramName === 'address') return '0x6B175474E89094C44Da98b954EedeAC495271d0F';
      if (paramName === 'chain') return 'ethereum';
      if (paramName === 'period') return '7d';
      return '';
    });

    const mockResponse = { prices: [{ timestamp: 1634567890, price: 1.001 }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should get multiple token prices successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getMultipleTokenPrices';
      if (paramName === 'addresses') return '0x6B175474E89094C44Da98b954EedeAC495271d0F,0xA0b86a33E6441a83b8bf10b0e8e0a56C8bbD8B6f';
      if (paramName === 'chain') return 'ethereum';
      return '';
    });

    const mockResponse = { 
      prices: {
        '0x6B175474E89094C44Da98b954EedeAC495271d0F': 1.001,
        '0xA0b86a33E6441a83b8bf10b0e8e0a56C8bbD8B6f': 1850.50
      }
    };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getToken';
      return '';
    });
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 }
    }]);
  });
});

describe('Analytics Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.curve.fi/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getTotalValueLocked operation', () => {
		it('should get total value locked successfully', async () => {
			const mockTvlData = {
				tvl: '1000000000',
				chain: 'ethereum',
				period: '30d',
				timestamp: '2024-01-01T00:00:00Z',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTotalValueLocked')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce('30d');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTvlData);

			const items = [{ json: {} }];
			const result = await executeAnalyticsOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: mockTvlData,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.curve.fi/v1/analytics/tvl',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				qs: {
					chain: 'ethereum',
					period: '30d',
				},
				json: true,
			});
		});

		it('should handle errors in getTotalValueLocked', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTotalValueLocked')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce('30d');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('API Error'),
			);

			const items = [{ json: {} }];

			await expect(
				executeAnalyticsOperations.call(mockExecuteFunctions, items),
			).rejects.toThrow('API Error');
		});
	});

	describe('getTradingVolume operation', () => {
		it('should get trading volume successfully', async () => {
			const mockVolumeData = {
				volume: '50000000',
				chain: 'polygon',
				period: '7d',
				timestamp: '2024-01-01T00:00:00Z',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTradingVolume')
				.mockReturnValueOnce('polygon')
				.mockReturnValueOnce('7d');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockVolumeData);

			const items = [{ json: {} }];
			const result = await executeAnalyticsOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: mockVolumeData,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getFeeStatistics operation', () => {
		it('should get fee statistics successfully', async () => {
			const mockFeeData = {
				totalFees: '1000000',
				adminFees: '500000',
				lpFees: '500000',
				chain: 'arbitrum',
				period: '30d',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getFeeStatistics')
				.mockReturnValueOnce('arbitrum')
				.mockReturnValueOnce('30d');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockFeeData);

			const items = [{ json: {} }];
			const result = await executeAnalyticsOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: mockFeeData,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getPoolApyData operation', () => {
		it('should get pool APY data successfully', async () => {
			const mockApyData = {
				apy: '15.5',
				baseApy: '12.3',
				crvApy: '3.2',
				poolAddress: '0x123...',
				chain: 'ethereum',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getPoolApyData')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce('0x123...');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockApyData);

			const items = [{ json: {} }];
			const result = await executeAnalyticsOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: mockApyData,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.curve.fi/v1/analytics/apy',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				qs: {
					chain: 'ethereum',
					pool_address: '0x123...',
				},
				json: true,
			});
		});
	});

	describe('getProtocolRevenue operation', () => {
		it('should get protocol revenue successfully', async () => {
			const mockRevenueData = {
				totalRevenue: '5000000',
				feeRevenue: '3000000',
				crvRevenue: '2000000',
				chain: 'ethereum',
				period: '90d',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getProtocolRevenue')
				.mockReturnValueOnce('ethereum')
				.mockReturnValueOnce('90d');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockRevenueData);

			const items = [{ json: {} }];
			const result = await executeAnalyticsOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: mockRevenueData,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('error handling with continueOnFail', () => {
		it('should continue on fail when enabled', async () => {
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTotalValueLocked');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('Network error'),
			);

			const items = [{ json: {} }];
			const result = await executeAnalyticsOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: { error: 'Network error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});
});
