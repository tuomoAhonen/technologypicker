'use client';

import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';

export default function ButtonComponent() {
	const router = useRouter();
	return <Button onClick={() => router.push('/stackpicker')}>Back to stackpicker</Button>;
}
