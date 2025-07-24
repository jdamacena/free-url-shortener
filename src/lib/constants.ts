if (!process.env.DOMAIN) {
    throw new Error('DOMAIN environment variable is required');
}

export const DOMAIN = process.env.DOMAIN;
