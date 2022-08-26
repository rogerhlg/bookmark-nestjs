import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  // Crio fora do escopo da função para ela também ser utilizada em outras fn ( before and after)
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Cria o AppModule
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Cria uma aplicação nest
    // eslint-disable-next-line prefer-const
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);

    // Apaga todo o banco antes de realizar um teste
    prisma = app.get(PrismaService);
    prisma.clearDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'teste@hotmail.com',
      password: '12345',
    };

    describe('SignUp', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: '', password: dto.password })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email, password: '' })
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('SignIn', () => {
      it('signing!', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });

      it('should throw if password is wrong', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email, password: 'wrowngPassword' })
          .expectStatus(403);
      });

      it('should throw if email is wrong', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: 'wrong@email.com', password: dto.email })
          .expectStatus(403);
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should brings user data', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user data', () => {
        const dto: EditUserDto = {
          firstName: 'Gold.',
          lastName: 'D. Roger',
        };

        return pactum
          .spec()
          .patch('/users/edit')
          .withBody(dto)
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName);
      });
    });
  });

  describe('Bookmark', () => {
    const createBookmarkDto: CreateBookmarkDto = {
      title: 'NestJS validation',
      description:
        'It is best practice to validate the correctness of any data sent into a web application.',
      stars: 4,
      link: 'https://docs.nestjs.com/techniques/validation',
    };

    const editBookmark: EditBookmarkDto = {
      title: 'Tittle edited!',
      description: 'Description edited!',
    };

    describe('Get Bookmarks by User', () => {
      it('Should bring a empty array of bookmarks by user id', () => {
        return pactum
          .spec()
          .get('/bookmarks/')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Get bookmark by ID', () => {
      it('Should not found bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '1')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(406);
      });
    });

    describe('Create', () => {
      it('Should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks/create')
          .withBody(createBookmarkDto)
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(201)
          .expectBodyContains('id')
          .expectBodyContains('title')
          .expectBodyContains('link')
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get by ID', () => {
      it('Should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200)
          .expectBodyContains('id')
          .expectBodyContains('title')
          .expectBodyContains('link');
      });
    });

    describe('Update bookmark', () => {
      it('Should update bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .withBody(editBookmark)
          .expectStatus(200)
          .expectBodyContains(editBookmark.title)
          .expectBodyContains(editBookmark.description);
      });
    });

    describe('Delete', () => {
      it('Should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders('Authorization', 'Bearer $S{userAt}')
          .expectStatus(200)
          .expectBodyContains(editBookmark.title)
          .expectBodyContains(editBookmark.description);
      });
    });
  });
});
