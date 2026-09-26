Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param(
        [string]$Path,
        [int]$MaxWidth = 1600,
        [long]$Quality = 82
    )

    if (-not (Test-Path $Path)) { return }

    $originalBytes = (Get-Item $Path).Length
    $img = [System.Drawing.Image]::FromFile($Path)
    $origW = $img.Width
    $origH = $img.Height

    $newW = $origW
    $newH = $origH

    if ($origW -gt $MaxWidth) {
        $newW = $MaxWidth
        $newH = [int]([double]$origH * ($MaxWidth / [double]$origW))
    }

    $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $rect = New-Object System.Drawing.Rectangle(0, 0, $newW, $newH)
    $g.DrawImage($img, $rect)

    $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)

    $img.Dispose()
    $g.Dispose()

    $tempPath = "$Path.tmp"
    $bmp.Save($tempPath, $encoder, $encoderParams)
    $bmp.Dispose()

    $newBytes = (Get-Item $tempPath).Length
    Move-Item -Path $tempPath -Destination $Path -Force

    $pct = [math]::Round((1 - ($newBytes / $originalBytes)) * 100, 1)
    Write-Host "Optimized $Path : $originalBytes bytes -> $newBytes bytes (-$pct%)"
}

$files = @(
    "D:\Hospitality\assets\hero.jpg",
    "D:\Hospitality\assets\about.jpg",
    "D:\Hospitality\assets\dining\chef-special.jpg",
    "D:\Hospitality\assets\rooms\deluxe-suite.jpg"
)

foreach ($f in $files) {
    Optimize-Image -Path $f -MaxWidth 1600 -Quality 82
}
