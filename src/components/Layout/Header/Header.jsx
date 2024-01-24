import {NavGenerator} from '../../index.js'
// import {useNavigate} from 'react-router-dom';

const Header = () => {
    // const navigate = useNavigate();

    const navItems = [
        {
            name: 'Home',
            path: '/',
            active: true,
            isChild: false,
            children: []
        },
        {
            name: 'Hospital',
            path: '/hospital',
            // active: authStatus,
            isChild: false,
            children: [
                {
                    name: 'Departments',
                    path: '/departments',
                    // active: !authStatus
                    isChild: true,
                    children: []
                },
                {
                    name: 'Doctors',
                    path: '/doctors',
                    // active: !authStatus
                    isChild: true,
                    children: []
                },
                {
                    name: 'Medicines',
                    path: '/medicines',
                    // active: !authStatus
                    isChild: true,
                    children: []
                }
            ]
        },
        {
            name: 'Patient',
            path: '/patient',
            isChild: false,
            children: [
                {
                    name: 'Patient',
                    path: '/patient',
                    // active: !authStatus
                    isChild: true,
                    children: []
                },
                {
                    name: 'Appointment',
                    path: '/appointment',
                    // active: !authStatus
                    isChild: true,
                    children: []
                }
            ]
        },
        {
            name: 'About',
            path: '/about',
            isChild: false,
            // active: !authStatus,
            children: []
        },
        {
            name: 'Contact',
            path: '/contact',
            isChild: false,
            // active: !authStatus
            children: []
        }
    ];

    return (
        <div className="w-full text-gray-800 bg-gray-300 border-b border-gray-500">
            <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
                
                <div className="p-4 flex flex-row items-center justify-between">
                <a href="#" className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline">
                    Hospital Management System
                </a>
                <button className="md:hidden rounded-lg focus:outline-none focus:shadow-outline"></button>
                </div>

                <nav className='flex-col flex-grow pb-4 md:pb-0 hidden md:flex md:justify-end md:flex-row'>
                    {
                        navItems.map(item =>
                            <NavGenerator navItem={item} key={item.name}/>
                        )
                    }
                </nav>
            </div>
        </div>
    );
};

export default Header;