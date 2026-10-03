const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const readline = require('readline/promises');

const ROOT_DIR = path.resolve(__dirname, '..');

function loadEnvFile() {
    const envPath = path.join(ROOT_DIR, '.env.local');
    const env = {};

    if (!fs.existsSync(envPath)) {
        return env;
    }

    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
        const match = line.match(/^\s*([^#=]+?)\s*=\s*(.*)\s*$/);
        if (!match) continue;

        env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }

    return env;
}

function isAnonymousUser(user) {
    return user.providerData.length === 0 && !user.email && !user.phoneNumber;
}

function initializeFirebase(env) {
    const privateKey = (env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
    const projectId = env.FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = env.FIREBASE_CLIENT_EMAIL;

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
            'Firebase Admin credentials are not configured. Set FIREBASE_PROJECT_ID, ' +
                'FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env.local.',
        );
    }

    return admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
        }),
    });
}

async function findAnonymousUsers() {
    const anonymousUsers = [];
    let pageToken;

    do {
        const page = await admin.auth().listUsers(1000, pageToken);
        anonymousUsers.push(...page.users.filter(isAnonymousUser));
        pageToken = page.pageToken;
    } while (pageToken);

    return anonymousUsers;
}

function formatDate(date) {
    return date || 'Unknown';
}

async function main() {
    const env = loadEnvFile();
    const app = initializeFirebase(env);
    const terminal = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    try {
        const users = await findAnonymousUsers();

        console.log(`Found ${users.length} anonymous Firebase Auth user(s).`);

        if (!users.length) {
            return;
        }

        let deletedCount = 0;
        let skippedCount = 0;

        for (const [index, user] of users.entries()) {
            const remainingCount = users.length - index;
            console.log(`\nAccount ${index + 1} of ${users.length} (${remainingCount} remaining)`);
            console.log('Anonymous account candidate');
            console.log(`- ID: ${user.uid}`);
            console.log('- Provider: anonymous (no linked provider)');
            console.log(`- Created: ${formatDate(user.metadata.creationTime)}`);
            console.log(`- Last signed in: ${formatDate(user.metadata.lastSignInTime)}`);

            const answer = await terminal.question(
                'Press Enter to delete, or type "s" to skip / "q" to quit: ',
            );
            const choice = answer.trim().toLowerCase();

            if (choice === 'q') {
                console.log('Stopped by user.');
                break;
            }

            if (choice !== '') {
                skippedCount += 1;
                console.log('Skipped.');
                continue;
            }

            await admin.auth().deleteUser(user.uid);
            deletedCount += 1;
            console.log(`Deleted. ${users.length - index - 1} account(s) remaining.`);
        }

        console.log(
            `\nDeleted: ${deletedCount}; skipped: ${skippedCount}; ` +
                `not processed: ${users.length - deletedCount - skippedCount}.`,
        );
    } finally {
        terminal.close();
        await app.delete();
    }
}

main().catch((error) => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
});
