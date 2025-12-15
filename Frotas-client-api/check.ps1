try {
  $asm = [Reflection.Assembly]::LoadFrom("Frotas.API.Domain/bin/Debug/net9.0/Frotas.API.Domain.dll")
  Write-Host "Loaded:" $asm.FullName
} catch {
  Write-Host "Load failed:" $_
  exit 1
}

try {
  $t = $asm.GetType("Frotas.API.Domain.Entities.Frotas.ReservaOficina")
  if ($t) {
    Write-Host "Found type:" $t.FullName
  } else {
    Write-Host "NOT FOUND"
  }
} catch {
  Write-Host "GetType failed:" $_
  exit 1
}

# list some known types for sanity
try {
  $types = $asm.GetTypes()
} catch [Reflection.ReflectionTypeLoadException] {
  Write-Host "LoaderExceptions:"
  $_.Exception.LoaderExceptions | ForEach-Object { Write-Host $_.Message }
  $types = $_.Exception.Types
}

if ($types) {
  $types | Where-Object { $_ -and $_.FullName -like "Frotas.API.Domain.Entities.Frotas.*" } | Select-Object -First 20 | ForEach-Object { Write-Host $_.FullName }
}
