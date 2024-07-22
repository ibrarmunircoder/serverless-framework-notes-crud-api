'use strict';

const init = require('./steps/init');
const { an_authenticated_user } = require('./steps/given');
const {
  we_invoke_createNote,
  we_invoke_updateNote,
  we_invoke_deleteNote,
} = require('./steps/when');
let idToken;

describe('Given an authenticated user', async () => {
  beforeAll(async () => {
    init();
    const user = await an_authenticated_user();
    idToken = user.AuthenticationResult.IdToken;
  });

  describe('When we invoke POST/notes endpoint', async () => {
    it('Should create a new note', async () => {
      const body = {
        id: '100',
        title: 'My test notes',
        body: 'Hello, this is a test note',
      };
      const result = await we_invoke_createNote({ idToken, body });
      expect(result.statusCode).toEqual(201);
      expect(result.body).not.toBeNull();
    });
  });

  describe('When we invoke PUT /notes/:id endpoint', async () => {
    it('Should update a note', async () => {
      const noteId = '100';
      const body = {
        title: 'My test notes',
        body: 'Hello, this is a updated test note',
      };
      const result = await we_invoke_updateNote({ noteId, idToken, body });
      expect(result.statusCode).toEqual(200);
      expect(result.body).not.toBeNull();
    });
  });
  describe('When we invoke DELETE /notes/:id endpoint', async () => {
    it('Should delete a note', async () => {
      const noteId = '100';

      const result = await we_invoke_deleteNote({ noteId, idToken });
      expect(result.statusCode).toEqual(200);
      expect(result.body).not.toBeNull();
    });
  });
});
