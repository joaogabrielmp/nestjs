import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { get } from 'config';

const { database, host, password, port, synchronize, username, type } = get(
  'db',
);

export const typeOrmConfig: TypeOrmModuleOptions = {
  database: database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  host: host,
  password: password,
  port: port,
  synchronize: synchronize,
  username: username,
  type: type,
};
