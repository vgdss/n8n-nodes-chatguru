import {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class ChatGuruApi implements ICredentialType {
    name = 'chatGuruApi';
    displayName = 'ChatGuru API';
	documentationUrl = 'https://wiki.chatguru.com.br/documentacao-api/parametros-obrigatorios#autenticacao';
    properties: INodeProperties[] = [
        {
            displayName: 'API Endpoint',
            name: 'baseUrl',
            type: 'string',
            default: '',
            placeholder: 'Endpoint',
            description: 'Base URL da API do ChatGuru',
            required: true,
        },
        {
            displayName: 'API Key',
            name: 'key',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            placeholder: 'Key',
            required: true,
        },
        {
            displayName: 'Account ID',
            name: 'account_id',
            type: 'string',
            default: '',
            placeholder: 'ID da Conta',
            required: true,
        },
        {
            displayName: 'Phone ID',
            name: 'phone_id',
            type: 'string',
            default: '',
            placeholder: 'ID do Aparelho',
            required: true,
        },
    ];
}
