$url = "https://github.com/git-for-windows/git/releases/download/v2.48.1.windows.1/MinGit-2.48.1-64-bit.zip"
$zip = "D:\MinGit.zip"
$dest = "D:\MinGit"

Write-Host "Downloading MinGit..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing

Write-Host "Extracting MinGit..."
Expand-Archive -Path $zip -DestinationPath $dest -Force
if (Test-Path $zip) { Remove-Item $zip -Force }

Write-Host "Testing MinGit..."
& "$dest\cmd\git.exe" --version
