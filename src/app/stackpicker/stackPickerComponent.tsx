'use client';

import {SquareXIcon} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {Check, ChevronsUpDown} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';

import fakeApi from '@/components/fakeapi/options_for_stackpicker_v2.json';
import fakeApiBackendAddons from '@/components/fakeApi/backend_addons.json';

export default function StackPickerComponent() {
	const [forceBackend, setForceBackend] = useState<boolean>(false);
	const [filters, setFilters] = useState<any>({
		topic: null,
		platform: null,
		programming_language: null,
		database_types: [],
	});
	const [pickedOptions, setPickedOptions] = useState<any>({
		frontend_framework: null,
		frontend_addons: [],
		databases: [],
		backend_language: null,
		backend_framework: null,
		backend_addons: [],
	});
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const topic = searchParams.get('topic');
		const platform = searchParams.get('platform');
		const programming_language = searchParams.get('programming_language');
		const database_types = searchParams.getAll('database_types');
		//console.log(topic, platform, programming_language, database_types);

		setFilters({
			topic: topic !== '-' ? topic : null,
			platform: platform !== '-' ? platform : null,
			programming_language: programming_language !== '-' ? programming_language : null,
			database_types: database_types.length > 0 ? database_types : [],
		});
	}, [searchParams]);

	const stackAnswers = () => {
		return (
			<div className='flex flex-row gap-1 justify-start items-center content-center text-center flex-wrap'>
				<div>Answers:</div>
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
				{filters.programming_language ? (
					<div
						onClick={() => setFilters((prev: any) => ({...prev, programming_language: null}))}
						className='flex flex-row gap-1 border rounded w-fit p-1'
					>
						<div>{`3. Frontend language: ${filters.programming_language}`}</div>
						<SquareXIcon />
					</div>
				) : (
					<div className='flex flex-row gap-1 border rounded w-fit p-1'>{`3. Frontend language - `}</div>
				)}
				{filters.database_types.length > 0 ? (
					<div className='flex flex-row gap-1 border rounded w-fit p-1 text-center'>
						<div className='text-center content-center'>{`4. Database type options:`}</div>
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
					<div className='flex flex-row gap-1 border rounded w-fit p-1'>{`4. Database type options: - `}</div>
				)}
			</div>
		);
		//return answers.map((a: any) => a).join(', ');
	};

	//console.log(filters);
	//console.log(pickedOptions.databases);
	console.log(pickedOptions.backend_language);

	return (
		<div className='flex flex-col gap-1'>
			{stackAnswers()}
			<div className='flex flex-row gap-1 justify-start items-center content-center text-center flex-wrap'>
				<div>Picked stack options:</div>
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
								key={`${db.database_id}-${db.database_name}`}
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
			<div className='flex flex-row gap-5 flex-wrap'>
				<PickFrontendFramework
					setPickedOptions={setPickedOptions}
					programming_language={filters.programming_language}
					platform={filters.platform}
				/>
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
					<PickDatabases setPickedOptions={setPickedOptions} database_types={filters.database_types} />
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
					<div>4th. Pick programming language for backend</div>
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
					>
						{!forceBackend ? 'Force enable backend' : 'Disable backend force'}
					</Button>
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
					/>
				</div>
			</div>
			<div className='justify-self-center w-fit h-fit ml-auto mr-auto'>
				<Button onClick={() => router.push('/instructions/123')}>Check your results</Button>
			</div>
		</div>
	);
}

function PickFrontendFramework({
	programming_language,
	platform,
	setPickedOptions,
}: {
	programming_language: string | null;
	platform: string | null;
	setPickedOptions: any;
}) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	const [frameworks, setFrameworks] = useState<
		{
			frontend_id: number;
			frontend_name: string;
			programming_languages: string[];
		}[]
	>([]);

	useEffect(() => {
		if (programming_language && platform) {
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
		}

		return setFrameworks(fakeApi.frontends);
	}, [fakeApi.frontends, programming_language, platform]);

	//console.log(programming_language, platform, frameworks.length);

	return (
		<div className='flex flex-col gap-1'>
			<div>1st. Pick frontend framework</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-fit justify-between'>
						{value
							? frameworks.find((framework) => String(framework.frontend_id) === value)?.frontend_name
							: 'Select framework'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-fit p-0'>
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
											setPickedOptions((prev: any) => ({
												...prev,
												frontend_framework: {
													framework_id: framework.frontend_id,
													framework_name: framework.frontend_name,
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
}: {
	pickedFrontendFramework: null | {
		framework_id: number;
		framework_name: string;
	};
	setPickedOptions: any;
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
			<div>2nd. Pick frontend addons</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-fit justify-between'>
						{value ? addons.find((a) => String(a.addon_id) === value)?.addon_name : 'Select addon'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-fit p-0'>
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
											setOpen(false);
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

function PickDatabases({setPickedOptions, database_types}: {setPickedOptions: any; database_types: any[]}) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	const [databases, setDatabases] = useState<
		{
			database_id: number;
			database_name: string;
			database_type: string;
		}[]
	>([]);

	useEffect(() => {
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
			<div>3rd. Pick databases, that will fit your project</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-fit justify-between'>
						{value ? databases.find((db) => String(db.database_id) === value)?.database_name : 'Select database'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-fit p-0'>
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
											//setValue(currentValue === value ? '' : currentValue);
											setPickedOptions((prev: any) => ({
												...prev,
												databases: [
													...prev.databases,
													{
														database_id: db.database_id,
														database_name: db.database_name,
														database_type: db.database_type,
													},
												],
											}));
											setOpen(false);
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
				<Button variant='outline' role='combobox' aria-expanded={open} className='w-fit justify-between'>
					{value
						? languages.find((l) => String(l.programming_language_id) === value)?.programming_language_name
						: 'Select programming language'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-fit p-0'>
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
			<div>5th. Pick backend framework</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-fit justify-between'>
						{value
							? frameworks.find((framework) => String(framework.backend_id) === value)?.backend_name
							: 'Select framework...'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-fit p-0'>
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
}: {
	selectedDatabase: {database_id: number; database_name: string; database_type: string}[];
	selectedBackend: string | null;
	setPickedOptions: any;
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

	console.log('what', selectedDatabase, selectedBackend, addons);

	return (
		<div className='flex flex-col gap-1'>
			<div>6th. Pick backend addons</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-fit justify-between'>
						{value ? addons.find((a) => String(a.addon_id) === value)?.addon_name : 'Select addon'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-fit p-0'>
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
											setOpen(false);
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
