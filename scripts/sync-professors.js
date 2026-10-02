const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_FILE = path.join(ROOT_DIR, 'docs', 'profs.md');
const DATABASE_PATH = 'metadata/professors';
const FALLBACK_EMAIL = 'no-email@uae.ac.ma';

function loadEnvFile() {
    const envPath = path.join(ROOT_DIR, '.env.local');
    const env = {};

    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (!match) continue;

        env[match[1].trim()] = match[2]
            .trim()
            .replace(/^['"]|['"]$/g, '');
    }

    return env;
}

function parseSourceProfessors() {
    const professors = [];

    for (const line of fs.readFileSync(SOURCE_FILE, 'utf8').split(/\r?\n/)) {
        const columns = line.split('\t').map((column) => column.trim());
        if (columns.length !== 3 || columns[0] === 'Nom' || !columns[2].includes('@')) {
            continue;
        }

        professors.push({
            name: columns[0],
            department: columns[1],
            email: columns[2],
        });
    }

    if (!professors.length) {
        throw new Error(`No professors were found in ${SOURCE_FILE}.`);
    }

    return professors;
}

function getDatabaseValue(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (value && typeof value === 'object') return Object.values(value);
    if (value == null) return [];
    throw new Error(`Expected ${DATABASE_PATH} to contain an array or object.`);
}

function getProfessorName(professor) {
    return professor && typeof professor === 'object' ? professor.name : null;
}

function buildMergedProfessors(currentValue, sourceProfessors) {
    const currentProfessors = getDatabaseValue(currentValue);
    const sourceByName = new Map(sourceProfessors.map((professor) => [professor.name, professor]));
    const seenNames = new Set();

    const merged = currentProfessors.map((professor) => {
        if (!professor || typeof professor !== 'object') {
            throw new Error('Every existing professor record must be an object.');
        }

        const sourceProfessor = sourceByName.get(professor.name);
        seenNames.add(professor.name);

        return {
            ...professor,
            ...(sourceProfessor
                ? {
                      department: sourceProfessor.department,
                      email: sourceProfessor.email,
                  }
                : {}),
            email: professor.email || sourceProfessor?.email || FALLBACK_EMAIL,
        };
    });

    for (const professor of sourceProfessors) {
        if (!seenNames.has(professor.name)) {
            merged.push(professor);
        }
    }

    if (merged.length < currentProfessors.length) {
        throw new Error('Refusing to write because the merge would remove a professor.');
    }

    return {
        currentProfessors,
        merged,
        added: merged.filter(
            (professor) => !currentProfessors.some((current) => current.name === professor.name),
        ),
    };
}

async function main() {
    const env = loadEnvFile();
    const privateKey = (env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
    const projectId = env.FIREBASE_PROJECT_ID || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const databaseURL = env.FIREBASE_DATABASE_URL || env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

    if (!projectId || !env.FIREBASE_CLIENT_EMAIL || !privateKey || !databaseURL) {
        throw new Error('Firebase Admin credentials or database URL are not configured.');
    }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey,
        }),
        databaseURL,
    });

    try {
        const sourceProfessors = parseSourceProfessors();
        const reference = admin.database().ref(DATABASE_PATH);
        const snapshot = await reference.once('value');
        const { currentProfessors, merged, added } = buildMergedProfessors(
            snapshot.val(),
            sourceProfessors,
        );

        await reference.transaction((currentValue) => {
            const transactionResult = buildMergedProfessors(currentValue, sourceProfessors);
            return transactionResult.merged;
        });

        const fallbackCount = merged.filter(
            (professor) => professor.email === FALLBACK_EMAIL,
        ).length;

        console.log(
            JSON.stringify(
                {
                    path: DATABASE_PATH,
                    sourceCount: sourceProfessors.length,
                    beforeCount: currentProfessors.length,
                    addedCount: added.length,
                    afterCount: merged.length,
                    fallbackEmail: FALLBACK_EMAIL,
                    fallbackEmailCount: fallbackCount,
                    added: added.map(({ name, department, email }) => ({
                        name,
                        department,
                        email,
                    })),
                },
                null,
                2,
            ),
        );
    } finally {
        await admin.app().delete();
    }
}

main().catch((error) => {
    console.error(error.stack || error.message || error);
    process.exitCode = 1;
});
