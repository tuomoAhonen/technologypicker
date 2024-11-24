import ButtonComponent from './buttonComponent';
import StackPickerComponent from './stackPickerComponent';

export default function StackPicker() {
	return (
		<div className='flex flex-col gap-5 p-5'>
			<div className='w-fit h-fit justify-self-end ml-auto'>
				<ButtonComponent />
			</div>
			<StackPickerComponent />
		</div>
	);
}
