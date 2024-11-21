'use client';

import {useEffect, useReducer, useState} from 'react';
import {Check, ChevronsUpDown, SquareXIcon} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {ToastAction} from '@/components/ui/toast';
import {toast, useToast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';
import {Input} from '../ui/input';

const initializer = {
	topic: {topic_id: null, topic_name: null},
	target_device: {platform_id: null, platform_name: null},
	programming_language: {programming_language_id: null, programming_language_name: null},
	addons: [],
	database_needs: {database_is_needed: false, database_type: null},
	databases: {
		database_as_local: {database_local_id: null, database_local_name: null},
		database_as_program: {database_program_id: null, database_program_name: null},
		database_as_service: {database_service_id: null, database_service_name: null},
	},
};

function stackReducer(state: any, action: {payload: any; type: string}) {
	console.log(action);
	switch (action.type) {
		case 'setTopic':
			return {...state, topic: {topic_id: action.payload.topic_id, topic_name: action.payload.topic_name}};
		case 'setTargetDevice':
			return {
				...state,
				target_device: {
					platform_id: action.payload.platform_id,
					platform_name: action.payload.platform_name,
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
		case 'setAddons':
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
			};
		case 'setDatabaseNeeds':
			return state;
		case 'setDatabases':
			return state;
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
	const [user, setUser] = useState({user_id: null, user_email: null, username: null});
	const route = useRouter();

	const returnToBeginning = () => {
		stackReducerDispatcher({payload: null, type: 'resetStack'});
		return setQuestionShown(1);
	};

	return (
		<div className='flex flex-col gap-5'>
			<div className='flex flex-row gap-5'>
				<Button onClick={() => returnToBeginning()}>Reset all</Button>
				<Button onClick={() => (questionShown > 1 ? setQuestionShown(questionShown - 1) : null)}>Last question</Button>
				<Button onClick={() => (questionShown < 7 ? setQuestionShown(questionShown + 1) : null)}>Next please</Button>
				<Button onClick={() => route.push('/stackpicker')}>Skip this, I am pro</Button>
			</div>
			<div className='font-bold text-lg'>{`Question number ${questionShown} out of 7`}</div>
			{questionShown === 1 ? (
				<QuestionNumberOne user={user} setQuestionShown={setQuestionShown} />
			) : questionShown === 2 ? (
				<QuestionNumberTwo currentDispatcherValue={stackReducerValue.topic} dispatcher={stackReducerDispatcher} />
			) : questionShown === 3 ? (
				<QuestionNumberThree
					currentDispatcherValue={stackReducerValue.target_device}
					dispatcher={stackReducerDispatcher}
				/>
			) : questionShown === 4 ? (
				<QuestionNumberFour
					currentDispatcherValue={stackReducerValue.programming_language}
					dispatcher={stackReducerDispatcher}
				/>
			) : questionShown === 5 ? (
				<QuestionNumberFive currentDispatcherValue={stackReducerValue.addons} dispatcher={stackReducerDispatcher} />
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

function QuestionNumberOne({
	user,
	setQuestionShown,
}: {
	user: {user_id: any; user_email: any; username: any};
	setQuestionShown: any;
}) {
	const {toast} = useToast();

	return (
		<>
			<div>
				{`Greetings ${
					user?.user_id ? user.username : 'stranger'
				}! I am your technology wizard and I will assist you today
				to choose correct technology stack for your project, that will indeed be a success, if it is up to me.`}
			</div>
			{!user.user_id ? (
				<div className='flex flex-col gap-1'>
					<div>Would you like to login?</div>
					<Button
						onClick={() =>
							toast({
								variant: 'destructive',
								title: 'Missing component',
								description: 'Login is not avaiable, please continue',
								action: (
									<ToastAction altText='Okay' onClick={() => setQuestionShown((previous: number) => previous + 1)}>
										Okay
									</ToastAction>
								),
							})
						}
					>
						Login
					</Button>
				</div>
			) : null}
		</>
	);
}

function QuestionNumberTwo({currentDispatcherValue, dispatcher}: {currentDispatcherValue: any; dispatcher: any}) {
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<undefined | number>(undefined);

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

	useEffect(() => {
		if ((value || value === 0) && value !== currentDispatcherValue.topic_id) {
			return dispatcher({payload: topics[value], type: 'setTopic'});
		}
	}, [value]);

	useEffect(() => {
		if (
			(currentDispatcherValue?.topic_id || currentDispatcherValue.topic_id === 0) &&
			currentDispatcherValue.topic_id !== value
		) {
			//console.log('setValue', currentDispatcherValue.topic_id);
			return setValue(currentDispatcherValue.topic_id);
		}
	}, [currentDispatcherValue]);

	return (
		<>
			<div>What is your project about? Do you have topic for it?</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild className='w-full'>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
						{value || value === 0 ? topics.find((topic) => topic.topic_id === value)?.topic_name : 'Select topic'}
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
											setValue(parseInt(String(currentValue)) === value ? value : parseInt(String(currentValue)));
											return setOpen(false);
										}}
									>
										{topic.topic_name}
										<Check className={cn('ml-auto', value === topic.topic_id ? 'opacity-100' : 'opacity-0')} />
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</>
	);
}

function QuestionNumberThree({currentDispatcherValue, dispatcher}: {currentDispatcherValue: any; dispatcher: any}) {
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<undefined | number>(undefined);

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
	];

	useEffect(() => {
		if ((value || value === 0) && value !== currentDispatcherValue.platform_id) {
			return dispatcher({payload: platforms[value], type: 'setTargetDevice'});
		}
	}, [value]);

	useEffect(() => {
		if (
			(currentDispatcherValue?.platform_id || currentDispatcherValue.platform_id === 0) &&
			currentDispatcherValue.platform_id !== value
		) {
			//console.log('setValue', currentDispatcherValue.platform_id);
			return setValue(currentDispatcherValue.platform_id);
		}
	}, [currentDispatcherValue]);

	//console.log(value, currentDispatcherValue);

	return (
		<>
			<div>What is the target platform?</div>
			<Select
				open={open}
				onOpenChange={setOpen}
				value={value || value === 0 ? String(value) : undefined}
				onValueChange={(currentValue) => {
					//console.log('currentValue', currentValue);
					setValue(parseInt(String(currentValue)) === value ? value : parseInt(String(currentValue)));
					return setOpen(false);
				}}
			>
				<SelectTrigger className='w-full'>
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
		</>
	);
}

function QuestionNumberFour({currentDispatcherValue, dispatcher}: {currentDispatcherValue: any; dispatcher: any}) {
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<undefined | number>(undefined);

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

	useEffect(() => {
		if ((value || value === 0) && value !== currentDispatcherValue.programming_language_id) {
			return dispatcher({payload: programmingLanguages[value], type: 'setProgrammingLanguage'});
		}
	}, [value]);

	useEffect(() => {
		if (
			(currentDispatcherValue?.programming_language_id || currentDispatcherValue.programming_language_id === 0) &&
			currentDispatcherValue.programming_language_id !== value
		) {
			//console.log('setValue', currentDispatcherValue.programming_language_id);
			return setValue(currentDispatcherValue.programming_language_id);
		}
	}, [currentDispatcherValue]);

	return (
		<>
			<div>Which programming language, would you like to use as your main programming language?</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild className='w-full'>
					<Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between'>
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
											setValue(parseInt(String(currentValue)) === value ? value : parseInt(String(currentValue)));
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
		</>
	);
}

function QuestionNumberFive({currentDispatcherValue, dispatcher}: {currentDispatcherValue: any[]; dispatcher: any}) {
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
			!currentDispatcherValue.find((addon: {addon_id: number; addon_name: string}) => addon.addon_id === value)
		) {
			dispatcher({payload: addons[value], type: 'setAddons'});
			return setValue(undefined);
		}
	}, [value]);

	/*useEffect(() => {
		if (
			(currentDispatcherValue?.addon_id || currentDispatcherValue.addon_id === 0) &&
			currentDispatcherValue.addon_id !== value
		) {
			//console.log('setValue', currentDispatcherValue.addon_id);
			return setValue(currentDispatcherValue.addon_id);
		}
	}, [currentDispatcherValue]);*/

	console.log(currentDispatcherValue);

	return (
		<>
			<div>Would you like to use any specific addons in your project? Libraries? Tools?</div>
			<div className='flex flex-col gap-1'>
				<div className='flex flex-row gap-1'>
					{currentDispatcherValue.length > 0 ? (
						currentDispatcherValue.map((addon: {addon_id: number; addon_name: string}) => (
							<div
								key={addon.addon_id}
								onClick={() => dispatcher({payload: {addon_id: addon.addon_id}, type: 'deleteAddon'})}
								className='flex flex-row gap-1 border rounded p-1'
							>
								<div>{addon.addon_name}</div>
								<SquareXIcon />
							</div>
						))
					) : (
						<div className='border rounded p-1'>No addons</div>
					)}
				</div>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild className='w-full'>
						<Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between pl-1'>
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
					<Button
						onClick={() => {
							setInputValue('');
							return setShowInput(false);
						}}
					>
						Cancel
					</Button>
				</div>
			</div>
		</>
	);
}
