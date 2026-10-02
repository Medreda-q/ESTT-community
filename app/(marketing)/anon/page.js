'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';

export default function AnonPage() {
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        signInAnonymously(auth)
            .then(() => setStatus('signed-in'))
            .catch((e) => setStatus('error: ' + e.message));
    }, []);

    return <div id="anon-status">{status}</div>;
}
