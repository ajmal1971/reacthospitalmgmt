const Footer = () => {
    return (
        <footer className="mt-5 bg-gray-300 text-center lg:text-left">
            <div className="p-4 text-center text-gray-800">
                © {new Date().getFullYear()} Hospital Management System all rights reserved.
            </div>
        </footer>
    );
};

export default Footer;