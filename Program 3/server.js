
const http = require('http');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const filePath = path.join(__dirname, 'medicines.json');
const inventoryEvents = new EventEmitter();

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
}

inventoryEvents.on('medicineAdded', (medicine) => {
    console.log('New medicine added:', medicine.name);
});

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (req.url === '/' && req.method === 'GET') {
        return res.end(JSON.stringify({
            message: 'Pharmacy Inventory Server is Running'
        }));
    }

    if (req.url === '/medicines' && req.method === 'GET') {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                return res.end(JSON.stringify({
                    error: 'Unable to retrieve medicines'
                }));
            }

            res.end(data);
        });
        return;
    }

    if (req.url === '/medicines' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const medicine = JSON.parse(body);

                if (!medicine.name ||
                    medicine.quantity === undefined ||
                    medicine.price === undefined) {
                    res.statusCode = 400;
                    return res.end(JSON.stringify({
                        error: 'Name, quantity and price are required'
                    }));
                }

                if (!Number.isInteger(Number(medicine.quantity)) ||
                    Number(medicine.quantity) < 0 ||
                    !Number.isFinite(Number(medicine.price)) ||
                    Number(medicine.price) <= 0) {
                    res.statusCode = 400;
                    return res.end(JSON.stringify({
                        error: 'Enter valid quantity and price'
                    }));
                }

                const medicines = JSON.parse(
                    fs.readFileSync(filePath, 'utf8')
                );

                const newMedicine = {
                    id: Date.now(),
                    name: medicine.name,
                    quantity: Number(medicine.quantity),
                    price: Number(medicine.price)
                };

                medicines.push(newMedicine);

                fs.writeFile(filePath,
                    JSON.stringify(medicines, null, 2),
                    (err) => {
                        if (err) {
                            res.statusCode = 500;
                            return res.end(JSON.stringify({
                                error: 'Unable to save medicine'
                            }));
                        }

                        inventoryEvents.emit(
                            'medicineAdded',
                            newMedicine
                        );

                        res.statusCode = 201;
                        res.end(JSON.stringify({
                            message: 'Medicine added successfully',
                            medicine: newMedicine
                        }));
                    }
                );

            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({
                    error: 'Invalid JSON data'
                }));
            }
        });
        return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Route not found' }));
});

// Export server so it can be tested
module.exports = server;

if (require.main === module) {
    server.listen(3000, () => {
        console.log('Pharmacy Inventory Server running at http://localhost:3000');
    });
}

