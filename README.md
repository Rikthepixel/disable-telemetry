# Disable telemetry

Aims to disable most telemetry.

## Example
```yaml
- uses: Rikthepixel/disable-telemetry@v1.0.2
```

## Example - Write to .env file
```yaml
- uses: Rikthepixel/disable-telemetry@v1.0.2
  with:
    output: "./foo/bar/.env"
```

## Example - Custom variables
```yaml
- uses: Rikthepixel/disable-telemetry@v1.0.2
  with:
    # Variables without an "=" will by default get "=1" suffixed
    custom: |
        GH_TELEMETRY=false
        FOO_BAR_DISABLED
```
