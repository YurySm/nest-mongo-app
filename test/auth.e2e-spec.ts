import { AuthDto } from '../src/auth/dto/auth.dto';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { disconnect } from 'mongoose';
import {
  USER_BAD_PASS_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../src/auth/auth.constants';

const loginDto: AuthDto = {
  email: 'a4@test.test',
  password: '12345',
};

describe('auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  test('/auth/login (POST)', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      });
  });

  test('/auth/login (POST) - fail email', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, email: 'aa4@test.test' })
      .expect(401, {
        statusCode: 401,
        error: 'Unauthorized',
        message: USER_NOT_FOUND_ERROR,
      });
  });

  test('/auth/login (POST) - fail password', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '123455' })
      .expect(401, {
        statusCode: 401,
        error: 'Unauthorized',
        message: USER_BAD_PASS_ERROR,
      });
  });

  afterAll(async () => {
    disconnect();
  });
});
