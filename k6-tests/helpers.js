export function randomName() {
    const adjectives = ['Gaming', 'Office', 'Ultra', 'Pro', 'Basic', 'Premium'];
    const nouns = ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Headset', 'Tablet'];

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adj} ${noun}`;
}

export function randomPrice() {
    return Number((Math.random() * 900 + 100).toFixed(2));
}

export function randomId() {
    return Math.floor(Math.random() * 10) + 1;
}

export function getRandomExistingId(items) {
    if (!items || items.length === 0) return 1;
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex].id;
}

export function checkResponse(response, expectedStatus, operation, checks) {
    const success = checks(response, {
        [`${operation} status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
        [`${operation} has body`]: (r) => r.body && r.body.length > 0,
    });
    
    if (!success) {
        console.error(`❌ ${operation} failed:`, {
            status: response.status,
            statusText: response.status_text,
            body: response.body ? response.body.substring(0, 200) : 'No body'
        });
    }
    
    return success;
}