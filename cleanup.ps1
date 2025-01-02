# Get all node processes
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue

foreach ($process in $nodeProcesses) {
    $commandLine = (Get-WmiObject Win32_Process -Filter "ProcessId = $($process.Id)").CommandLine
    if ($commandLine -like "*next dev*") {
        Write-Host "Stopping Next.js development server (PID: $($process.Id))"
        Stop-Process -Id $process.Id -Force
    }
}

Write-Host "Cleanup complete!" 