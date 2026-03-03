import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = { 
    vus: 1,
    duration: '5s',
    thresholds: {
        http_req_duration: ['p(95)<200'],
        http_req_failed: ['rate<0.01'],
    },
};

const BASE_URL = 'http://localhost:3000/api';

export default function () {
    const endpoints = [
        { method: 'GET', url: '/items'},
        { method: 'GET', url: '/items/1'},
    ];

    endpoints.forEach(endpoint => {
        const res = http.get(`${BASE_URL}${endpoint.url}`);

        check(res, {
            [`${endpoint.method} ${endpoint.url} status 200`]: (r) => r.status === 200,
        });
    });

    sleep(1)
};