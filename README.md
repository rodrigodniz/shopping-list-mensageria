# Sistema de Mensageria da Lista de Compras

## Arquitetura Geral

list-service (producer)
|
v
CloudAMQP (exchange: shopping_events)
|
+--> q.notifications (notifications-worker)
|
+--> q.analytics (analytics-worker)


## Estrutura de Pastas

shopping-list/
list-service/
server.js
rabbit.js
package.json
workers/
notifications-worker/
index.js
package.json
analytics-worker/
index.js
package.json

markdown
Copiar código

## Requisitos

- Node.js 16+
- Conta no CloudAMQP
- URL AMQP no formato:
  amqps://USER:SENHA@host.cloudamqp.com/VHOST

## Configuração do CloudAMQP

1. Criar instância no plano Little Lemur.
2. Criar exchange `shopping_events` (topic).
3. Criar filas `q.notifications` e `q.analytics`.
4. Criar bindings:
   - `list.checkout.#` → q.notifications
   - `list.checkout.#` → q.analytics

## Variável de Ambiente

$env:AMQP_URL="amqps://USER:SENHA@host.cloudamqp.com/VHOST"


## Rodar o List Service (Producer)

cd list-service
npm install
node server.js


## Rodar o Notifications Worker

cd workers/notifications-worker
npm install
node index.js


## Rodar o Analytics Worker

cd workers/analytics-worker
npm install
node index.js


## Teste Completo

1. Iniciar os workers.
2. Iniciar o list-service.
3. Executar:

curl -X POST http://localhost:3000/lists/123/checkout


4. Verificar logs dos workers.