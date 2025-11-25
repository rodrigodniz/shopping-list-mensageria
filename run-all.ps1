# -----------------------------
# Configura a variável AMQP
# -----------------------------

$env:AMQP_URL = "amqps://ohlktxql:2oSP59YGzqgzGGwiw3eedRXd9Xre6EJp@jackal.rmq.cloudamqp.com/ohlktxql"

Write-Host "AMQP_URL configurada." -ForegroundColor Green


# -----------------------------
# Abrir Notifications Worker
# -----------------------------

Write-Host "`nIniciando notifications-worker..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "
    cd `"`"$PSScriptRoot\workers\notifications-worker`"`";
    npm install;
    node index.js
"


# -----------------------------
# Abrir Analytics Worker
# -----------------------------

Write-Host "`nIniciando analytics-worker..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "
    cd `"`"$PSScriptRoot\workers\analytics-worker`"`";
    npm install;
    node index.js
"


# -----------------------------
# Abrir List Service (Producer)
# -----------------------------

Write-Host "`nIniciando list-service..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "
    cd `"`"$PSScriptRoot\list-service`"`";
    npm install;
    node server.js
"


# -----------------------------
# Aguarda o serviço subir
# -----------------------------

Write-Host "`nAguardando o list-service iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 5


# -----------------------------
# Disparar um checkout automaticamente
# -----------------------------

Write-Host "`nDisparando evento /lists/123/checkout" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/lists/123/checkout" -Method POST
    Write-Host "`nResposta recebida:" -ForegroundColor Green
    Write-Host $response.Content
}
catch {
    Write-Host "`nFalha ao chamar o checkout. Verifique se o serviço subiu corretamente." -ForegroundColor Red
}

Write-Host "`nTudo pronto." -ForegroundColor Green
