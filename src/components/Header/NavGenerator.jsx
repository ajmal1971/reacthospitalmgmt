/* eslint-disable react/prop-types */
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { switchPage } from '../../store/pageSwitchSlice';
import { PageSwitch } from '../../shared/AppEnum';

const NavGenerator = ({navItem}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const navigateToPath = (path) => {
        dispatch(switchPage({pageIndex: PageSwitch.ViewPage, switchData: null}));
        navigate(path);
    }

    return (
        <>
           {
            navItem.children.length > 0 ? (
                <div key={navItem.name} className="relative" onClick={toggleDropdown}>
                    <button className="flex flex-row items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-left bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:focus:bg-gray-600 dark-mode:hover:bg-gray-600 md:w-auto md:inline md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                        <span>{navItem.name}</span>
                        <svg fill="currentColor" viewBox="0 0 20 20" className={`inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}>
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 w-full mt-2 origin-top-right rounded-md shadow-lg md:w-48">
                            <div className="px-2 py-2 bg-white rounded-md shadow dark-mode:bg-gray-800">
                                {
                                    navItem.children.map((child) => (
                                        <NavGenerator navItem={child} key={child.name}/>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <button key={navItem.name} onClick={() => navigateToPath(navItem.path)} className="px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent  dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                    {navItem.name}
                </button>
            )
           } 
        </>
    );
};

export default NavGenerator;