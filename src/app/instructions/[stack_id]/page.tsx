import fakeApiInstructions from '@/components/fakeapi/instructions.json';
import ButtonComponent from '../buttonComponents';
//import { useSearchParams } from 'next/navigation';

export default function InstructionsPage({params}: {params: {stack_id: string}}) {
	//const searchParams = useSearchParams();
	//const frontendAddons = searchParams.get('frontend_addons');

	const instructions = fakeApiInstructions.instructions.find(
		(instruction) => instruction.instructions_id === parseInt(params.stack_id)
	);

	if (!instructions) {
		return (
			<div className='w-full h-full flex flex-col text-center content-center items-center'>Instructions not found</div>
		);
	}

	return (
		<div className='flex flex-col gap-5 p-5'>
			<div className='flex flex-row gap-5 justify-between content-center items-center flex-wrap'>
				<div className='text-lg font-bold'>Your stack results</div>
				<ButtonComponent />
			</div>
			<div className='flex flex-col gap-1'>
				<div className='font-bold'>Frontend framework:</div>
				<div>{instructions.techstack.frontend_framework.frontend_name}</div>
				<div className='font-bold'>Description:</div>
				<div>{instructions.techstack.frontend_framework.description}</div>
				<div className='font-bold'>Skill level:</div>
				<div>{instructions.techstack.frontend_framework.development_level}</div>
				<div className='flex flex-col gap-1'>
					{instructions.techstack.frontend_framework.development_description.length > 0
						? instructions.techstack.frontend_framework.development_description.map((d, i) => (
								<div key={i}>
									<div className='font-bold'>{d.topic}</div>
									<div>
										{d.text.map((t, i2) => (
											<div key={i2}>{t}</div>
										))}
									</div>
								</div>
						  ))
						: null}
				</div>
				<div>
					Installation:{' '}
					<a href={instructions.techstack.frontend_framework.install_url} className='text-blue-900 underline'>
						NextJS installation
					</a>
				</div>
				<div>
					Documentation:{' '}
					<a href={instructions.techstack.frontend_framework.doc_url} className='text-blue-900 underline'>
						NextJS docs
					</a>
				</div>
			</div>
			<div className='flex flex-col gap-1'>
				<div className='font-bold'>Frontend addons:</div>
				{instructions.techstack.frontend_addons.length > 0
					? instructions.techstack.frontend_addons.map((a, i) => (
							<div key={i}>
								<div></div>
								<div className='font-bold'>{a.addon_name}</div>
								<div className='flex flex-col gap-1'>
									<div>
										<a href={a.install_url} className='text-blue-900 underline'>
											{`Installation: ${a.addon_name}`}
										</a>
									</div>
									<div>
										<a href={a.doc_url} className='text-blue-900 underline'>
											{`Documentation: ${a.addon_name}`}
										</a>
									</div>
								</div>
							</div>
					  ))
					: 'No addons'}
			</div>
			<div className='flex flex-col gap-1'>
				{instructions.techstack.databases.length > 0
					? instructions.techstack.databases.map((db, i) => (
							<div key={i}>
								<div className='font-bold'>Database:</div>
								<div>{db.database_name}</div>
								<div className='font-bold'>Skill level:</div>
								<div>{db.development_level}</div>
								<div className='flex flex-col gap-1'>
									{db.development_description.length > 0
										? db.development_description.map((d, i2) => (
												<div key={i2}>
													<div className='font-bold'>{d.topic}</div>
													<div>
														{d.text.map((t, i3) => (
															<div key={i3}>{t}</div>
														))}
													</div>
												</div>
										  ))
										: null}
								</div>
								<div>
									<a href={db.install_url} className='text-blue-900 underline'>
										{`Installation: ${db.database_name}`}
									</a>
								</div>
								<div>
									<a href={db.doc_url} className='text-blue-900 underline'>
										{`Documentation: ${db.database_name}`}
									</a>
								</div>
							</div>
					  ))
					: 'No database'}
			</div>
		</div>
	);
}
