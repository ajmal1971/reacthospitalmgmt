/* eslint-disable react/prop-types */

const Button = ({children,type = 'button',bgColor = 'bg-blue-300', textColor = 'text-gray-800',className,...props}) => {
    return (
        <button type={type} className={`hover:bg-gray-400 font-bold py-2 px-4 rounded inline-flex items-center justify-center ${bgColor} ${textColor} ${className}`} {...props}>
            <span>{children}</span>
        </button>
    );
};

export default Button;