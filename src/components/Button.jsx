/* eslint-disable react/prop-types */

const Button = ({children,type = 'button', className, onClickEvent = null,...props}) => {
    return (
        <button type={type} className={`bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl text-white px-4 py-1 rounded mt-2 ${className}`} {...props} onClick={onClickEvent}>
            <span>{children}</span>
        </button>
    );
};

export default Button;