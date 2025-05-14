import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
    JsonObject,
    NodeApiError,
    NodeOperationError,
} from 'n8n-workflow';

export class ChatGuru implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ChatGuru',
		name: 'chatGuru',
		icon: 'file:chatguru.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"]}}',
		description: 'Node para integrar com a API do ChatGuru',
		defaults: {
			name: 'ChatGuru',
		},
		// @ts-ignore
		inputs: ['main'],
		// @ts-ignore
		outputs: ['main'],
		credentials: [
			{
				name: 'chatGuruApi',
				// Credencial só usada em modo "Credential"
				displayOptions: {
					show: {
						mode: ['credential'],
					},
				},
				required: true,
			},
		],
		properties: [
			{
				// Seleção do modo de operação do node
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				options: [
					{ name: 'Credential', value: 'credential' },
					{ name: 'Manual', value: 'manual' },
				],
				default: 'credential',
				description: 'Escolha usar credencial pré-cadastrada ou inserir manualmente',
			},
			{
				// Somente em modo "Manual": URL da API
				displayName: 'API Endpoint',
				name: 'baseUrl',
				type: 'string',
				default: '',
				placeholder: 'Endpoint',
				required: true,
				displayOptions: { show: { mode: ['manual'] } },
				description: 'Base URL da API do ChatGuru',
			},
			{
				// Somente em modo "Manual": chave de autenticação
				displayName: 'API Key',
				name: 'key',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				placeholder: 'Key',
				required: true,
				displayOptions: { show: { mode: ['manual'] } },
				description: 'Sua chave de API do ChatGuru',
			},
			{
				// Somente em modo "Manual": ID da conta
				displayName: 'Account ID',
				name: 'account_id',
				type: 'string',
				default: '',
				placeholder: 'ID da Conta',
				required: true,
				displayOptions: { show: { mode: ['manual'] } },
				description: 'Identificador da conta ChatGuru',
			},
			{
				// Somente em modo "Manual": ID do telefone
				displayName: 'Phone ID',
				name: 'phone_id',
				type: 'string',
				default: '',
				placeholder: 'ID do Aparelho',
				required: true,
				displayOptions: { show: { mode: ['manual'] } },
				description: 'Identificador do telefone ChatGuru',
			},
			// Selecionar qual recurso (método) será usado
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Adicionar Anotação',
						value: 'note',
						description: 'Adiciona uma anotação no chat (note_add)',
					},
					{
						name: 'Atualizar Campos Personalizado',
						value: 'customFields',
						description: 'Atualiza campos personalizados do chat (chat_update_custom_fields)',
					},
					{
						name: 'Atualizar Contexto Do Chat',
						value: 'context',
						description: 'Adiciona/atualiza variáveis de contexto no chat (chat_update_context)',
					},
					{
						name: 'Atualizar Nome Do Chat',
						value: 'chatName',
						description: 'Atualiza o nome do chat (chat_update_name)',
					},
					{
						name: 'Cadastrar Um Chat',
						value: 'registerChat',
						description: 'Cadastra um novo chat (chat_add)',
					},
					{
						name: 'Enviar Arquivo',
						value: 'sendFile',
						description: 'Envia um arquivo para o chat (message_file_send)',
					},
					{
						name: 'Enviar Mensagem',
						value: 'sendMessage',
						description: 'Envia uma mensagem de texto ao chat (message_send)',
					},
					{
						name: 'Executar Diálogo',
						value: 'executeDialog',
						description: 'Executa um diálogo no chat (dialog_execute)',
					},
					{
						name: 'Verificar Cadastro Do Chat',
						value: 'checkChatAdd',
						description: 'Verifica o status do cadastro do chat (chat_add_status)',
					},
					{
						name: 'Verificar Status Da Mensagem',
						value: 'checkMessageStatus',
						description: 'Verifica o status de uma mensagem enviada (message_status)',
					},
				],
				default: 'note',
				description: 'Selecione o recurso que deseja utilizar',
			},

			/*
			 * A maioria das operações precisa de chat_number,
			 * exceto checkChatAdd (chat_add_status) e checkMessageStatus (message_status).
			 */
			{
				displayName: 'Chat Number',
				name: 'chat_number',
				type: 'string',
				default: '',
				description: 'Número do chat',
				displayOptions: {
					show: {
						resource: [
							'note',
							'context',
							'customFields',
							'chatName',
							'registerChat',
							'sendFile',
							'sendMessage',
							'executeDialog',
						],
					},
				},
			},

			/* -------------------------------------------------------------------------- */
			/*                                Adicionar anotação                          */
			/* -------------------------------------------------------------------------- */
			{
				displayName: 'Note Text',
				name: 'note_text',
				type: 'string',
				default: '',
				description: 'Texto da anotação',
				displayOptions: {
					show: {
						resource: ['note'],
					},
				},
			},

			/* -------------------------------------------------------------------------- */
			/*                         Atualizar contexto do chat                         */
			/* -------------------------------------------------------------------------- */
			{
				displayName: 'Context Variables',
				name: 'contextVariables',
				type: 'fixedCollection',
				placeholder: 'Adicionar Variáveis',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['context'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Variable',
						name: 'variable',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'Nome da variável (sem o prefixo "var__")',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Valor da variável',
							},
						],
					},
				],
			},

			/* -------------------------------------------------------------------------- */
			/*                       Atualizar campos personalizados                      */
			/* -------------------------------------------------------------------------- */
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'fixedCollection',
				placeholder: 'Adicionar Campos',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['customFields'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Field',
						name: 'field',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'Nome do campo (sem o prefixo "field__")',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Valor do campo',
							},
						],
					},
				],
			},

			/* -------------------------------------------------------------------------- */
			/*                           Atualizar nome do chat                           */
			/* -------------------------------------------------------------------------- */
			{
				displayName: 'Chat Name',
				name: 'chat_name',
				type: 'string',
				default: '',
				description: 'Novo nome do chat',
				displayOptions: {
					show: {
						resource: ['chatName'],
					},
				},
			},

			/* -------------------------------------------------------------------------- */
			/*                             Cadastrar um chat                              */
			/* -------------------------------------------------------------------------- */
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				description: 'Nome inicial do chat',
				displayOptions: {
					show: {
						resource: ['registerChat'],
					},
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['registerChat'],
					},
				},
				options: [
					{
						displayName: 'Text',
						name: 'text',
						type: 'string',
						default: '',
						description: 'Mensagem inicial (se não preenchida, será enviada um espaço)',
					},
					{
						displayName: 'User ID',
						name: 'user_id',
						type: 'string',
						default: '',
						description: 'ID do usuário responsável pelo chat (opcional)',
					},
					{
						displayName: 'Dialog ID',
						name: 'dialog_id',
						type: 'string',
						default: '',
						description: 'ID do diálogo que será executado (opcional)',
					},
				],
			},

			/* -------------------------------------------------------------------------- */
			/*                               Enviar arquivo                               */
			/* -------------------------------------------------------------------------- */
			{
				displayName: 'File URL',
				name: 'file_url',
				type: 'string',
				default: '',
				required: true,
				description: 'URL do arquivo (deve terminar com a extensão, ex: .pdf)',
				displayOptions: {
					show: {
						resource: ['sendFile'],
					},
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['sendFile'],
					},
				},
				options: [
					{
						displayName: 'Caption',
						name: 'caption',
						type: 'string',
						default: '',
						description: 'Legenda do arquivo (opcional)',
					},
				],
			},

			/* -------------------------------------------------------------------------- */
			/*                              Enviar mensagem                              */
			/* -------------------------------------------------------------------------- */
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				default: '',
				required: true,
				description: 'Mensagem que será enviada ao usuário',
				displayOptions: {
					show: {
						resource: ['sendMessage'],
					},
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['sendMessage'],
					},
				},
				options: [
					{
						displayName: 'Send Date',
						name: 'send_date',
						type: 'dateTime',
						default: '',
						description: 'Agendar data/hora para envio da mensagem (YYYY-MM-DD HH:mm)',
					},
				],
			},

			/* -------------------------------------------------------------------------- */
			/*                              Executar diálogo                              */
			/* -------------------------------------------------------------------------- */
			{
				displayName: 'Dialog ID',
				name: 'dialog_id',
				type: 'string',
				default: '',
				required: true,
				description: 'ID do diálogo que será executado',
				displayOptions: {
					show: {
						resource: ['executeDialog'],
					},
				},
			},

			/* -------------------------------------------------------------------------- */
			/*                           Verificar cadastro do chat                       */
			/* -------------------------------------------------------------------------- */
			{
				displayName: 'Chat Add ID',
				name: 'chat_add_id',
				type: 'string',
				default: '',
				required: true,
				description: 'ID do cadastro do chat retornado ao criar o chat',
				displayOptions: {
					show: {
						resource: ['checkChatAdd'],
					},
				},
			},

			/* -------------------------------------------------------------------------- */
			/*                           Verificar status da mensagem                     */
			/* -------------------------------------------------------------------------- */
			{
				displayName: 'Message ID',
				name: 'message_id',
				type: 'string',
				default: '',
				required: true,
				description: 'ID da mensagem retornado após envio com sucesso',
				displayOptions: {
					show: {
						resource: ['checkMessageStatus'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		// lê modo de operação
		const mode = this.getNodeParameter('mode', 0) as string;

		// Prepara objeto de credenciais, usando cast when credential
		let credentials: {
			baseUrl: string;
			key: string;
			account_id: string;
			phone_id: string;
		};

		if (mode === 'credential') {
			credentials = (await this.getCredentials('chatGuruApi')) as unknown as {
				baseUrl: string;
				key: string;
				account_id: string;
				phone_id: string;
			};
		} else {
			credentials = {
				baseUrl: this.getNodeParameter('baseUrl', 0) as string,
				key: this.getNodeParameter('key', 0) as string,
				account_id: this.getNodeParameter('account_id', 0) as string,
				phone_id: this.getNodeParameter('phone_id', 0) as string,
			};
		}

		// Obter credenciais
		// const credentials = await this.getCredentials('chatGuruApi') as unknown as {
		// 	baseUrl: string;
		// 	key: string;
		// 	account_id: string;
		// 	phone_id: string;
		// };

		for (let i = 0; i < length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;

			// Monta um objeto base com dados de autenticação
			const requestBody: any = {
				key: credentials.key,
				account_id: credentials.account_id,
				phone_id: credentials.phone_id,
			};

			// Coletar dados específicos por recurso
			switch (resource) {
				/* ---------------------------------------------------------- */
				/*                       Adicionar anotação                    */
				/* ---------------------------------------------------------- */
				case 'note':
					requestBody.action = 'note_add';
					requestBody.chat_number = this.getNodeParameter('chat_number', i) as string;
					requestBody.note_text = this.getNodeParameter('note_text', i) as string;
					break;

				/* ---------------------------------------------------------- */
				/*                    Atualizar contexto do chat               */
				/* ---------------------------------------------------------- */
				case 'context':
					requestBody.action = 'chat_update_context';
					requestBody.chat_number = this.getNodeParameter('chat_number', i) as string;

					// Processar variáveis de contexto
					const contextData = this.getNodeParameter('contextVariables', i, {}) as {
						variable?: Array<{ key: string; value: string }>;
					};
					if (contextData.variable) {
						for (const varItem of contextData.variable) {
							if (varItem.key) {
								requestBody[`var__${varItem.key}`] = varItem.value;
							}
						}
					}
					break;

				/* ---------------------------------------------------------- */
				/*                 Atualizar campos personalizados             */
				/* ---------------------------------------------------------- */
				case 'customFields':
					requestBody.action = 'chat_update_custom_fields';
					requestBody.chat_number = this.getNodeParameter('chat_number', i) as string;

					const customData = this.getNodeParameter('customFields', i, {}) as {
						field?: Array<{ key: string; value: string }>;
					};
					if (customData.field) {
						for (const fieldItem of customData.field) {
							if (fieldItem.key) {
								requestBody[`field__${fieldItem.key}`] = fieldItem.value;
							}
						}
					}
					break;

				/* ---------------------------------------------------------- */
				/*                        Atualizar nome do chat               */
				/* ---------------------------------------------------------- */
				case 'chatName':
					requestBody.action = 'chat_update_name';
					requestBody.chat_number = this.getNodeParameter('chat_number', i) as string;
					requestBody.chat_name = this.getNodeParameter('chat_name', i) as string;
					break;

				/* ---------------------------------------------------------- */
				/*                           Cadastrar um chat                 */
				/* ---------------------------------------------------------- */
				case 'registerChat':
					requestBody.action = 'chat_add';
					requestBody.chat_number = this.getNodeParameter('chat_number', i) as string;
					requestBody.name = this.getNodeParameter('name', i) as string;

					// Opções opcionais (text, user_id, dialog_id)
					const registerOptions = this.getNodeParameter('options', i, {}) as {
						text?: string;
						user_id?: string;
						dialog_id?: string;
					};
					requestBody.text = registerOptions.text?.trim() ? registerOptions.text : ' ';
					if (registerOptions.user_id) {
						requestBody.user_id = registerOptions.user_id;
					}
					if (registerOptions.dialog_id) {
						requestBody.dialog_id = registerOptions.dialog_id;
					}
					break;

				/* ---------------------------------------------------------- */
				/*                             Enviar arquivo                  */
				/* ---------------------------------------------------------- */
				case 'sendFile':
					requestBody.action = 'message_file_send';
					requestBody.chat_number = this.getNodeParameter('chat_number', i) as string;
					requestBody.file_url = this.getNodeParameter('file_url', i) as string;

					// Opção de legenda
					const sendFileOptions = this.getNodeParameter('options', i, {}) as {
						caption?: string;
					};
					if (sendFileOptions.caption) {
						requestBody.caption = sendFileOptions.caption;
					}
					break;

				/* ---------------------------------------------------------- */
				/*                           Enviar mensagem                   */
				/* ---------------------------------------------------------- */
				case 'sendMessage':
					requestBody.action = 'message_send';
					requestBody.chat_number = this.getNodeParameter('chat_number', i) as string;
					requestBody.text = this.getNodeParameter('text', i) as string;

					const sendMessageOptions = this.getNodeParameter('options', i, {}) as {
						send_date?: string;
					};
					// Se o usuário selecionar uma data/hora, envia
					if (sendMessageOptions.send_date) {
						requestBody.send_date = sendMessageOptions.send_date;
					}
					break;

				/* ---------------------------------------------------------- */
				/*                          Executar diálogo                   */
				/* ---------------------------------------------------------- */
				case 'executeDialog':
					requestBody.action = 'dialog_execute';
					requestBody.chat_number = this.getNodeParameter('chat_number', i) as string;
					requestBody.dialog_id = this.getNodeParameter('dialog_id', i) as string;
					break;

				/* ---------------------------------------------------------- */
				/*                      Verificar cadastro do chat             */
				/* ---------------------------------------------------------- */
				case 'checkChatAdd':
					requestBody.action = 'chat_add_status';
					// Este método não usa chat_number
					requestBody.chat_add_id = this.getNodeParameter('chat_add_id', i) as string;
					break;

				/* ---------------------------------------------------------- */
				/*                      Verificar status da mensagem           */
				/* ---------------------------------------------------------- */
				case 'checkMessageStatus':
					requestBody.action = 'message_status';
					// Este método não usa chat_number
					requestBody.message_id = this.getNodeParameter('message_id', i) as string;
					break;

				default:
					throw new NodeOperationError(this.getNode(), `Recurso não suportado: ${resource}`);
			}

			// Configuração da requisição
			const options = {
				method: 'POST' as const,
				uri: credentials.baseUrl,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				form: requestBody,
				json: true,
			};

			let responseData;
			try {
				responseData = await this.helpers.request(options);
			} catch (error) {
				if (this.continueOnFail()) {
					responseData = { error: (error as Error).message };
				} else {
					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			}

			returnData.push({ json: responseData });
		}

		return [returnData];
	}
}
