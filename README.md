# n8n-nodes-chatguru

This is an n8n community node. It lets you use ChatGuru in your n8n workflows.

ChatGuru is a chat automation platform that provides a simple API for managing chats. This node integrates with the ChatGuru API and offers a variety of operations such as sending messages, adding notes, updating chat context and custom fields, managing chat names, registering new chats, sending files, executing dialogs, and checking statuses.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation to install this node in your n8n instance.

## Operations

The ChatGuru node supports the following operations:

- **Adicionar anotação**: Adds a note to a chat.
- **Atualizar campos personalizados**: Updates custom fields for the chat.
- **Atualizar contexto do chat**: Updates the chat context by adding or updating variables.
- **Atualizar nome do chat**: Updates the chat's name.
- **Cadastrar um chat**: Registers a new chat. Optional fields include initial text, user ID, and dialog ID.
- **Enviar arquivo**: Sends a file to the chat. An optional caption can be added.
- **Enviar mensagem**: Sends a text message to the chat. Optionally, you can schedule the message by providing a send date.
- **Executar diálogo**: Executes a dialog on the chat.
- **Verificar cadastro do chat**: Checks the status of a chat registration (requires chat add ID).
- **Verificar status da mensagem**: Checks the status of a sent message (requires message ID).

## Credentials

To use the ChatGuru node, you must first configure the ChatGuru API credentials. You need to provide:

- **API Endpoint** (Base URL)
- **API Key**
- **Account ID**
- **Phone ID**

Obtain these details from ChatGuru by referring to the [ChatGuru API Documentation](https://wiki.chatguru.com.br/documentacao-api/parametros-obrigatorios).

## Compatibility

This node has been tested with n8n version 0.218.0 and is expected to be compatible with later versions. Please check for any incompatibility issues if you are using a significantly newer version of n8n.

## Usage

1. **Add the Node to Your Workflow:**  
   Drag and drop the ChatGuru node into your workflow.

2. **Configure Credentials:**  
   Set up your ChatGuru API credentials in the node configuration.

3. **Select an Operation:**  
   Choose the desired operation from the **Resource** dropdown. The available operations include adding annotations, updating context or custom fields, managing chat names, registering chats, sending files or messages, executing dialogs, and checking statuses.

4. **Fill in Required Fields:**  
   Depending on the operation selected, fill in the required fields. Optional parameters are grouped in collections (e.g., Options for sending files or scheduling messages).

5. **Execute and Monitor:**  
   Run the workflow and check the output for results or errors. Use error handling as needed.

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [ChatGuru API Documentation](https://wiki.chatguru.com.br/documentacao-api/parametros-obrigatorios)
