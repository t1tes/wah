$files = Get-ChildItem 'C:\Users\arron\AppData\Local\Temp\wah\letters\letter*.html'
foreach ($f in $files) {
    $content = Get-Content -Path $f.FullName -Raw
    $content = $content -replace 'href="letter-group1.html"', 'href="../letter-group1.html"'
    $content = $content -replace 'href="letter-group2.html"', 'href="../letter-group2.html"'
    $content = $content -replace 'href="letter-group3.html"', 'href="../letter-group3.html"'
    Set-Content -Path $f.FullName -Value $content -Encoding UTF8
}
echo 'Fixed back links'