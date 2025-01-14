import { FaBars } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { formatDate } from '../utils/formatDate';

export default function Header({ toggleSidebar }) {
    const { user } = useSelector((state) => state.auth);
    const currentDate = new Date();
    return (
        <div className="sticky top-0 z-[6] flex gap-4 w-full bg-white px-2 py-4 rounded-lg">
            <div className="lg:hidden rounded flex items-center justify-center cursor-pointer">
                <FaBars className="text-xl" onClick={toggleSidebar} />
            </div>
            <div className="flex-1 flex md:flex-row flex-col md:items-center justify-between text-2xl font-semibold text-[#282828] uppercase">

                <h3 className='w-full font-semibold md:text-xl text-lg text-gray-700'>
                    WELCOME {user ? user?.name : 'User'}
                </h3>
                <p
                    className='md:text-md text-xs text-nowrap'
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {formatDate(currentDate)}
                </p>
            </div>
        </div>
    );
}
