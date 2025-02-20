import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

// Generate a random anonymous ID if not exists
const getAnonymousId = () => {
  let anonymousId = localStorage.getItem('anonymousId');
  if (!anonymousId) {
    anonymousId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('anonymousId', anonymousId);
  }
  return anonymousId;
}

export const anonymousId = getAnonymousId();