const { generate } = require('@graphql-codegen/cli');

async function generateTypes() {
  try {
    await generate(
      {
        schema: 'src/graphql/**/*.graphql',
        generates: {
          'src/graphql/types/graphql.ts': {
            plugins: ['typescript', 'typescript-operations', 'typescript-resolvers'],
          },
        },
        overwrite: true,
      },
      true
    );
    console.log('Types generated successfully');
  } catch (error) {
    console.error('Error generating types:', error);
  }
}

generateTypes();
