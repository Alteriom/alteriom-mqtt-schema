import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { describe, expect, it } from 'vitest';

const schemaDirectory = resolve(process.cwd(), 'docs/mqtt_schema');

function readSchema(fileName: string): Record<string, any> {
  return JSON.parse(readFileSync(resolve(schemaDirectory, fileName), 'utf8'));
}

describe('transport metadata schema coverage', () => {
  it('keeps the envelope transport contract locally resolvable', () => {
    const envelope = readSchema('envelope.schema.json');

    expect(envelope.properties.transport_metadata).toEqual({
      $ref: '#/$defs/transport_metadata'
    });
    const ajv = new Ajv({ strict: false });
    addFormats(ajv);
    expect(() => ajv.compile(envelope)).not.toThrow();
  });

  it('compiles an individual message with only its envelope dependency', () => {
    const envelope = readSchema('envelope.schema.json');
    const sensorData = readSchema('sensor_data.schema.json');
    const ajv = new Ajv({ strict: false });
    addFormats(ajv);
    ajv.addSchema(envelope, 'envelope.schema.json');

    expect(() => ajv.compile(sensorData)).not.toThrow();
  });

  it.each(['batch_envelope.schema.json', 'compressed_envelope.schema.json'])(
    '%s references the envelope transport contract',
    (fileName) => {
      const schema = readSchema(fileName);

      expect(schema.properties.transport_metadata).toEqual({
        $ref: 'envelope.schema.json#/$defs/transport_metadata'
      });
    }
  );

  it('keeps transport protocol values synchronized with the TypeScript contract', () => {
    const envelope = readSchema('envelope.schema.json');
    const source = readFileSync(resolve(schemaDirectory, 'types.ts'), 'utf8');

    for (const protocol of envelope.$defs.transport_metadata.properties.protocol.enum) {
      expect(source).toContain(`'${protocol}'`);
    }
  });
});
