//import ButtonComponent from './buttonComponent';
import {readFile} from '../actions';
import StackPickerComponent from './stackPickerComponent';
//import fakeApi from '@/components/fakeapi/options_for_stackpicker_v2.json';
//import fakeApiBackendAddons from '@/components/fakeApi/backend_addons.json';

export default async function StackPicker() {
	const fakeApi = await readFile('/src/components/fakeapi/options_for_stackpicker_v2.json');
	const fakeApiBackendAddons = await readFile('/src/components/fakeApi/backend_addons.json');

	//console.log(fakeApiBackendAddons);

	return (
		<div className='flex flex-col gap-5 p-5'>
			<StackPickerComponent fakeApi={fakeApi} fakeApiBackendAddons={fakeApiBackendAddons} />
		</div>
	);
}
