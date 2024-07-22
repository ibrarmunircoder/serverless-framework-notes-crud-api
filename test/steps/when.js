'use strict';

const { default: axios } = require('axios');

const makeHttpRequest = async (path, method, options) => {
  const root = process.env.TEST_ROOT;
  const url = `${root}/${path}`;
  const response = await axios({
    url,
    method,
    ...(options.body ? { data: options.body } : {}),
    headers: {
      Authorization: options.idToken,
    },
  });

  return {
    statusCode: response.status,
    body: response.data,
  };
};

exports.we_invoke_createNote = async ({ idToken, body }) => {
  const response = await makeHttpRequest('notes', 'POST', { idToken, body });
  return response;
};
exports.we_invoke_updateNote = async ({ noteId, idToken, body }) => {
  const response = await makeHttpRequest(`notes/${noteId}`, 'PUT', {
    idToken,
    body,
  });
  return response;
};
exports.we_invoke_deleteNote = async ({ noteId, idToken }) => {
  const response = await makeHttpRequest(`notes/${noteId}`, 'DELETE', {
    idToken,
  });
  return response;
};
