import { LibraryDataSource } from '../config/database';

beforeAll(async () => {
    if (!LibraryDataSource.isInitialized) {
        await LibraryDataSource.initialize();
    }
});

afterAll(async () => {
    if (LibraryDataSource.isInitialized) {
        await LibraryDataSource.destroy();
    }
}); 