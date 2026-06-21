# Script para resolver conflitos da branch feature/i3-mobile-auth-partidas com develop
# Execute no PowerShell: .\resolver-conflitos-pr.ps1

Set-Location $PSScriptRoot

Write-Host "=== 1. Atualizando repositorio ===" -ForegroundColor Cyan
git fetch origin
git checkout feature/i3-mobile-auth-partidas
git pull origin feature/i3-mobile-auth-partidas

Write-Host "=== 2. Merge com develop ===" -ForegroundColor Cyan
git merge origin/develop
if ($LASTEXITCODE -ne 0) {
    Write-Host "Conflitos detectados - resolvendo mantendo SUA versao mobile..." -ForegroundColor Yellow

    $arquivos = @(
        "mobile/app/(tabs)/_layout.tsx",
        "mobile/app/(tabs)/guesses.tsx",
        "mobile/app/(tabs)/home.tsx",
        "mobile/app/(tabs)/matches.tsx",
        "mobile/app/_layout.tsx",
        "mobile/app/edit-guess/[id].tsx",
        "mobile/app/guess/[id].tsx",
        "mobile/app/index.tsx",
        "mobile/mocks/matches.ts"
    )

    foreach ($arquivo in $arquivos) {
        if (Test-Path $arquivo) {
            git checkout --ours -- $arquivo
            git add -- $arquivo
            Write-Host "  OK: $arquivo" -ForegroundColor Green
        }
    }

    if (Test-Path "copa") {
        git rm -rf copa 2>$null
    }

    git add -A
    git commit -m "merge: resolve conflitos com develop mantendo mobile auth e partidas"
} else {
    Write-Host "Merge sem conflitos!" -ForegroundColor Green
}

Write-Host "=== 3. Enviando para GitHub ===" -ForegroundColor Cyan
git push origin feature/i3-mobile-auth-partidas

Write-Host "=== 4. Status final ===" -ForegroundColor Cyan
git status -sb
git log -3 --oneline

Write-Host ""
Write-Host "Pronto! Agora abra o PR:" -ForegroundColor Green
Write-Host "  base: develop" -ForegroundColor White
Write-Host "  compare: feature/i3-mobile-auth-partidas" -ForegroundColor White
Write-Host "  https://github.com/GuiiAnanias/Hackaton/compare/develop...feature/i3-mobile-auth-partidas" -ForegroundColor Cyan
