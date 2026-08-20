import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const schemaDirectory = resolve(process.cwd(), 'docs/mqtt_schema');

function readSchema(fileName: string): Record<string, any> {
  return JSON.parse(readFileSync(resolve(schemaDirectory, fileName), 'utf8'));
}

describe('transport metadata schema coverage', () => {
  it.each([
    'envelope.schema.json',
    'batch_envelope.schema.json',
    'compressed_envelope.schema.json'
  ])('%s references the shared transport metadata contract', (fileName) => {
    const schema = readSchema(fileName);

    expect(schema.properties.transport_metadata).toEqual({
      $ref: 'transport_metadata.schema.json'
    });
  });

  it('keeps transport protocol values synchronized with the TypeScript contract', () => {
    const schema = readSchema('transport_metadata.schema.json');
    const source = readFileSync(resolve(schemaDirectory, 'types.ts'), 'utf8');

    for (const protocol of schema.properties.protocol.enum) {
      expect(source).toContain(`'${protocol}'`);
    }
  });
});
