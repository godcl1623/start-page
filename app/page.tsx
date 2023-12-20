import RequestControllers from 'controllers/requestControllers';
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';

export default async function MainPage() {
    
    return <h1>main</h1>;
}