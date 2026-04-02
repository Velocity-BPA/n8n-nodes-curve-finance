import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class CurveFinanceApi implements ICredentialType {
	name = 'curveFinanceApi';
	displayName = 'Curve Finance API';
	documentationUrl = 'https://docs.curve.fi/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Curve Finance API key obtained from the developer portal',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.curve.fi/v1',
			description: 'Base URL for the Curve Finance API',
		},
	];
}