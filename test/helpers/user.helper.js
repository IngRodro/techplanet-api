import supertest from 'supertest';
import { App } from '../../src/main';

import userModel from '../../src/app/v1/user/user.model';
import {encryptPass} from '../../src/Utils/cryptPass';
export const api = supertest(App);

export const initialUsers = [
  {
    email : "rodrigo@gmail.com",
    name : "Rodrigo Ramirez",
    password : "",
    profilePic: {
      public_id: "test/xrlhpxmet5uke8xcznbv",
      secure_url: "https://res.cloudinary.com/project-tpis/image/upload/v1724692636/test/xrlhpxmet5uke8xcznbv.png"
    }
  },
  {
    email : "yoshi@gmail.com",
    name : "Joshua Galdamez",
    password : "",
    profilePic: {
      public_id: "test/rbxfobicxbahvr8k9i1z",
      secure_url: "https://res.cloudinary.com/project-tpis/image/upload/v1724692594/test/rbxfobicxbahvr8k9i1z.jpg"
    }
  }
];

export const getInitialUsers = async () => {
  const password1 = await encryptPass("123");
  const password2 = await encryptPass("yoshi");

  initialUsers[0].password = password1;
  initialUsers[1].password = password2;

  return initialUsers;
};

export const getUsers = async () => {
  const user = await userModel.find({});
  return user.map((restaurant) => restaurant.toJSON());
};

