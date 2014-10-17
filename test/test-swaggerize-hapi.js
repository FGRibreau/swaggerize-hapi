'use strict';

var Test = require('tape'),
    Path = require('path'),
    Swaggerize = require('../lib'),
    Hapi = require('hapi');

Test('test', function (t) {
    var server;

    t.test('server', function (t) {
        t.plan(1);

        server = new Hapi.Server();

        server.pack.register({
            plugin: Swaggerize,
            options: {
                api: require('./fixtures/defs/pets.json'),
                handlers: Path.join(__dirname, './fixtures/handlers'),
            }
        }, function (err) {
            t.error(err, 'No error.');
        });
    });

    t.test('api docs', function (t) {
        t.plan(1);

        server.inject({
            method: 'GET',
            url: '/v1/petstore/api-docs'
        }, function (response) {
            t.strictEqual(response.statusCode, 200, 'OK status.');
        });
    });

    t.test('apis', function (t) {
        t.plan(5);

        server.inject({
            method: 'GET',
            url: '/v1/petstore/pets'
        }, function (response) {
            t.strictEqual(response.statusCode, 200, 'OK status.');
        });

        server.inject({
            method: 'POST',
            url: '/v1/petstore/pets',
        }, function (response) {
            t.strictEqual(response.statusCode, 400, '400 status (required param missing).');
        });

        server.inject({
            method: 'POST',
            url: '/v1/petstore/pets',
            payload: JSON.stringify({
                id: 0,
                name: 'Cat'
            })
        }, function (response) {
            t.strictEqual(response.statusCode, 200, 'OK status.');
        });

        server.inject({
            method: 'GET',
            url: '/v1/petstore/pets/0'
        }, function (response) {
            t.strictEqual(response.statusCode, 200, 'OK status.');
        });

        server.inject({
            method: 'DELETE',
            url: '/v1/petstore/pets/0'
        }, function (response) {
            t.strictEqual(response.statusCode, 200, 'OK status.');
        });

    });

});