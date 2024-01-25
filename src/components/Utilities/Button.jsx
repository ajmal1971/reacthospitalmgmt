/* eslint-disable react/prop-types */
import { ProgressSpinner } from 'primereact/progressspinner';

const Button = ({children,type = 'button', className, onClickEvent = null, isLoading = false, ...props}) => {
    return (
        <button type={type} className={`bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl text-white px-4 py-1 rounded ${className}`} {...props} onClick={onClickEvent} disabled={isLoading}>
            <span>{children}</span> {isLoading ? (<ProgressSpinner style={{width: '1.25rem', height: '1.25rem', verticalAlign: 'middle'}} strokeWidth='6'></ProgressSpinner>) : null}
        </button>
    );
};

export default Button;