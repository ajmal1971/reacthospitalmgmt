import toast from "react-hot-toast"

export const notify = {
    succes: (message) => {
        toast.success(message,
            {
                duration: 5000,
                style: {
                    borderRadius: '5px',
                    background: '#333',
                    color: '#fff'
                }
            }
        );
    },

    error: (message) => {
        toast.error(message,
            {
                duration: 5000,
                style: {
                    borderRadius: '5px',
                    background: '#333',
                    color: '#fff'
                }
            }
        );
    }
};

export const dateFormat = (dateString) => {
    if (dateString) {
        const dateObj = new Date(dateString);
        if (!isNaN(dateObj.valueOf())) {
            return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(dateObj);
        }

        return null;
    }
}