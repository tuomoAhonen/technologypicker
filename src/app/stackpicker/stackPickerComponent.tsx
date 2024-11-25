'use client';

import {SquareXIcon} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {Check, ChevronsUpDown} from 'lucide-react';
//import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';

import fakeApi from '@/components/fakeapi/options_for_stackpicker_v2.json';
import fakeApiBackendAddons from '@/components/fakeApi/backend_addons.json';
import {useToast} from '@/hooks/use-toast';
import ButtonComponent from './buttonComponent';

const pickedOptionsInitializer: {
	frontend_language: null | object;
	frontend_framework: null | object;
	frontend_addons: any[];
	databases: any[];
	backend_language: null | object;
	backend_framework: null | object;
	backend_addons: any[];
} = {
	frontend_language: null,
	frontend_framework: null,
	frontend_addons: [],
	databases: [],
	backend_language: null,
	backend_framework: null,
	backend_addons: [],
};

export default function StackPickerComponent() {
	//const [showAllPicks, setShowAllPicks] = useState<boolean>(false);
	const [forceBackend, setForceBackend] = useState<boolean>(false);
	const [filters, setFilters] = useState<any>({
		topic: null,
		platform: null,
		//programming_language: null,
		database_types: [],
	});
	const [pickedOptions, setPickedOptions] = useState<any>({
		frontend_language: null,
		frontend_framework: null,
		frontend_addons: [],
		databases: [],
		backend_language: null,
		backend_framework: null,
		backend_addons: [],
	});
	const [previousFrontendFramework, setPreviousFrontendFramework] = useState<any>(null);
	const searchParams = useSearchParams();
	const router = useRouter();
	const {toast} = useToast();

	useEffect(() => {
		if (!pickedOptions.frontend_language) {
			return setPickedOptions({
				frontend_language: null,
				frontend_framework: null,
				frontend_addons: [],
				databases: [],
				backend_language: null,
				backend_framework: null,
				backend_addons: [],
			});
		}
	}, [pickedOptions.frontend_language]);

	useEffect(() => {
		//console.log(previousFrontendFramework.framework_name, pickedOptions.frontend_framework.framework_name);
		if (!pickedOptions.frontend_framework) {
			return setPickedOptions((prev: any) => ({
				frontend_language: prev.frontend_language,
				frontend_framework: null,
				frontend_addons: [],
				databases: [],
				backend_language: null,
				backend_framework: null,
				backend_addons: [],
			}));
		} else if (
			pickedOptions.frontend_framework &&
			previousFrontendFramework &&
			(previousFrontendFramework.framework_name !== 'NextJS' ||
				previousFrontendFramework.framework_name !== 'NuxtJS') &&
			(pickedOptions.frontend_framework.framework_name === 'NextJS' ||
				pickedOptions.frontend_framework.framework_name === 'NuxtJS')
		) {
			return setPickedOptions((prev: any) => ({
				frontend_language: prev.frontend_language,
				frontend_framework: prev.frontend_framework,
				frontend_addons: [],
				databases: prev.databases,
				backend_language: null,
				backend_framework: null,
				backend_addons: [],
			}));
		} else if (
			pickedOptions.frontend_framework &&
			previousFrontendFramework &&
			(previousFrontendFramework.framework_name === 'NextJS' ||
				previousFrontendFramework.framework_name === 'NuxtJS') &&
			(pickedOptions.frontend_framework.framework_name !== 'NextJS' ||
				pickedOptions.frontend_framework.framework_name !== 'NuxtJS')
		) {
			return setPickedOptions((prev: any) => ({
				frontend_language: prev.frontend_language,
				frontend_framework: prev.frontend_framework,
				frontend_addons: [],
				databases: prev.databases,
				backend_language: null,
				backend_framework: null,
				backend_addons: [],
			}));
		}
	}, [pickedOptions.frontend_framework]);

	useEffect(() => {
		if (pickedOptions.databases.length === 0) {
			return setPickedOptions((prev: any) => ({
				frontend_language: prev.frontend_language,
				frontend_framework: prev.frontend_framework,
				frontend_addons: prev.frontend_addons,
				databases: prev.databases,
				backend_language: null,
				backend_framework: null,
				backend_addons: [],
			}));
		}
	}, [pickedOptions.databases]);

	useEffect(() => {
		if (!pickedOptions.backend_language) {
			return setPickedOptions((prev: any) => ({
				frontend_language: prev.frontend_language,
				frontend_framework: prev.frontend_framework,
				frontend_addons: prev.frontend_addons,
				databases: prev.databases,
				backend_language: null,
				backend_framework: null,
				backend_addons: [],
			}));
		}
	}, [pickedOptions.backend_language]);

	useEffect(() => {
		if (!pickedOptions.backend_framework) {
			return setPickedOptions((prev: any) => ({
				frontend_language: prev.frontend_language,
				frontend_framework: prev.frontend_framework,
				frontend_addons: prev.frontend_addons,
				databases: prev.databases,
				backend_language: prev.backend_language,
				backend_framework: null,
				backend_addons: [],
			}));
		}
	}, [pickedOptions.backend_framework]);

	useEffect(() => {
		const topic = searchParams.get('topic');
		const platform = searchParams.get('platform');
		//const programming_language = searchParams.get('programming_language');
		const database_types = searchParams.getAll('database_types');
		const picked_options = searchParams.get('picked_options');
		//console.log(topic, platform, programming_language, database_types);

		setFilters({
			topic: topic !== '-' ? topic : null,
			platform: platform !== '-' ? platform : null,
			//programming_language: programming_language !== '-' ? programming_language : null,
			database_types: database_types.length > 0 && database_types[0] !== '-' ? database_types : [],
		});

		if (picked_options !== null /* && picked_options !== JSON.stringify(pickedOptionsInitializer)*/) {
			//console.log(JSON.parse(picked_options));
			setPickedOptions(JSON.parse(picked_options));
		}

		if (!searchParams.get('refreshed_at')) {
			toast({
				title: 'Usage tip number 1.',
				description:
					'Hello, it is your favorite wizard here. You can unfilter your answers to questions by clicking the answer you gave at the top of the screen. Also, you can reset your picks by reset-button, which will keep your answer-filters. Everytime, you go backwards on picker or remove something, it will also autoclean picks from beyond that point.',
				variant: 'default',
				duration: 10000,
			});
		}
	}, [searchParams]);

	const stackAnswers = () => {
		return (
			<div className='flex flex-row justify-start items-center gap-1 bg-black rounded shadow text-white p-1 h-fit w-full'>
				<div className='w-fit flex flex-row gap-1 justify-start items-center flex-wrap'>
					<div>Answers as filters:</div>
					{filters.topic ? (
						<div
							onClick={() => setFilters((prev: any) => ({...prev, topic: null}))}
							className='flex flex-row gap-1 border rounded w-fit p-1'
						>
							<div>{`1. Topic: ${filters.topic}`}</div>
							<SquareXIcon />
						</div>
					) : (
						<div className='flex flex-row gap-1 border rounded w-fit p-1'>{`1. Topic - `}</div>
					)}
					{filters.platform ? (
						<div
							onClick={() => setFilters((prev: any) => ({...prev, platform: null}))}
							className='flex flex-row gap-1 border rounded w-fit p-1'
						>
							<div>{`2. Target platform: ${filters.platform}`}</div>
							<SquareXIcon />
						</div>
					) : (
						<div className='flex flex-row gap-1 border rounded w-fit p-1'>{`2. Target platform - `}</div>
					)}
					{/*filters.programming_language ? (
					<div
						onClick={() => setFilters((prev: any) => ({...prev, programming_language: null}))}
						className='flex flex-row gap-1 border rounded w-fit p-1'
					>
						<div>{`3. Frontend language: ${filters.programming_language}`}</div>
						<SquareXIcon />
					</div>
				) : (
					<div className='flex flex-row gap-1 border rounded w-fit p-1'>{`3. Frontend language - `}</div>
				)*/}
					{filters.database_types.length > 0 ? (
						<div className='flex flex-row gap-1 border rounded w-fit p-1 text-center'>
							<div className='text-center content-center'>{`3. Database type options:`}</div>
							{filters.database_types.map((dbtype_name: string, index: number) => (
								<div
									key={`${index}-${dbtype_name}`}
									onClick={() =>
										setFilters((prev: any) => ({
											...prev,
											database_types: prev.database_types.filter((dbt_name: string) => dbt_name !== dbtype_name),
										}))
									}
									className='flex flex-row gap-1 border rounded w-fit p-1'
								>
									<div>{dbtype_name}</div>
									<SquareXIcon />
								</div>
							))}
						</div>
					) : (
						<div className='flex flex-row gap-1 border rounded w-fit p-1'>{`3. Database type options: - `}</div>
					)}
				</div>
				<div className='w-fit justify-self-end ml-auto'>
					<Button
						onClick={() => {
							return router.push(
								`/stackpicker?topic=${searchParams.get('topic')}&platform=${searchParams.get(
									'platform'
								)}&database_types=${searchParams
									.getAll('database_types')
									.join('&database_types=')}&refreshed_at=${new Date().toLocaleString()}`
							);
						}}
					>
						Reset filters
					</Button>
				</div>
			</div>
		);
		//return answers.map((a: any) => a).join(', ');
	};

	//console.log(pickedOptions);

	return (
		<div className='w-full flex flex-col gap-1'>
			<div className='flex flex-row gap-5 justify-self-end w-fit h-fit ml-auto'>
				<ButtonComponent />
				<Button
					onClick={() => {
						//console.log('hello');
						setPickedOptions(pickedOptionsInitializer);
						router.push(
							`/stackpicker?topic=${searchParams.get('topic')}&platform=${searchParams.get(
								'platform'
							)}&database_types=${searchParams
								.getAll('database_types')
								.join('&database_types=')}&refreshed_at=${new Date().toLocaleString()}`
						);
						return toast({
							title: 'Reset',
							description: 'Reset just happened, wow.',
							variant: 'default',
							duration: 5000,
						});
					}}
				>
					Reset picks
				</Button>
				<Button
					onClick={() =>
						router.push(
							`/instructions?frontend_framework=${
								pickedOptions.frontend_framework ? pickedOptions.frontend_framework.framework_id : '-'
							}&frontend_addons=${
								pickedOptions.frontend_addons.length
									? pickedOptions.frontend_addons.map((a: any) => a.addon_id).join(',')
									: '-'
							}&databases=${
								pickedOptions.databases.length > 0
									? pickedOptions.databases.map((db: any) => db.database_id).join(',')
									: '-'
							}&backend_framework=${
								pickedOptions.backend_framework ? pickedOptions.backend_framework.backend_id : '-'
							}&backend_addons=${
								pickedOptions.backend_addons.length > 0
									? pickedOptions.backend_addons.map((a: any) => a.addon_id).join(',')
									: '-'
							}&topic=${searchParams.get('topic')}&platform=${searchParams.get(
								'platform'
							)}&database_types=${searchParams
								.getAll('database_types')
								.join('&database_types=')}&picked_options=${JSON.stringify(pickedOptions)}`
						)
					}
				>
					Check your results
				</Button>
			</div>
			{stackAnswers()}
			<div className='w-full flex flex-row gap-1 justify-start items-center flex-wrap bg-black rounded shadow text-center text-white font-normal p-1 h-fit'>
				<div>Picked stack options:</div>
				{pickedOptions.frontend_language && pickedOptions.frontend_language.programming_language_name ? (
					<div
						onClick={() => setPickedOptions((prev: any) => ({...prev, frontend_language: null}))}
						className='flex flex-row gap-1 border rounded w-fit p-1'
					>
						<div>{`Frontend programming language: ${pickedOptions.frontend_language.programming_language_name}`}</div>
						<SquareXIcon />
					</div>
				) : null}
				{pickedOptions.frontend_framework && pickedOptions.frontend_framework.framework_name ? (
					<div
						onClick={() => setPickedOptions((prev: any) => ({...prev, frontend_framework: null}))}
						className='flex flex-row gap-1 border rounded w-fit p-1'
					>
						<div>{`Frontend framework: ${pickedOptions.frontend_framework.framework_name}`}</div>
						<SquareXIcon />
					</div>
				) : null}
				{pickedOptions.frontend_addons.length > 0 ? (
					<div className='flex flex-row gap-1 justify-start items-center content-center text-center border rounded w-fit p-1'>
						<div>{`Frontend addons:`}</div>
						{pickedOptions.frontend_addons.map((a: any) => (
							<div
								key={`${a.addon_id}-${a.addon_name}`}
								onClick={() =>
									setPickedOptions((prev: any) => ({
										...prev,
										frontend_addons: prev.frontend_addons.filter((a2: any) => a2.addon_id !== a.addon_id),
									}))
								}
								className='flex flex-row gap-1 border rounded w-fit p-1'
							>
								<div>{a.addon_name}</div>
								<SquareXIcon />
							</div>
						))}
					</div>
				) : null}
				{pickedOptions.databases.length > 0 ? (
					<div className='flex flex-row gap-1 justify-start items-center content-center text-center border rounded w-fit p-1'>
						<div>{`Databases:`}</div>
						{pickedOptions.databases.map((db: any) => (
							<div
								key={`${db.database_id}-${db.database_name}-dbs`}
								onClick={() =>
									setPickedOptions((prev: any) => ({
										...prev,
										databases: prev.databases.filter((db2: any) => db2.database_id !== db.database_id),
									}))
								}
								className='flex flex-row gap-1 border rounded w-fit p-1'
							>
								<div>{db.database_name}</div>
								<SquareXIcon />
							</div>
						))}
					</div>
				) : null}
				{pickedOptions.backend_language && pickedOptions.backend_language.programming_language_name ? (
					<div
						onClick={() => setPickedOptions((prev: any) => ({...prev, backend_language: null}))}
						className='flex flex-row gap-1 border rounded w-fit p-1'
					>
						<div>{`Backend programming language: ${pickedOptions.backend_language.programming_language_name}`}</div>
						<SquareXIcon />
					</div>
				) : null}
				{pickedOptions.backend_framework && pickedOptions.backend_framework.backend_name ? (
					<div
						onClick={() => setPickedOptions((prev: any) => ({...prev, backend_framework: null}))}
						className='flex flex-row gap-1 border rounded w-fit p-1'
					>
						<div>{`Backend framework: ${pickedOptions.backend_framework.backend_name}`}</div>
						<SquareXIcon />
					</div>
				) : null}
				{pickedOptions.backend_addons.length > 0 ? (
					<div className='flex flex-row gap-1 justify-start items-center content-center text-center border rounded w-fit p-1'>
						<div>{`Backend addons:`}</div>
						{pickedOptions.backend_addons.map((a: any) => (
							<div
								key={`${a.addon_id}-${a.addon_name}-db-backend-addon`}
								onClick={() =>
									setPickedOptions((prev: any) => ({
										...prev,
										backend_addons: prev.backend_addons.filter((a2: any) => a2.addon_id !== a.addon_id),
									}))
								}
								className='flex flex-row gap-1 border rounded w-fit p-1'
							>
								<div>{a.addon_name}</div>
								<SquareXIcon />
							</div>
						))}
					</div>
				) : null}
			</div>
			<div className='flex flex-col gap-5 flex-wrap bg-black rounded shadow text-white p-1 w-full'>
				<PickFrontendLanguage setPickedOptions={setPickedOptions} />
				<div
					className={
						pickedOptions.frontend_language && pickedOptions.frontend_language.programming_language_name
							? 'flex flex-col gap-1'
							: 'flex flex-col gap-1 pointer-events-none opacity-25'
					}
				>
					<PickFrontendFramework
						setPickedOptions={setPickedOptions}
						programming_language={
							pickedOptions.frontend_language && pickedOptions.frontend_language.programming_language
								? pickedOptions.frontend_language.programming_language
								: null
						}
						platform={filters.platform}
						topic={filters.topic}
						setPreviousFrontendFramework={setPreviousFrontendFramework}
					/>
				</div>
				<div
					className={
						pickedOptions.frontend_framework && pickedOptions.frontend_framework?.framework_name
							? 'flex flex-col gap-1'
							: 'flex flex-col gap-1 pointer-events-none opacity-25'
					}
				>
					<PickFrontendAddons
						pickedFrontendFramework={pickedOptions.frontend_framework}
						setPickedOptions={setPickedOptions}
						currentAddons={pickedOptions.frontend_addons}
					/>
				</div>
				<div
					className={
						pickedOptions.frontend_framework &&
						pickedOptions.frontend_framework?.framework_name &&
						!filters.database_types?.find((dbt: any) => dbt.database_type_name === 'No database')
							? 'flex flex-col gap-1'
							: 'flex flex-col gap-1 pointer-events-none opacity-25'
					}
				>
					<PickDatabases
						setPickedOptions={setPickedOptions}
						database_types={filters.database_types}
						currentDatabases={pickedOptions.databases}
					/>
				</div>
				<div
					className={
						pickedOptions.frontend_framework &&
						pickedOptions.frontend_framework?.framework_name &&
						!filters.database_types?.find((dbt: any) => dbt.database_type_name === 'No database')
							? 'flex flex-col gap-1'
							: 'flex flex-col gap-1 pointer-events-none opacity-25'
					}
				>
					<div>5th. Pick programming language for backend</div>
					<div
						className={
							pickedOptions.frontend_framework &&
							pickedOptions.frontend_framework?.framework_name &&
							pickedOptions.frontend_framework?.framework_name !== 'NextJS' &&
							pickedOptions.frontend_framework?.framework_name !== 'NuxtJS' &&
							!filters.database_types?.find((dbt: any) => dbt.database_type_name === 'No database') &&
							pickedOptions.databases.length > 0 &&
							pickedOptions.databases.find(
								(db: any) =>
									(db.database_type === 'SQL' && db.database_name) !== 'SQLite' || db.database_type === 'NoSQL'
							)
								? 'flex flex-col gap-1'
								: forceBackend
								? 'flex flex-col gap-1'
								: 'flex flex-col gap-1 pointer-events-none opacity-25'
						}
					>
						<PickBackendLanguage setPickedOptions={setPickedOptions} />
					</div>
					<Button
						onClick={() => {
							setForceBackend(!forceBackend ? true : false);
							setPickedOptions((prev: any) => ({
								...prev,
								backend_language: null,
								backend_framework: null,
								backend_addons: [],
							}));
						}}
						className={
							pickedOptions.frontend_framework &&
							(pickedOptions.frontend_framework?.framework_name === 'NextJS' ||
								pickedOptions.frontend_framework?.framework_name === 'NuxtJS')
								? 'w-fit'
								: 'pointer-events-none opacity-25 w-fit'
						}
					>
						{!forceBackend ? 'Force enable backend' : 'Disable backend force'}
					</Button>
				</div>
				<div
					className={
						pickedOptions.frontend_framework &&
						pickedOptions.frontend_framework?.framework_name &&
						pickedOptions.backend_language &&
						pickedOptions.backend_language.programming_language_name
							? 'flex flex-col gap-1'
							: 'flex flex-col gap-1 pointer-events-none opacity-25'
					}
				>
					<PickBackendFramework
						setPickedOptions={setPickedOptions}
						selectedBackendLanguage={
							pickedOptions.backend_language && pickedOptions.backend_language.programming_language_name
								? pickedOptions.backend_language.programming_language_name
								: null
						}
					/>
				</div>
				<div
					className={
						pickedOptions.frontend_framework &&
						pickedOptions.frontend_framework?.framework_name &&
						!filters.database_types?.find((dbt: any) => dbt.database_type_name === 'No database') &&
						pickedOptions.backend_framework &&
						pickedOptions.backend_framework.backend_name
							? 'flex flex-col gap-1'
							: 'flex flex-col gap-1 pointer-events-none opacity-25'
					}
				>
					<PickBackendAddons
						selectedDatabase={pickedOptions.databases}
						selectedBackend={
							pickedOptions.backend_framework && pickedOptions.backend_framework.backend_name
								? pickedOptions.backend_framework.backend_name
								: null
						}
						setPickedOptions={setPickedOptions}
						currentAddons={pickedOptions.backend_addons}
					/>
				</div>
			</div>
		</div>
	);
}

function PickFrontendLanguage({setPickedOptions}: {setPickedOptions: any}) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	const [languages, setLanguages] = useState<
		{
			programming_language_id: number;
			programming_language_name: string;
		}[]
	>([]);

	useEffect(() => {
		return setLanguages(fakeApi.programming_languages_frontend);
	}, [fakeApi.programming_languages_frontend]);

	//console.log(languages);

	return (
		<div className='flex flex-col gap-1'>
			<div>1st. Pick programming language for frontend framework</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between text-black'>
						{value
							? languages.find((l) => String(l.programming_language_id) === value)?.programming_language_name
							: 'Select programming language'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
					<Command>
						<CommandInput placeholder='Search programming language...' />
						<CommandList>
							<CommandEmpty>No languages found.</CommandEmpty>
							<CommandGroup>
								{languages.map((l) => (
									<CommandItem
										key={l.programming_language_id}
										value={String(l.programming_language_id)}
										onSelect={(currentValue) => {
											//setValue(currentValue === value ? '' : currentValue);
											setPickedOptions((prev: any) => ({
												...prev,
												frontend_language: {
													programming_language_id: l.programming_language_id,
													programming_language_name: l.programming_language_name,
												},
											}));
											setOpen(false);
										}}
									>
										{/*<Check
											className={cn(
												'mr-2 h-4 w-4',
												value === String(framework.frontend_id) ? 'opacity-100' : 'opacity-0'
											)}
										/>*/}
										{l.programming_language_name}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}

function PickFrontendFramework({
	programming_language,
	platform,
	topic,
	setPickedOptions,
	setPreviousFrontendFramework,
}: {
	programming_language: string | null;
	platform: string | null;
	topic: string | null;
	setPickedOptions: any;
	setPreviousFrontendFramework: any;
}) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	const [frameworks, setFrameworks] = useState<
		{
			frontend_id: number;
			frontend_name: string;
			programming_languages: string[];
			platforms: string[];
		}[]
	>([]);
	const {toast} = useToast();

	useEffect(() => {
		let filteredList: {
			frontend_id: number;
			frontend_name: string;
			programming_languages: string[];
			platforms: string[];
		}[] = fakeApi.frontends;

		if (topic) {
			if (topic === 'Personal portfolio') {
				filteredList = filteredList.filter(
					(f) =>
						f.frontend_name === 'NextJS' ||
						f.frontend_name === 'React' ||
						f.frontend_name === 'SvelteKit' ||
						f.frontend_name === 'NuxtJS' ||
						f.frontend_name === 'VueJS' ||
						f.frontend_name === 'ViteJS'
				);
			} else if (topic === `Company's website`) {
				filteredList = filteredList.filter(
					(f) =>
						f.frontend_name === 'NextJS' ||
						f.frontend_name === 'SvelteKit' ||
						f.frontend_name === 'NuxtJS' ||
						f.frontend_name === 'VueJS' ||
						f.frontend_name === 'ViteJS'
				);
			} else if (topic === 'E-commerce') {
				filteredList = filteredList.filter(
					(f) =>
						f.frontend_name === 'NextJS' ||
						f.frontend_name === 'React' ||
						f.frontend_name === 'React Native' ||
						f.frontend_name === 'Expo'
				);
			} else if (topic === 'Wolt-app') {
				filteredList = filteredList.filter(
					(f) =>
						f.frontend_name === 'NextJS' ||
						f.frontend_name === 'React' ||
						f.frontend_name === 'React Native' ||
						f.frontend_name === 'Expo' ||
						f.frontend_name === 'Flutter'
				);
			} else if (topic === 'Design') {
				filteredList = filteredList.filter(
					(f) =>
						f.frontend_name === 'NextJS' ||
						f.frontend_name === 'SvelteKit' ||
						f.frontend_name === 'Svelte' ||
						f.frontend_name === 'React' ||
						f.frontend_name === 'NuxtJS' ||
						f.frontend_name === 'Flutter' ||
						f.frontend_name === 'ViteJS'
				);
			} else if (topic === 'Web game') {
				filteredList = filteredList.filter(
					(f) =>
						f.frontend_name === 'Svelte' ||
						f.frontend_name === 'React' ||
						f.frontend_name === 'VueJS' ||
						f.frontend_name === 'ViteJS'
				);
			} else if (topic === 'Non-web game') {
				// no frameworks for this currently
			}
		}

		if (platform) {
			filteredList = filteredList.filter((f) =>
				f.platforms.find((p) => p.toLocaleLowerCase() === platform.toLocaleLowerCase())
			);
		}

		if (programming_language) {
			filteredList = filteredList.filter((f) =>
				f.programming_languages.find((pl) => pl.toLocaleLowerCase() === programming_language.toLocaleLowerCase())
			);
		}

		return setFrameworks(filteredList);
		/*if (programming_language && platform) {
			const filteredList = fakeApi.frontends.filter((f) =>
				f.platforms.find((p) => p.toLocaleLowerCase() === platform.toLocaleLowerCase())
			);

			return setFrameworks(
				filteredList.filter((f) =>
					f.programming_languages.find((pl) => pl.toLocaleLowerCase() === programming_language.toLocaleLowerCase())
				)
			);
		} else if (programming_language) {
			return setFrameworks(
				fakeApi.frontends.filter((f) =>
					f.programming_languages.find((pl) => pl.toLocaleLowerCase() === programming_language.toLocaleLowerCase())
				)
			);
		} else if (platform) {
			return setFrameworks(
				fakeApi.frontends.filter((f) => f.platforms.find((p) => p.toLocaleLowerCase() === platform.toLocaleLowerCase()))
			);
		}*/

		//return setFrameworks(fakeApi.frontends);
	}, [fakeApi.frontends, programming_language, platform, topic]);

	//console.log(programming_language, platform, frameworks.length);

	return (
		<div className='flex flex-col gap-1'>
			<div>2nd. Pick frontend framework</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between text-black'>
						{value
							? frameworks.find((framework) => String(framework.frontend_id) === value)?.frontend_name
							: 'Select framework'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
					<Command>
						<CommandInput placeholder='Search framework...' />
						<CommandList>
							<CommandEmpty>No frameworks found.</CommandEmpty>
							<CommandGroup>
								{frameworks.map((framework) => (
									<CommandItem
										key={framework.frontend_id}
										value={String(framework.frontend_id)}
										onSelect={(currentValue) => {
											//setValue(currentValue === value ? '' : currentValue);
											setPickedOptions((prev: any) => {
												setPreviousFrontendFramework(prev.frontend_framework);
												return {
													...prev,
													frontend_framework: {
														framework_id: framework.frontend_id,
														framework_name: framework.frontend_name,
													},
												};
											});

											if (framework.frontend_name === 'NextJS' || framework.frontend_name === 'NextJS') {
												toast({
													title: `${framework.frontend_name} and database tip`,
													description: `You may pick addons for your frontend framework and you may pick fitting database for your project. By default, you will not need extra backend with ${framework.frontend_name}, but you can enable it with the force-button within backend section. If you change frontend framework away from NextJS or Nuxt and pick something instead of those two, it will cause reset to addons and other options.`,
													variant: 'default',
													duration: 10000,
												});
											} else {
												toast({
													title: 'Frontend framework and database tip',
													description: `You may pick addons for your frontend framework and you may pick fitting database for your project. If you change frontend framework to NextJS or Nuxt and pick something for those, it will cause reset to addons and other options.`,
													variant: 'default',
													duration: 10000,
												});
											}

											return setOpen(false);
										}}
									>
										{/*<Check
											className={cn(
												'mr-2 h-4 w-4',
												value === String(framework.frontend_id) ? 'opacity-100' : 'opacity-0'
											)}
										/>*/}
										{framework.frontend_name}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}

function PickFrontendAddons({
	pickedFrontendFramework,
	setPickedOptions,
	currentAddons,
}: {
	pickedFrontendFramework: null | {
		framework_id: number;
		framework_name: string;
	};
	setPickedOptions: any;
	currentAddons: any[];
}) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	const [addons, setAddons] = useState<
		{
			addon_id: number;
			addon_name: string;
			used_with: string[];
			development_focus: string;
		}[]
	>([]);
	const {toast} = useToast();

	useEffect(() => {
		const frontendAddons =
			fakeApi.addons.length > 0
				? fakeApi.addons.filter((a) => a.development_focus === 'Frontend' || a.development_focus === 'Fullstack')
				: [];

		//console.log(frontendAddons, pickedFrontendFramework);

		if (pickedFrontendFramework?.framework_name) {
			return setAddons(
				frontendAddons.filter((a) =>
					a.used_with.find(
						(value: string) => value.toLocaleLowerCase() === pickedFrontendFramework.framework_name.toLocaleLowerCase()
					)
				)
			);
		}

		return setAddons(frontendAddons);
	}, [fakeApi.addons, pickedFrontendFramework]);

	return (
		<div className='flex flex-col gap-1'>
			<div>3rd. Pick frontend addons</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between text-black'>
						{value ? addons.find((a) => String(a.addon_id) === value)?.addon_name : 'Select addon'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
					<Command>
						<CommandInput placeholder='Search addon...' />
						<CommandList>
							<CommandEmpty>No addons found.</CommandEmpty>
							<CommandGroup>
								{addons.map((a) => (
									<CommandItem
										key={a.addon_id}
										value={String(a.addon_id)}
										onSelect={(currentValue) => {
											//setValue(currentValue === value ? '' : currentValue);
											if (!currentAddons.find((a2) => a2.addon_id === a.addon_id)) {
												setPickedOptions((prev: any) => ({
													...prev,
													frontend_addons: [
														...prev.frontend_addons,
														{
															addon_id: a.addon_id,
															addon_name: a.addon_name,
															used_with: a.used_with,
															development_focus: a.development_focus,
														},
													],
												}));
												toast({
													title: 'Database tip',
													description:
														'If you change framework to other, it will not remove the database. Only removing the framework from picks will reset picks beyond that point.',
												});
												return setOpen(false);
											}

											return toast({
												title: 'Error',
												description: `Addon ${a.addon_name} already on your picks`,
												variant: 'destructive',
												duration: 5000,
											});
										}}
									>
										{/*<Check className={cn('mr-2 h-4 w-4', value === String(a.addon_id) ? 'opacity-100' : 'opacity-0')} />*/}
										{a.addon_name}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}

function PickDatabases({
	setPickedOptions,
	database_types,
	currentDatabases,
}: {
	setPickedOptions: any;
	database_types: any[];
	currentDatabases: any[];
}) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	const [databases, setDatabases] = useState<
		{
			database_id: number;
			database_name: string;
			database_type: string;
		}[]
	>([]);
	const {toast} = useToast();

	//console.log(database_types)

	useEffect(() => {
		//console.log(database_types);
		if (database_types.length > 0) {
			const filteredDatabases: any[] = [];
			//console.log('dbt', database_types);
			if (database_types.find((dbt: string) => dbt === 'Database as service')) {
				//console.log('hallo');
				filteredDatabases.push(...fakeApi.databases.filter((db) => db.database_type === 'Service'));
			}

			if (
				database_types.find((dbt: string) => dbt === 'Database as hosted on cloud' || dbt === 'Database as self hosted')
			) {
				filteredDatabases.push(
					...fakeApi.databases.filter(
						(db) => (db.database_type === 'SQL' && db.database_name !== 'SQLite') || db.database_type === 'NoSQL'
					)
				);
			}

			if (database_types.find((dbt: string) => dbt === 'Database inside the app')) {
				filteredDatabases.push(fakeApi.databases.find((db) => db.database_name === 'SQLite'));
			}
			//console.log('filteredDBS', filteredDatabases);

			return setDatabases(filteredDatabases);
		}

		return setDatabases(fakeApi.databases);
	}, [fakeApi.databases, database_types]);

	//console.log(databases);

	return (
		<div className='flex flex-col gap-1'>
			<div>4th. Pick databases, that will fit your project</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between text-black'>
						{value ? databases.find((db) => String(db.database_id) === value)?.database_name : 'Select database'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
					<Command>
						<CommandInput placeholder='Search database...' />
						<CommandList>
							<CommandEmpty>No databases found.</CommandEmpty>
							<CommandGroup>
								{databases.map((db) => (
									<CommandItem
										key={`${db.database_id}-${db.database_name}-${db.database_type}`}
										value={String(db.database_id)}
										onSelect={(currentValue) => {
											if (!currentDatabases.find((db2: any) => db2.database_id === db.database_id)) {
												//setValue(currentValue === value ? '' : currentValue);
												setPickedOptions((prev: any) => {
													return {
														...prev,
														databases: [
															...prev.databases,
															{
																database_id: db.database_id,
																database_name: db.database_name,
																database_type: db.database_type,
															},
														],
													};
												});
												return setOpen(false);
											}
											return toast({
												title: 'Error',
												description: `Database ${db.database_name} is already on your list`,
												variant: 'destructive',
												duration: 5000,
											});
										}}
									>
										{/*<Check className={cn('mr-2 h-4 w-4', value === String(a.addon_id) ? 'opacity-100' : 'opacity-0')} />*/}
										{db.database_name}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}

function PickBackendLanguage({setPickedOptions}: {setPickedOptions: any}) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	const [languages, setLanguages] = useState<
		{
			programming_language_id: number;
			programming_language_name: string;
		}[]
	>([]);

	useEffect(() => {
		return setLanguages(fakeApi.programming_languages_backend);
	}, [fakeApi.programming_languages_backend]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between text-black'>
					{value
						? languages.find((l) => String(l.programming_language_id) === value)?.programming_language_name
						: 'Select programming language'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
				<Command>
					<CommandInput placeholder='Search programming language...' />
					<CommandList>
						<CommandEmpty>No programming languages found.</CommandEmpty>
						<CommandGroup>
							{languages.map((l) => (
								<CommandItem
									key={`${l.programming_language_id}`}
									value={String(l.programming_language_id)}
									onSelect={(currentValue) => {
										//setValue(currentValue === value ? '' : currentValue);
										setPickedOptions((prev: any) => ({
											...prev,
											backend_language: {
												programming_language_id: l.programming_language_id,
												programming_language_name: l.programming_language_name,
											},
										}));
										setOpen(false);
									}}
								>
									{/*<Check className={cn('mr-2 h-4 w-4', value === String(a.addon_id) ? 'opacity-100' : 'opacity-0')} />*/}
									{l.programming_language_name}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function PickBackendFramework({
	selectedBackendLanguage,
	setPickedOptions,
}: {
	selectedBackendLanguage: string | null;
	setPickedOptions: any;
}) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	const [frameworks, setFrameworks] = useState<
		{
			backend_id: number;
			backend_name: string;
			programming_languages: string[];
			performance_requirements: string;
			scalability_needs: string;
			learning_curve: string;
		}[]
	>([]);

	const {toast} = useToast();

	useEffect(() => {
		if (selectedBackendLanguage) {
			return setFrameworks(
				fakeApi.backends.filter((b) => b.programming_languages.find((pl) => pl === selectedBackendLanguage))
			);
		}

		return setFrameworks(fakeApi.backends);
	}, [fakeApi.backends, selectedBackendLanguage]);

	//console.log(frameworks);

	return (
		<div className='flex flex-col gap-1'>
			<div>6th. Pick backend framework</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between text-black'>
						{value
							? frameworks.find((framework) => String(framework.backend_id) === value)?.backend_name
							: 'Select framework...'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
					<Command>
						<CommandInput placeholder='Search framework...' />
						<CommandList>
							<CommandEmpty>No framework found.</CommandEmpty>
							<CommandGroup>
								{frameworks.map((framework) => (
									<CommandItem
										key={framework.backend_id}
										value={String(framework.backend_id)}
										onSelect={(currentValue) => {
											//setValue(currentValue === value ? '' : currentValue);
											setPickedOptions((prev: any) => ({
												...prev,
												backend_framework: {
													backend_id: framework.backend_id,
													backend_name: framework.backend_name,
													programming_languages: framework.programming_languages,
													performance_requirements: framework.performance_requirements,
													scalability_needs: framework.scalability_needs,
													learning_curve: framework.learning_curve,
												},
											}));
											toast({
												title: 'Backend framework tip',
												description: 'You may pick addons for your backend framework.',
												variant: 'default',
												duration: 10000,
											});
											setOpen(false);
										}}
									>
										{/*<Check
											className={cn(
												'mr-2 h-4 w-4',
												value === String(framework.backend_id) ? 'opacity-100' : 'opacity-0'
											)}
										/>*/}
										{framework.backend_name}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}

function PickBackendAddons({
	selectedDatabase,
	selectedBackend,
	setPickedOptions,
	currentAddons,
}: {
	selectedDatabase: {database_id: number; database_name: string; database_type: string}[];
	selectedBackend: string | null;
	setPickedOptions: any;
	currentAddons: any[];
}) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	const [addons, setAddons] = useState<
		{
			addon_id: number;
			addon_name: string;
			used_with: string[];
			development_focus: string;
			needed_with: string;
		}[]
	>([]);
	const {toast} = useToast();

	useEffect(() => {
		if (selectedDatabase.length > 0 && selectedBackend) {
			//console.log('double');
			const filteredBackendAddons: any[] = [];
			filteredBackendAddons.push(
				...fakeApiBackendAddons.addons.filter((a) => selectedDatabase.find((db) => db.database_name === a.needed_with))
			);
			filteredBackendAddons.push(
				...fakeApiBackendAddons.addons.filter((a) =>
					a.used_with.find(
						(tech) => tech === selectedBackend && !filteredBackendAddons.find((fa) => fa.addon_id === a.addon_id)
					)
				)
			);

			return setAddons(filteredBackendAddons);
		} else if (selectedDatabase.length > 0) {
			//console.log('db');
			const filteredBackendAddons: any[] = [];
			filteredBackendAddons.push(
				...fakeApiBackendAddons.addons.filter((a) => selectedDatabase.find((db) => db.database_name === a.needed_with))
			);
			return setAddons(filteredBackendAddons);
		} else if (selectedBackend) {
			//console.log('back');
			const filteredBackendAddons: any[] = [];
			filteredBackendAddons.push(
				...fakeApiBackendAddons.addons.filter((a) => a.used_with.find((tech) => tech === selectedBackend))
			);
			return setAddons(filteredBackendAddons);
		}

		//console.log(fakeApiBackendAddons);
		return setAddons(fakeApiBackendAddons.addons);
	}, [fakeApiBackendAddons.addons, selectedDatabase, selectedBackend]);

	//console.log('what', selectedDatabase, selectedBackend, addons);

	return (
		<div className='flex flex-col gap-1'>
			<div>7th. Pick backend addons</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between text-black'>
						{value ? addons.find((a) => String(a.addon_id) === value)?.addon_name : 'Select addon'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
					<Command>
						<CommandInput placeholder='Search addon...' />
						<CommandList>
							<CommandEmpty>No addons found.</CommandEmpty>
							<CommandGroup>
								{addons.map((a) => (
									<CommandItem
										key={`${a.addon_id}-backend-addons`}
										value={String(a.addon_id)}
										onSelect={(currentValue) => {
											if (!currentAddons.find((a2: any) => a2.addon_id === a.addon_id)) {
												//setValue(currentValue === value ? '' : currentValue);
												setPickedOptions((prev: any) => ({
													...prev,
													backend_addons: [
														...prev.backend_addons,
														{
															addon_id: a.addon_id,
															addon_name: a.addon_name,
															used_with: a.used_with,
															development_focus: a.development_focus,
															needed_with: a.used_with,
														},
													],
												}));
												return setOpen(false);
											}
											return toast({
												title: 'Error',
												description: `Addon ${a.addon_name} is already on your picks`,
												variant: 'destructive',
												duration: 5000,
											});
										}}
									>
										{/*<Check className={cn('mr-2 h-4 w-4', value === String(a.addon_id) ? 'opacity-100' : 'opacity-0')} />*/}
										{a.addon_name}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
