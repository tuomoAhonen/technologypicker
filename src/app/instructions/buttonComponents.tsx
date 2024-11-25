'use client';

import {Button} from '@/components/ui/button';
import {useRouter, useSearchParams} from 'next/navigation';

export default function ButtonComponent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	return (
		<Button
			onClick={() =>
				router.push(
					`/stackpicker?topic=${searchParams.get('topic')}&platform=${searchParams.get(
						'platform'
					)}&database_types=${searchParams
						.getAll('database_types')
						.join('&database_types=')}&picked_options=${searchParams.get('picked_options')}`
				)
			}
		>
			Back to stackpicker
		</Button>
	);
}
