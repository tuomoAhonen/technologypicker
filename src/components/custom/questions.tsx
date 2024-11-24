'use client';

import {useEffect, useReducer, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Check, ChevronsUpDown, SquareXIcon, UserIcon} from 'lucide-react';
import {cn} from '@/lib/utils';
import {useToast} from '@/hooks/use-toast';
import {ToastAction} from '@/components/ui/toast';
import {Button} from '@/components/ui/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const initializer = {
	topic: {topic_id: null, topic_name: null},
	target_device: {platform_id: null, platform_name: null},
	programming_language: {programming_language_id: null, programming_language_name: null},
	//addons: [],
	databaseTypes: [],
	//{database_type_id: null, database_type_name: null},
	/*databases: {
		database_as_local: {database_local_id: null, database_local_name: null},
		database_as_program: {database_program_id: null, database_program_name: null},
		database_as_service: {database_service_id: null, database_service_name: null},
	},*/
};

function stackReducer(state: any, action: {payload: any; type: string}) {
	//console.log(action);
	switch (action.type) {
		case 'setTopic':
			return {...state, topic: {topic_id: action.payload.topic_id, topic_name: action.payload.topic_name}};
		case 'deleteTopic':
			return {...state, topic: {topic_id: null, topic_name: null}};
		case 'setTargetDevice':
			return {
				...state,
				target_device: {
					platform_id: action.payload.platform_id,
					platform_name: action.payload.platform_name,
				},
			};
		case 'deleteTargetDevice':
			return {
				...state,
				target_device: {
					platform_id: null,
					platform_name: null,
				},
			};
		case 'setProgrammingLanguage':
			return {
				...state,
				programming_language: {
					programming_language_id: action.payload.programming_language_id,
					programming_language_name: action.payload.programming_language_name,
				},
			};
		case 'deleteProgrammingLanguage':
			return {
				...state,
				programming_language: {programming_language_id: null, programming_language_name: null},
			};
		/*case 'setAddons':
			return {
				...state,
				addons: [...state.addons, {addon_id: action.payload.addon_id, addon_name: action.payload.addon_name}],
			};
		case 'deleteAddon':
			return {
				...state,
				addons: state.addons.filter(
					(addon: {addon_id: number; addon_name: string}) => addon.addon_id !== action.payload.addon_id
				),
			};*/
		case 'setDatabaseTypes':
			if (String(action.payload.database_type_name).toLocaleLowerCase() === 'no database') {
				return {
					...state,
					databaseTypes: [
						{
							database_type_id: action.payload.database_type_id,
							database_type_name: action.payload.database_type_name,
						},
					],
				};
			}

			return {
				...state,
				databaseTypes: [
					...state.databaseTypes.filter(
						(dbtypes: {database_type_id: number; database_type_name: string}) =>
							dbtypes.database_type_name.toLocaleLowerCase() !== 'no database'
					),
					{
						database_type_id: action.payload.database_type_id,
						database_type_name: action.payload.database_type_name,
					},
				],
			};
		case 'deleteDatabaseType':
			return {
				...state,
				databaseTypes: state.databaseTypes.filter(
					(dbtype: {database_type_id: number; database_type_name: string}) =>
						dbtype.database_type_id !== action.payload.database_type_id
				),
			};
		/*case 'setDatabases':
			return state;*/
		case 'resetStack':
			return initializer;
		default:
			return state;
	}
}

export default function Questions() {
	const [stackReducerValue, stackReducerDispatcher] = useReducer(stackReducer, initializer);
	const [chosenStack, setChosenStack] = useState<object>({stack_id: null});
	const [questionShown, setQuestionShown] = useState<number>(1);
	const [questionCount, setQuestionCount] = useState<number>(4);
	const [user, setUser] = useState({user_id: null, user_email: null, username: null});
	const [currentAnswers, setCurrentAnswers] = useState<any>('');
	const route = useRouter();

	const returnToBeginning = () => {
		stackReducerDispatcher({payload: null, type: 'resetStack'});
		return setQuestionShown(1);
	};

	const stackAnswers = () => {
		return (
			<div className='flex flex-row gap-1 justify-start items-center content-center text-center flex-wrap'>
				{stackReducerValue.topic.topic_name ? (
					<div
						key={stackReducerValue.topic.topic_id + '-' + stackReducerValue.topic.topic_name}
						onClick={() => stackReducerDispatcher({payload: null, type: 'deleteTopic'})}
						className='flex flex-row gap-1 border rounded w-fit p-1'
					>
						<div>{`1. ${stackReducerValue.topic.topic_name}`}</div>
						<SquareXIcon />
					</div>
				) : (
					<div className='flex flex-row gap-1 border rounded w-fit p-1'>{`1. - `}</div>
				)}
				{stackReducerValue.target_device.platform_name ? (
					<div
						key={stackReducerValue.target_device.platform_id + '-' + stackReducerValue.target_device.platform_name}
						onClick={() => stackReducerDispatcher({payload: null, type: 'deleteTargetDevice'})}
						className='flex flex-row gap-1 border rounded w-fit p-1'
					>
						<div>{`2. ${stackReducerValue.target_device.platform_name}`}</div>
						<SquareXIcon />
					</div>
				) : (
					<div className='flex flex-row gap-1 border rounded w-fit p-1'>{`2. - `}</div>
				)}
				{stackReducerValue.programming_language.programming_language_name ? (
					<div
						key={
							stackReducerValue.programming_language.programming_language_id +
							'-' +
							stackReducerValue.programming_language.programming_language_name
						}
						onClick={() => stackReducerDispatcher({payload: null, type: 'deleteProgrammingLanguage'})}
						className='flex flex-row gap-1 border rounded w-fit p-1'
					>
						<div>{`3. ${stackReducerValue.programming_language.programming_language_name}`}</div>
						<SquareXIcon />
					</div>
				) : (
					<div className='flex flex-row gap-1 border rounded w-fit p-1'>{`3. - `}</div>
				)}
				{/*stackReducerValue.addons.length > 0 ? (
					<div className='flex flex-row gap-1 border rounded w-fit p-1 text-center'>
						<div className='text-center content-center'>{`4.`}</div>
						{stackReducerValue.addons.map((addon: {addon_id: number; addon_name: string}) => (
							<div
								key={addon.addon_id + '-' + addon.addon_name}
								onClick={() => stackReducerDispatcher({payload: {addon_id: addon.addon_id}, type: 'deleteAddon'})}
								className='flex flex-row gap-1 border rounded w-fit p-1'
							>
								<div>{addon.addon_name}</div>
								<SquareXIcon />
							</div>
						))}
					</div>
				) : (
					<div className='flex flex-row gap-1 border rounded w-fit p-1'>{`4. - `}</div>
				)*/}
				{stackReducerValue.databaseTypes.length > 0 ? (
					<div className='flex flex-row gap-1 border rounded w-fit p-1 text-center'>
						<div className='text-center content-center'>{`4.`}</div>
						{stackReducerValue.databaseTypes.map((dbtypes: {database_type_id: number; database_type_name: string}) => (
							<div
								key={dbtypes.database_type_id + '-' + dbtypes.database_type_name}
								onClick={() =>
									stackReducerDispatcher({
										payload: {database_type_id: dbtypes.database_type_id},
										type: 'deleteDatabaseType',
									})
								}
								className='flex flex-row gap-1 border rounded w-fit p-1'
							>
								<div>{dbtypes.database_type_name}</div>
								<SquareXIcon />
							</div>
						))}
					</div>
				) : (
					<div className='flex flex-row gap-1 border rounded w-fit p-1'>{`4. - `}</div>
				)}
			</div>
		);
		//return answers.map((a: any) => a).join(', ');
	};

	useEffect(() => {
		/*if (JSON.stringify(stackReducerValue) === JSON.stringify(initializer)) {
			return setCurrentAnswers('-');
		}*/

		return setCurrentAnswers(stackAnswers());
	}, [stackReducerValue]);

	/*
		&addons=${
			stackReducerValue.addons.length > 0
				? stackReducerValue.addons
						.map((addon: {addon_id: number; addon_name: string}) => addon.addon_name)
						.join('&addons=')
				: '-'
	*/

	return (
		<div className='flex flex-col gap-5 w-full'>
			<div className='flex flex-row gap-5 justify-start items-center w-full'>
				<Button onClick={() => returnToBeginning()}>Reset all</Button>
				<Button onClick={() => (questionShown > 1 ? setQuestionShown(questionShown - 1) : null)}>Last question</Button>
				{questionShown !== questionCount ? (
					<Button onClick={() => (questionShown < questionCount ? setQuestionShown(questionShown + 1) : null)}>
						Next please
					</Button>
				) : (
					<AlertDialog>
						<AlertDialogTrigger className='h-9 px-4 py-1 rounded-md bg-zinc-900 text-white text-sm'>
							Submit my answers
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Are you absolutely sure, that you want to submit your answers and get the absolute beast stack for
									your self?
								</AlertDialogTitle>
								<AlertDialogDescription className='hidden'>
									This is just to make sure, you will not use submit as accident.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction asChild>
									<Button
										onClick={() =>
											route.push(
												`/stackpicker/?topic=${
													stackReducerValue.topic.topic_name ? stackReducerValue.topic.topic_name : '-'
												}&platform=${
													stackReducerValue.target_device.platform_name
														? stackReducerValue.target_device.platform_name
														: '-'
												}&programming_language=${
													stackReducerValue.programming_language.programming_language_name
														? stackReducerValue.programming_language.programming_language_name
														: '-'
												}&database_types=${
													stackReducerValue.databaseTypes.length > 0
														? stackReducerValue.databaseTypes
																.map(
																	(dbtype: {database_type_id: number; database_type_name: string}) =>
																		dbtype.database_type_name
																)
																.join('&database_types=')
														: '-'
												}`
											)
										}
									>
										Submit my answers
									</Button>
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}
				<Button onClick={() => route.push('/stackpicker')}>Skip this, I am pro</Button>
				<Login user={user} setUser={setUser} />
			</div>
			<div className='flex flex-col gap-1'>
				<div>{`Greetings ${
					user?.user_id ? user.username : 'stranger'
				}! I am your technology wizard and I will assist you today
				to choose correct technology stack for your project, that will indeed be a success, if it is up to me.`}</div>
				<div>{`If you can't find correct option, you can choose other and submit it, but it will not affect on the recommended stack, so it will be up to you to check the compatibility. We will add it to the list after we have looked into that option.`}</div>
				{!user?.user_id ? <div>{`If you would like to save your stack, please use login.`}</div> : null}
			</div>
			<div className='flex flex-row gap-1 justify-start items-center'>
				<div>Your answers:</div>
				{currentAnswers ? currentAnswers : null}
			</div>
			<div className='font-bold text-lg'>{`Question number ${questionShown} out of ${questionCount}`}</div>

			{questionShown === 1 ? (
				<QuestionNumberOne currentDispatcherValue={stackReducerValue.topic} dispatcher={stackReducerDispatcher} />
			) : questionShown === 2 ? (
				<QuestionNumberTwo
					currentDispatcherValue={stackReducerValue.target_device}
					dispatcher={stackReducerDispatcher}
				/>
			) : questionShown === 3 ? (
				<QuestionNumberThree
					currentDispatcherValue={stackReducerValue.programming_language}
					dispatcher={stackReducerDispatcher}
				/> /*: questionShown === 4 ? (
				<QuestionNumberFour
					currentDispatcherValue={stackReducerValue.addons}
					dispatcher={stackReducerDispatcher}
				/>*/
			) : questionShown === 4 ? (
				<QuestionNumberFour
					currentDispatcherValue={stackReducerValue.databaseTypes}
					dispatcher={stackReducerDispatcher}
				/>
			) : null}
		</div>
	);
}

// this works, but it uses user's device to render, so it will be heavy on use, not sure if it is worth it
function TextToWrittenLetterByLetter({text}: {text: string}) {
	const [message, setMessage] = useState<string>('');
	const [shownMessage, setShowMessage] = useState<string>('');

	useEffect(() => {
		//console.log(message.length);
		if (message.length === 0) return;

		let timeoutTimer = setTimeout(() => {
			setShowMessage((previous) => previous + message[0]);
			setMessage((previous) => previous.slice(1));
		}, 20);

		return () => clearTimeout(timeoutTimer);
	}, [message]);

	useEffect(() => {
		if (shownMessage) return;
		return setMessage(text);
	}, []);

	return <div className='w-full h-min-8'>{shownMessage}</div>;
}

function Login({user, setUser}: {user: {user_id: any; user_email: any; username: any}; setUser: any}) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	//const {toast} = useToast();

	return (
		<Sheet>
			<SheetTrigger asChild className='justify-self-end ml-auto'>
				<UserIcon className='w-10 h-10' />
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>User menu</SheetTitle>
					<SheetDescription className='hidden'>
						This is user menu. You can login and see your personal information and favourite stacks.
					</SheetDescription>
				</SheetHeader>
				{!user.user_id ? (
					<div className='w-full h-fit flex flex-col gap-1'>
						<Input
							type='text'
							placeholder='Email / username...'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<Input
							type='password'
							placeholder='Password...'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button
							onClick={() => {
								setUser({
									user_id: 'adsasdasd-1312-dasad5543-1asasd45-654',
									user_email: username,
									username: 'Testi Testaaja',
								});
								setUsername('');
								setPassword('');
							}}
							className=''
						>
							Login
						</Button>
					</div>
				) : (
					<div className='flex flex-col gap-1'>
						<div>{`Wellcome back ${user.username}`}</div>
						<Button onClick={() => setUser({user_id: null, user_email: null, username: null})}>Logout</Button>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}

function QuestionNumberOne({currentDispatcherValue, dispatcher}: {currentDispatcherValue: any; dispatcher: any}) {
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<undefined | number>(undefined);
	const [showInput, setShowInput] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>('');

	const topics = [
		{
			topic_id: 0,
			topic_name: 'Personal portfolio',
		},
		{
			topic_id: 1,
			topic_name: `Company's website`,
		},
		{
			topic_id: 2,
			topic_name: 'E-commerce',
		},
		{
			topic_id: 3,
			topic_name: 'Wolt-app',
		},
		{
			topic_id: 4,
			topic_name: 'Design',
		},
		{
			topic_id: 5,
			topic_name: 'Web game',
		},
		{
			topic_id: 6,
			topic_name: 'Non-web game',
		},
		{
			topic_id: 7,
			topic_name: 'Other',
		},
	];

	/*useEffect(() => {
		//console.log(value || value === 0);
		if ((value || value === 0) && value !== currentDispatcherValue.topic_id && topics[value].topic_name !== 'Other') {
			return dispatcher({payload: topics[value], type: 'setTopic'});
		}
	}, [value]);

	useEffect(() => {
		if (
			(currentDispatcherValue?.topic_id || currentDispatcherValue.topic_id === 0) &&
			currentDispatcherValue.topic_id !== value
		) {
			//console.log('setValue', currentDispatcherValue.topic_id);
			if (topics.find((t) => t.topic_id === currentDispatcherValue.topic_id)) {
				return setValue(currentDispatcherValue.topic_id);
			}

			return setValue(7);
		}

		return setValue(undefined);
	}, [currentDispatcherValue]);*/

	return (
		<>
			<div>What is your project about? Do you have topic for it?</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild className='w-full'>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='w-full justify-between'
						onClick={() => (showInput ? (setShowInput(false), setValue(undefined)) : null)}
					>
						{
							/*value || value === 0 ? topics.find((topic) => topic.topic_id === value)?.topic_name : */ value === 7
								? topics[value].topic_name
								: 'Select topic'
						}
						<ChevronsUpDown className='opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
					<Command>
						<CommandInput placeholder='Search for topic...' />
						<CommandList>
							<CommandEmpty>No topic found.</CommandEmpty>
							<CommandGroup>
								{topics.map((topic) => (
									<CommandItem
										key={topic.topic_id}
										value={String(topic.topic_id)}
										onSelect={(currentValue) => {
											if (topics[parseInt(String(currentValue))].topic_name !== 'Other') {
												//setValue(parseInt(String(currentValue)) === value ? value : parseInt(String(currentValue)));
												setValue(undefined);
												dispatcher({payload: topics[parseInt(String(currentValue))], type: 'setTopic'});
												return setOpen(false);
											}

											setShowInput(true);
											setValue(parseInt(String(currentValue)));
											return setOpen(false);
										}}
									>
										{topic.topic_name}
										{/*<Check className={cn('ml-auto', value === topic.topic_id ? 'opacity-100' : 'opacity-0')} />*/}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<div className={showInput ? 'flex flex-row gap-1' : 'hidden'}>
				<Input placeholder='' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
				<Button
					onClick={() => {
						setValue(undefined);
						setInputValue('');
						return setShowInput(false);
					}}
				>
					Cancel
				</Button>
				<Button
					onClick={() => {
						dispatcher({
							payload: {
								topic_id: Math.max(...topics.map((topic) => topic.topic_id)) + 1,
								topic_name: inputValue,
							},
							type: 'setTopic',
						});
						setValue(undefined);
						setInputValue('');
						return setShowInput(false);
					}}
				>
					Add custom topic
				</Button>
			</div>
		</>
	);
}

function QuestionNumberTwo({currentDispatcherValue, dispatcher}: {currentDispatcherValue: any; dispatcher: any}) {
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<undefined | string>(undefined);
	const [showInput, setShowInput] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>('');

	const platforms = [
		{
			platform_id: 0,
			platform_name: 'Mobile',
		},
		{
			platform_id: 1,
			platform_name: `Web`,
		},
		{
			platform_id: 2,
			platform_name: 'MacOS',
		},
		{
			platform_id: 3,
			platform_name: 'Windows',
		},
		{
			platform_id: 4,
			platform_name: 'Linux',
		},
		{
			platform_id: 5,
			platform_name: 'Other',
		},
	];

	/*useEffect(() => {
		if (
			(value || value === 0) &&
			value !== currentDispatcherValue.platform_id &&
			platforms[value].platform_name !== 'Other'
		) {
			return dispatcher({payload: platforms[value], type: 'setTargetDevice'});
		}
	}, [value]);

	useEffect(() => {
		if (
			(currentDispatcherValue?.platform_id || currentDispatcherValue.platform_id === 0) &&
			currentDispatcherValue.platform_id !== value
		) {
			//console.log('setValue', currentDispatcherValue.platform_id);
			if (platforms.find((p) => p.platform_id === currentDispatcherValue.platform_id)) {
				return setValue(currentDispatcherValue.platform_id);
			}

			return setValue(5);
		}

		return setValue(undefined);
	}, [currentDispatcherValue]);*/

	//console.log(value, currentDispatcherValue);

	return (
		<>
			<div>What is the target platform?</div>
			<Select
				open={open}
				onOpenChange={setOpen}
				value={/*value || value === 0 ? String(value) : undefined*/ value}
				onValueChange={(currentValue) => {
					if (platforms[parseInt(String(currentValue))].platform_name !== 'Other') {
						//console.log('currentValue', currentValue);
						//setValue(parseInt(String(currentValue)) === value ? value : parseInt(String(currentValue)));
						dispatcher({payload: platforms[parseInt(String(currentValue))], type: 'setTargetDevice'});
						setValue('');
						return setOpen(false);
					}

					setShowInput(true);
					setValue(currentValue);
					return setOpen(false);
				}}
			>
				<SelectTrigger
					className='w-full'
					onClick={() => (showInput ? (setShowInput(false), setValue(undefined)) : null)}
				>
					<SelectValue placeholder='Select platform' />
				</SelectTrigger>
				<SelectContent>
					{platforms.length > 0
						? platforms.map((p) => (
								<SelectItem key={p.platform_id} value={String(p.platform_id)}>
									{p.platform_name}
								</SelectItem>
						  ))
						: null}
				</SelectContent>
			</Select>
			<div className={showInput ? 'flex flex-row gap-1' : 'hidden'}>
				<Input placeholder='' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
				<Button
					onClick={() => {
						setValue('');
						setInputValue('');
						return setShowInput(false);
					}}
				>
					Cancel
				</Button>
				<Button
					onClick={() => {
						dispatcher({
							payload: {
								platform_id: Math.max(...platforms.map((platform) => platform.platform_id)) + 1,
								platform_name: inputValue,
							},
							type: 'setTargetDevice',
						});
						setValue('');
						setInputValue('');
						return setShowInput(false);
					}}
				>
					Add custom platform
				</Button>
			</div>
		</>
	);
}

function QuestionNumberThree({currentDispatcherValue, dispatcher}: {currentDispatcherValue: any; dispatcher: any}) {
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<undefined | number>(undefined);
	const [showInput, setShowInput] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>('');

	const programmingLanguages = [
		{
			programming_language_id: 0,
			programming_language_name: 'JavaScript',
		},
		{
			programming_language_id: 1,
			programming_language_name: `TypeScript`,
		},
		{
			programming_language_id: 2,
			programming_language_name: 'Python',
		},
		{
			programming_language_id: 3,
			programming_language_name: 'Rust',
		},
		{
			programming_language_id: 4,
			programming_language_name: 'C',
		},
		{
			programming_language_id: 5,
			programming_language_name: 'C++',
		},
		{
			programming_language_id: 6,
			programming_language_name: 'Java',
		},
		{
			programming_language_id: 7,
			programming_language_name: 'Other',
		},
	];

	/*useEffect(() => {
		if (
			(value || value === 0) &&
			value !== currentDispatcherValue.programming_language_id &&
			programmingLanguages[value].programming_language_name !== 'Other'
		) {
			return dispatcher({payload: programmingLanguages[value], type: 'setProgrammingLanguage'});
		}
	}, [value]);

	useEffect(() => {
		if (
			(currentDispatcherValue?.programming_language_id || currentDispatcherValue.programming_language_id === 0) &&
			currentDispatcherValue.programming_language_id !== value
		) {
			//console.log('setValue', currentDispatcherValue.programming_language_id);
			if (
				programmingLanguages.find((pl) => pl.programming_language_id === currentDispatcherValue.programming_language_id)
			) {
				return setValue(currentDispatcherValue.programming_language_id);
			}

			return setValue(7);
		}

		return setValue(undefined);
	}, [currentDispatcherValue]);*/

	//console.log(value, currentDispatcherValue);

	return (
		<>
			<div>Which programming language, would you like to use as your main programming language for front end?</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild className='w-full'>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='w-full justify-between'
						onClick={() => (showInput ? (setShowInput(false), setValue(undefined)) : null)}
					>
						{value || value === 0
							? programmingLanguages.find(
									(programming_language) => programming_language.programming_language_id === value
							  )?.programming_language_name
							: 'Select programming language'}
						<ChevronsUpDown className='opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
					<Command>
						<CommandInput placeholder='Search for programming language...' />
						<CommandList>
							<CommandEmpty>No programming language found.</CommandEmpty>
							<CommandGroup>
								{programmingLanguages.map((programming_language) => (
									<CommandItem
										key={programming_language.programming_language_id}
										value={String(programming_language.programming_language_id)}
										onSelect={(currentValue) => {
											if (programmingLanguages[parseInt(String(currentValue))].programming_language_name !== 'Other') {
												//setValue(parseInt(String(currentValue)) === value ? value : parseInt(String(currentValue)));
												dispatcher({
													payload: programmingLanguages[parseInt(String(currentValue))],
													type: 'setProgrammingLanguage',
												});
												return setOpen(false);
											}

											setShowInput(true);
											setValue(parseInt(String(currentValue)));
											return setOpen(false);
										}}
									>
										{programming_language.programming_language_name}
										<Check
											className={cn(
												'ml-auto',
												value === programming_language.programming_language_id ? 'opacity-100' : 'opacity-0'
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<div className={showInput ? 'flex flex-row gap-1' : 'hidden'}>
				<Input placeholder='' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
				<Button
					onClick={() => {
						setValue(undefined);
						setInputValue('');
						return setShowInput(false);
					}}
				>
					Cancel
				</Button>
				<Button
					onClick={() => {
						dispatcher({
							payload: {
								programming_language_id: Math.max(...programmingLanguages.map((pl) => pl.programming_language_id)) + 1,
								programming_language_name: inputValue,
							},
							type: 'setProgrammingLanguage',
						});
						setValue(undefined);
						setInputValue('');
						return setShowInput(false);
					}}
				>
					Add custom programming language
				</Button>
			</div>
		</>
	);
}

/*function QuestionNumberFour({currentDispatcherValue, dispatcher}: {currentDispatcherValue: any[]; dispatcher: any}) {
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<undefined | number>(undefined);
	const [showInput, setShowInput] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>('');
	const {toast} = useToast();

	const addons = [
		{
			addon_id: 0,
			addon_name: 'Shadcn/ui',
		},
		{
			addon_id: 1,
			addon_name: `Storybook`,
		},
		{
			addon_id: 2,
			addon_name: 'Strapi',
		},
		{
			addon_id: 3,
			addon_name: 'Google API',
		},
		{
			addon_id: 4,
			addon_name: 'Formik',
		},
		{
			addon_id: 5,
			addon_name: 'Zod',
		},
		{
			addon_id: 6,
			addon_name: 'TailwindCSS',
		},
		{
			addon_id: 7,
			addon_name: 'Other',
		},
	];

	useEffect(() => {
		if (
			(value || value === 0) &&
			addons[value].addon_name !== 'Other' &&
			!currentDispatcherValue.find((addon: {addon_id: number; addon_name: string}) => addon.addon_id === value)
		) {
			dispatcher({payload: addons[value], type: 'setAddons'});
			return setValue(undefined);
		}
	}, [value]);

	//useEffect(() => {
	//	if (
	//		(currentDispatcherValue?.addon_id || currentDispatcherValue.addon_id === 0) &&
	//		currentDispatcherValue.addon_id !== value
	//	) {
	//		//console.log('setValue', currentDispatcherValue.addon_id);
	//		return setValue(currentDispatcherValue.addon_id);
	//	}
	//}, [currentDispatcherValue]);

	//console.log(currentDispatcherValue);

	return (
		<>
			<div>Would you like to use any specific addons in your project? Libraries? Tools?</div>
			<div className='flex flex-col gap-1'>
				{//<div className='flex flex-row gap-1'>
					//{currentDispatcherValue.length > 0 ? (
						//currentDispatcherValue.map((addon: {addon_id: number; addon_name: string}) => (
							//<div
								//key={addon.addon_id}
								//onClick={() => dispatcher({payload: {addon_id: addon.addon_id}, type: 'deleteAddon'})}
								//className='flex flex-row gap-1 border rounded p-1'
							//>
								//<div>{addon.addon_name}</div>
								//<SquareXIcon />
							//</div>
					//	))
					//) : (
					//	<div className='border rounded p-1'>No addons</div>
					//)}
				//</div>
				}
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild className='w-full'>
						<Button
							variant='outline'
							role='combobox'
							aria-expanded={open}
							className='w-full justify-between pl-1'
							onClick={() => (showInput ? (setShowInput(false), setValue(undefined)) : null)}
						>
							{value || value === 0 ? addons.find((addon) => addon.addon_id === value)?.addon_name : 'Select addon'}
							<ChevronsUpDown className='opacity-50' />
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
						<Command>
							<CommandInput placeholder='Search for addon...' />
							<CommandList>
								<CommandEmpty>No addon found.</CommandEmpty>
								<CommandGroup>
									{addons.map((addon) => (
										<CommandItem
											key={addon.addon_id}
											value={String(addon.addon_id)}
											onSelect={(currentValue) => {
												if (addon.addon_name !== 'Other') {
													if (
														!currentDispatcherValue.find(
															(addon: {addon_id: number; addon_name: string}) =>
																addon.addon_id === parseInt(String(currentValue))
														)
													) {
														setValue(parseInt(String(currentValue)) === value ? value : parseInt(String(currentValue)));
														return setOpen(false);
													} else {
														return toast({
															title: 'Error',
															description: 'Addon already on your list',
															variant: 'destructive',
															action: <ToastAction altText='Close'>Close</ToastAction>,
														});
													}
												} else {
													setValue(parseInt(String(currentValue)));
													setShowInput(true);
													return setOpen(false);
												}
											}}
										>
											{addon.addon_name}
											<Check className={cn('ml-auto', value === addon.addon_id ? 'opacity-100' : 'opacity-0')} />
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
				<div className={showInput ? 'flex flex-row gap-1' : 'hidden'}>
					<Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} className='w-200 pl-1' />
					<Button
						onClick={() => {
							setValue(undefined);
							setInputValue('');
							return setShowInput(false);
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={() => {
							if (
								!currentDispatcherValue.find(
									(addon: {addon_id: number; addon_name: string}) =>
										addon.addon_name.toLocaleLowerCase() === inputValue.toLocaleLowerCase()
								)
							) {
								dispatcher({
									payload: {
										addon_id:
											Math.max(
												...addons.map((addon: {addon_id: number; addon_name: string}) => addon.addon_id),
												...currentDispatcherValue?.map(
													(addon: {addon_id: number; addon_name: string}) => addon.addon_id
												)
											) + 1,
										addon_name: inputValue,
									},
									type: 'setAddons',
								});
								setValue(undefined);
								setInputValue('');
								return setShowInput(false);
							} else {
								toast({
									title: 'Error',
									description: 'Addon already on your list',
									variant: 'destructive',
									action: <ToastAction altText='Close'>Close</ToastAction>,
								});
							}
						}}
					>
						Add custom addon
					</Button>
				</div>
			</div>
		</>
	);
}*/

function QuestionNumberFour({currentDispatcherValue, dispatcher}: {currentDispatcherValue: any[]; dispatcher: any}) {
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<string>('');
	const [showInput, setShowInput] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>('');
	const {toast} = useToast();

	const databaseTypes = [
		{
			database_type_id: 0,
			database_type_name: 'Database as service',
		},
		{
			database_type_id: 1,
			database_type_name: `Database as hosted on cloud`,
		},
		{
			database_type_id: 2,
			database_type_name: `Database as self hosted`,
		},
		{
			database_type_id: 3,
			database_type_name: 'Database inside the app',
		},
		{
			database_type_id: 4,
			database_type_name: 'No database',
		},
		{
			database_type_id: 5,
			database_type_name: 'Other',
		},
	];

	useEffect(() => {
		if (
			(value || parseInt(value) === 0) &&
			databaseTypes[parseInt(value)].database_type_name !== 'Other' &&
			!currentDispatcherValue.find(
				(dbtypes: {database_type_id: number; database_type_name: string}) =>
					dbtypes.database_type_id === parseInt(value)
			)
		) {
			dispatcher({payload: databaseTypes[parseInt(value)], type: 'setDatabaseTypes'});
			return setValue('');
		} else {
			if (value && databaseTypes[parseInt(value)].database_type_name !== 'Other') {
				return setValue('');
			}
		}
	}, [value]);

	/*useEffect(() => {
		if (
			(currentDispatcherValue?.database_type_id || currentDispatcherValue.database_type_id === 0) &&
			currentDispatcherValue.database_type_id !== value
		) {
			//console.log('setValue', currentDispatcherValue.database_type_id);
			return setValue(currentDispatcherValue.database_type_id);
		}
	}, [currentDispatcherValue]);*/

	//console.log(value, currentDispatcherValue);

	return (
		<>
			<div>Would you like to use database?</div>
			<Select
				open={open}
				onOpenChange={setOpen}
				value={String(value) || parseInt(value) === 0 ? String(value) : ''}
				onValueChange={(currentValue) => {
					if (databaseTypes[parseInt(String(currentValue))].database_type_name !== 'Other') {
						//console.log('currentValue', currentValue);
						setValue(parseInt(String(currentValue)) === parseInt(value) ? '' : currentValue);
						return setOpen(false);
					}

					setShowInput(true);
					setValue(currentValue);
					return setOpen(false);
				}}
			>
				<SelectTrigger className='w-full' onClick={() => (showInput ? (setShowInput(false), setValue('')) : null)}>
					<SelectValue placeholder='Select database type' />
				</SelectTrigger>
				<SelectContent>
					{databaseTypes.length > 0
						? databaseTypes.map((p) => (
								<SelectItem key={p.database_type_id} value={String(p.database_type_id)}>
									{p.database_type_name}
								</SelectItem>
						  ))
						: null}
				</SelectContent>
			</Select>
			<div className={showInput ? 'flex flex-row gap-1' : 'hidden'}>
				<Input placeholder='' value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
				<Button
					onClick={() => {
						setValue('');
						setInputValue('');
						return setShowInput(false);
					}}
				>
					Cancel
				</Button>
				<Button
					onClick={() => {
						if (
							!currentDispatcherValue.find(
								(dbtypes) => String(dbtypes.database_type_name).toLocaleLowerCase() === inputValue.toLocaleLowerCase()
							)
						) {
							dispatcher({
								payload: {
									database_type_id:
										Math.max(
											...databaseTypes.map((dbtypes) => dbtypes.database_type_id),
											...currentDispatcherValue.map((dbtypes) => dbtypes.database_type_id)
										) + 1,
									database_type_name: inputValue,
								},
								type: 'setDatabaseTypes',
							});
							setValue('');
							setInputValue('');
							return setShowInput(false);
						} else {
							toast({
								title: 'Error',
								description: 'Database type is already on your list',
								variant: 'destructive',
								action: <ToastAction altText='Close'>Close</ToastAction>,
							});
						}
					}}
				>
					Add custom database type
				</Button>
			</div>
		</>
	);
}
