
import userModel from '../src/app/v1/user/user.model';
import {getInitialUsers } from './helpers/user.helper';
import { api } from './helpers/user.helper';

beforeEach(async () => {
  await userModel.deleteMany({email: ['rodrigo@gmail.com', 'yoshi@gmail.com']});
  await userModel.create(await getInitialUsers());
});

describe('Inicio de Sesión', () => {
  test('Es posible iniciar sesión con un usuario correcto', async () => {
    const res = await api.post('/v1/users/signin').send({ email : "rodrigo@gmail.com",
      password : "123"})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(200)
  });

  test('No es posible iniciar sesión con un usuario incorrecto', async () => {
    const res = await api.post('/v1/users/signin').send({ email : "rodrigo@gmail.com",
      password : "1234"})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(401)
  });
})
