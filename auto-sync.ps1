$projectPath = "C:\Users\Diyanat Ali\Downloads\conejoys\Conejoys"
if (Test-Path $projectPath) {
    Set-Location $projectPath
    $status = git status --porcelain
    if ($status) {
        Write-Host "[Auto-Sync $(Get-Date -Format 'HH:mm:ss')] Changes detected, pushing to GitHub..."
        git add .
        git commit -m "Auto-sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git push origin main
        Write-Host "[Auto-Sync] Push successful!"
    } else {
        Write-Host "[Auto-Sync $(Get-Date -Format 'HH:mm:ss')] No changes to push."
    }
}
