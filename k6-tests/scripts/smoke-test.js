import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    duration: '10s',
    thresholds: {
        http_req_duration: ['p(95)<300'],
        http_req_failed: ['rate<0.01'],
    },
};

const BASE_URL = 'http://localhost:3000/api';

export default function () {
    // Просто проверяем, что API отвечает
    let res = http.get(`${BASE_URL}/items`);
    
    check(res, {
        'API is responsive': (r) => r.status === 200,
    });
    
    sleep(1);
}