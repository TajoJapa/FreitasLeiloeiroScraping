export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/freitas',
  baseUrl: process.env.BASE_URL ?? 'https://www.freitasleiloeiro.com.br',
});
