import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql/schema.d.ts'),
  emitTypenameField: true,
  defaultScalarType: 'unknown',
  customScalarTypeMapping: {
    DateTime: 'Date',
  },
  watch: true,
});
