import fetchMock from 'jest-fetch-mock';
const app = require('../http_index.js');

fetchMock.enableMocks();

beforeEach(() => {
    fetchMock.resetMocks();
})


describe("GET /items ", () => {
    test('Getting the Whole List', async () => {
        // Arrange
        const response = await fetch('http://localhost:3000/items');
        const data = await response.json();

        expect(data).toEqual({message: 'Grocery List is Empty'});
        expect(fetch).toHaveBennCalledWith('http://localhost:3000/items');
    })

})