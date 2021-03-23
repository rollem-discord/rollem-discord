import { Storage } from '@rollem/common/src/storage/storage';

export const storage = new Storage();
export const storageInitialize$ = storage.initialize();