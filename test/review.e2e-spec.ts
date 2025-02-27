import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect, Types } from 'mongoose';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const testReview: CreateReviewDto = {
  name: 'Test Review',
  title: 'test',
  description: 'test',
  rating: 5,
  productId,
};

const loginDto: AuthDto = {
  email: 'a4@test.test',
  password: '12345',
};

describe('review (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    token = body.access_token;
  });

  test('/review/create (POST)', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testReview)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
  });

  test('/review/create (POST) - fail', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testReview, rating: 0 })
      .expect(400)
      .then(({ body }: request.Response) => {
        console.log(body);
      });
  });

  test('review/byProduct/:productId (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .expect(200)
      .then(({ body }: request.Response) => {
        console.log(body);
        expect(body.length).not.toBe(0);
      });
  });

  test('review/byProduct/:productId (GET) - fail', async () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + new Types.ObjectId().toHexString())
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      });
  });

  it('review/delete (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('review/delete (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete('/review/' + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${token}`)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      });
  });

  afterAll(async () => {
    disconnect();
  });
});
