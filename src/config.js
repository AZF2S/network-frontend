const requiredEnvVars = ['REACT_APP_DOMAIN', 'REACT_APP_DOMAIN_NO_HTTPS',
    'REACT_APP_EXPRESS_PATH', 'REACT_APP_NODEBB_PATH', 'REACT_APP_PROTOCOL'];

function validateEnvVars() {
    const missingVars = requiredEnvVars.filter(
        varName => !process.env[varName]
    );

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}. ` +
            'Please check your .env file or Docker environment configuration.'
        );
    }
}

validateEnvVars();
console.log(process.env.REACT_APP_DOMAIN);

const config = {
    PROTOCOL: process.env.REACT_APP_PROTOCOL,
    DOMAIN_NO_HTTPS: process.env.REACT_APP_DOMAIN_NO_HTTPS,
    DOMAIN: process.env.REACT_APP_DOMAIN,
    EXPRESS_PATH: process.env.REACT_APP_EXPRESS_PATH,
    NODEBB_PATH: process.env.REACT_APP_NODEBB_PATH
};

export default config;