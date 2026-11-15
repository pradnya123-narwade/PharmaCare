
const { describe, test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const server = require('./server');

const filePath = path.join(__dirname, 'medicines.json');

let baseURL;

describe('Pharmacy Inventory Server Tests', () => {

    before(async () => {
        fs.writeFileSync(filePath, JSON.stringify([]));

        await new Promise(resolve => {
            server.listen(0, '127.0.0.1', resolve);
        });

        const address = server.address();
        baseURL = `http://127.0.0.1:${address.port}`;
    });

    after(async () => {
        await new Promise(resolve => server.close(resolve));
    });

    test('Test 1: Server is running', async () => {
        const response = await fetch(baseURL);
        const data = await response.json();

        assert.strictEqual(response.status, 200);
        assert.strictEqual(
            data.message,
            'Pharmacy Inventory Server is Running'
        );
    });

    test('Test 2: Add a medicine', async () => {
        const response = await fetch(`${baseURL}/medicines`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Paracetamol',
                quantity: 100,
                price: 25
            })
        });

        const data = await response.json();

        assert.strictEqual(response.status, 201);
        assert.strictEqual(data.medicine.name, 'Paracetamol');
        assert.strictEqual(data.medicine.quantity, 100);
        assert.strictEqual(data.medicine.price, 25);
    });

    test('Test 3: Retrieve medicines', async () => {
        const response = await fetch(`${baseURL}/medicines`);
        const data = await response.json();

        assert.strictEqual(response.status, 200);
        assert.strictEqual(data.length, 1);
        assert.strictEqual(data[0].name, 'Paracetamol');
    });

    test('Test 4: Reject invalid medicine details', async () => {
        const response = await fetch(`${baseURL}/medicines`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Ibuprofen',
                quantity: -10,
                price: 20
            })
        });

        const data = await response.json();

        assert.strictEqual(response.status, 400);
        assert.strictEqual(
            data.error,
            'Enter valid quantity and price'
        );
    });

    test('Test 5: Handle invalid route', async () => {
        const response = await fetch(`${baseURL}/invalid`);
        const data = await response.json();

        assert.strictEqual(response.status, 404);
        assert.strictEqual(data.error, 'Route not found');
    });

});
