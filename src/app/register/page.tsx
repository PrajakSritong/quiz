'use client';

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            const res = await axios.post('/api/auth/register', {
                email: email,
                password: password
            });
            console.log(res);
            router.push('/login');
        } catch (err) {
            setError("Failed to register. Please try again.");
        }
    };

    return (
        <div className="py-10 max-w-xl mx-auto">
            <form onSubmit={(e) => e.preventDefault()}>
                <h1 className="text-3xl text-center font-medium">
                    Register
                </h1>
                <label className="input input-bordered flex items-center gap-2 mb-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path
                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                    </svg>
                    <input onChange={(e) => setEmail(e.target.value)} type="text" className="grow" placeholder="Email" value={email} />
                </label>
                <label className="input input-bordered flex items-center gap-2 mb-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 1 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                            clipRule="evenodd" />
                    </svg>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" className="grow" placeholder="*******" value={password} />
                </label>
                <button onClick={handleSubmit} className="btn btn-primary" type="button">Register</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Link className='underline text-blue-600 self-center mt-1' href='/login'>
                    Already have an account? Click here to sign in
                </Link>
            </form>
        </div>
    );
}
