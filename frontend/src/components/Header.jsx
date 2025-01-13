import { FaBars } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { formatDate } from '../utils/formatDate';

export default function Header({ toggleSidebar }) {
    const { user } = useSelector((state) => state.auth);
    const currentDate = new Date();
    return (
        <div className="sticky top-0 flex items-center justify-between w-full bg-white px-2 py-4 rounded-lg">
            <div className="flex items-center gap-2 text-2xl font-semibold text-[#282828] uppercase">
                <div className="md:hidden rounded flex items-center justify-center cursor-pointer">
                    <FaBars className="text-xl" onClick={toggleSidebar} />
                </div>
                <h3 className='w-full font-semibold md:text-xl text-lg text-gray-700'>
                    WELCOME {user ? user?.name :'User'}
                </h3>
            </div>
            <span
                className=' md:text-md text-xs'
            >
                {formatDate(currentDate)}
            </span>
        </div>
    )
}